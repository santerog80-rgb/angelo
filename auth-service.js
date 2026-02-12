// ============================================
// Authentication Service with Supabase
// Email Confirmation & Password Recovery
// ============================================

import { supabase } from './supabase-config.js';

const AuthService = {
    /**
     * Registrar novo usuário com confirmação de email
     */
    async register(userData) {
        try {
            const { email, password, name, phone, type, storeName, businessType } = userData;
            
            // Validações
            if (!this.validateEmail(email)) {
                throw new Error('Email inválido');
            }
            
            if (!this.validatePassword(password)) {
                throw new Error('Senha deve ter pelo menos 8 caracteres, incluindo maiúsculas, minúsculas e números');
            }
            
            if (!this.validatePhone(phone)) {
                throw new Error('Telefone inválido. Use o formato: 258 84 000 0000');
            }
            
            // 1. Criar usuário no Supabase Auth
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: email,
                password: password,
                options: {
                    emailRedirectTo: `${window.location.origin}/email-confirmed`,
                    data: {
                        name: name,
                        phone: phone,
                        type: type
                    }
                }
            });
            
            if (authError) {
                throw authError;
            }
            
            // 2. Criar perfil do usuário na tabela users
            const { data: userData, error: userError } = await supabase
                .from('users')
                .insert([
                    {
                        id: authData.user.id,
                        email: email,
                        phone: this.formatPhone(phone),
                        name: name,
                        type: type,
                        store_name: type === 'seller' ? storeName : null,
                        business_type: type === 'seller' ? businessType : null,
                        status: type === 'seller' ? 'pending' : 'active',
                        verified: false
                    }
                ])
                .select()
                .single();
            
            if (userError) {
                // Se falhar ao criar perfil, deletar usuário do auth
                await supabase.auth.admin.deleteUser(authData.user.id);
                throw userError;
            }
            
            // 3. Registrar atividade
            await this.logActivity({
                user_id: authData.user.id,
                action: 'user_registered',
                entity_type: 'user',
                entity_id: authData.user.id,
                metadata: { type, email }
            });
            
            // 4. Criar notificação de boas-vindas
            await this.createNotification({
                user_id: authData.user.id,
                type: 'welcome',
                title: 'Bem-vindo ao MozCommerce!',
                message: type === 'seller' 
                    ? 'Sua conta de vendedor foi criada. Aguarde a aprovação do administrador para começar a vender.'
                    : 'Sua conta foi criada com sucesso! Verifique seu email para confirmar sua conta.'
            });
            
            // 5. Se for vendedor, notificar admin
            if (type === 'seller') {
                await this.notifyAdminNewSeller(userData);
            }
            
            return {
                success: true,
                user: userData,
                message: 'Conta criada com sucesso! Verifique seu email para confirmar sua conta.',
                requiresEmailConfirmation: true
            };
            
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    },
    
    /**
     * Login do usuário
     */
    async login(email, password) {
        try {
            // 1. Fazer login no Supabase Auth
            const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
                email: email,
                password: password
            });
            
            if (authError) {
                throw authError;
            }
            
            // 2. Verificar se email foi confirmado
            if (!authData.user.email_confirmed_at) {
                throw new Error('Por favor, confirme seu email antes de fazer login. Verifique sua caixa de entrada.');
            }
            
            // 3. Buscar dados completos do usuário
            const { data: userData, error: userError } = await supabase
                .from('users')
                .select('*')
                .eq('id', authData.user.id)
                .single();
            
            if (userError) {
                throw userError;
            }
            
            // 4. Verificar status da conta
            if (userData.status === 'suspended') {
                throw new Error('Sua conta foi suspensa. Contacte o suporte.');
            }
            
            if (userData.status === 'banned') {
                throw new Error('Sua conta foi banida.');
            }
            
            if (userData.type === 'seller' && userData.status === 'pending') {
                throw new Error('Sua conta de vendedor ainda não foi aprovada. Aguarde a aprovação do administrador.');
            }
            
            // 5. Registrar atividade
            await this.logActivity({
                user_id: userData.id,
                action: 'user_login',
                entity_type: 'user',
                entity_id: userData.id
            });
            
            // 6. Salvar no localStorage
            localStorage.setItem('mozcommerce_user', JSON.stringify(userData));
            
            return {
                success: true,
                user: userData,
                session: authData.session
            };
            
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    },
    
    /**
     * Logout do usuário
     */
    async logout() {
        try {
            const { error } = await supabase.auth.signOut();
            
            if (error) {
                throw error;
            }
            
            // Limpar localStorage
            localStorage.removeItem('mozcommerce_user');
            localStorage.removeItem('mozcommerce_cart');
            
            return { success: true };
            
        } catch (error) {
            console.error('Logout error:', error);
            throw error;
        }
    },
    
    /**
     * Solicitar recuperação de senha
     */
    async requestPasswordReset(email) {
        try {
            if (!this.validateEmail(email)) {
                throw new Error('Email inválido');
            }
            
            // 1. Enviar email de recuperação
            const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`
            });
            
            if (error) {
                throw error;
            }
            
            // 2. Buscar usuário
            const { data: userData } = await supabase
                .from('users')
                .select('id')
                .eq('email', email)
                .single();
            
            // 3. Criar notificação
            if (userData) {
                await this.createNotification({
                    user_id: userData.id,
                    type: 'password_reset',
                    title: 'Recuperação de Senha',
                    message: 'Um link de recuperação de senha foi enviado para seu email.'
                });
                
                // 4. Registrar atividade
                await this.logActivity({
                    user_id: userData.id,
                    action: 'password_reset_requested',
                    entity_type: 'user',
                    entity_id: userData.id
                });
            }
            
            return {
                success: true,
                message: 'Se o email existir em nossa base de dados, você receberá um link de recuperação.'
            };
            
        } catch (error) {
            console.error('Password reset request error:', error);
            // Não revelar se o email existe ou não (segurança)
            return {
                success: true,
                message: 'Se o email existir em nossa base de dados, você receberá um link de recuperação.'
            };
        }
    },
    
    /**
     * Redefinir senha
     */
    async resetPassword(newPassword) {
        try {
            if (!this.validatePassword(newPassword)) {
                throw new Error('Senha deve ter pelo menos 8 caracteres, incluindo maiúsculas, minúsculas e números');
            }
            
            // 1. Atualizar senha
            const { data, error } = await supabase.auth.updateUser({
                password: newPassword
            });
            
            if (error) {
                throw error;
            }
            
            // 2. Registrar atividade
            await this.logActivity({
                user_id: data.user.id,
                action: 'password_reset_completed',
                entity_type: 'user',
                entity_id: data.user.id
            });
            
            // 3. Criar notificação
            await this.createNotification({
                user_id: data.user.id,
                type: 'password_changed',
                title: 'Senha Alterada',
                message: 'Sua senha foi alterada com sucesso.'
            });
            
            return {
                success: true,
                message: 'Senha alterada com sucesso!'
            };
            
        } catch (error) {
            console.error('Password reset error:', error);
            throw error;
        }
    },
    
    /**
     * Reenviar email de confirmação
     */
    async resendConfirmationEmail(email) {
        try {
            const { data, error } = await supabase.auth.resend({
                type: 'signup',
                email: email,
                options: {
                    emailRedirectTo: `${window.location.origin}/email-confirmed`
                }
            });
            
            if (error) {
                throw error;
            }
            
            return {
                success: true,
                message: 'Email de confirmação reenviado!'
            };
            
        } catch (error) {
            console.error('Resend confirmation error:', error);
            throw error;
        }
    },
    
    /**
     * Verificar sessão atual
     */
    async checkSession() {
        try {
            const { data: { session }, error } = await supabase.auth.getSession();
            
            if (error) {
                throw error;
            }
            
            if (!session) {
                return null;
            }
            
            // Buscar dados completos do usuário
            const { data: userData, error: userError } = await supabase
                .from('users')
                .select('*')
                .eq('id', session.user.id)
                .single();
            
            if (userError) {
                throw userError;
            }
            
            return {
                user: userData,
                session: session
            };
            
        } catch (error) {
            console.error('Session check error:', error);
            return null;
        }
    },
    
    /**
     * Atualizar perfil do usuário
     */
    async updateProfile(userId, updates) {
        try {
            const { data, error } = await supabase
                .from('users')
                .update(updates)
                .eq('id', userId)
                .select()
                .single();
            
            if (error) {
                throw error;
            }
            
            // Atualizar localStorage
            localStorage.setItem('mozcommerce_user', JSON.stringify(data));
            
            // Registrar atividade
            await this.logActivity({
                user_id: userId,
                action: 'profile_updated',
                entity_type: 'user',
                entity_id: userId,
                metadata: { updated_fields: Object.keys(updates) }
            });
            
            return {
                success: true,
                user: data
            };
            
        } catch (error) {
            console.error('Update profile error:', error);
            throw error;
        }
    },
    
    /**
     * Validar email
     */
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },
    
    /**
     * Validar senha (mínimo 8 caracteres, 1 maiúscula, 1 minúscula, 1 número)
     */
    validatePassword(password) {
        if (password.length < 8) return false;
        if (!/[a-z]/.test(password)) return false;
        if (!/[A-Z]/.test(password)) return false;
        if (!/[0-9]/.test(password)) return false;
        return true;
    },
    
    /**
     * Validar telefone moçambicano
     */
    validatePhone(phone) {
        const cleaned = phone.replace(/\D/g, '');
        return /^258[0-9]{9}$/.test(cleaned) || /^[0-9]{9}$/.test(cleaned);
    },
    
    /**
     * Formatar telefone
     */
    formatPhone(phone) {
        const cleaned = phone.replace(/\D/g, '');
        if (cleaned.startsWith('258')) {
            return cleaned;
        }
        const withoutZero = cleaned.startsWith('0') ? cleaned.substring(1) : cleaned;
        return '258' + withoutZero;
    },
    
    /**
     * Registrar atividade
     */
    async logActivity(activityData) {
        try {
            const { error } = await supabase
                .from('activity_logs')
                .insert([{
                    ...activityData,
                    ip_address: await this.getIpAddress(),
                    user_agent: navigator.userAgent
                }]);
            
            if (error) {
                console.error('Log activity error:', error);
            }
        } catch (error) {
            console.error('Log activity error:', error);
        }
    },
    
    /**
     * Criar notificação
     */
    async createNotification(notificationData) {
        try {
            const { error } = await supabase
                .from('notifications')
                .insert([notificationData]);
            
            if (error) {
                console.error('Create notification error:', error);
            }
        } catch (error) {
            console.error('Create notification error:', error);
        }
    },
    
    /**
     * Notificar admin sobre novo vendedor
     */
    async notifyAdminNewSeller(sellerData) {
        try {
            // Buscar todos os admins
            const { data: admins, error } = await supabase
                .from('users')
                .select('id')
                .eq('type', 'admin');
            
            if (error || !admins) {
                return;
            }
            
            // Criar notificação para cada admin
            const notifications = admins.map(admin => ({
                user_id: admin.id,
                type: 'new_seller',
                title: 'Novo Vendedor Registrado',
                message: `${sellerData.name} (${sellerData.store_name}) se registrou como vendedor e aguarda aprovação.`,
                link: `/admin/sellers/${sellerData.id}`
            }));
            
            await supabase
                .from('notifications')
                .insert(notifications);
            
        } catch (error) {
            console.error('Notify admin error:', error);
        }
    },
    
    /**
     * Obter IP do usuário
     */
    async getIpAddress() {
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            return data.ip;
        } catch (error) {
            return null;
        }
    }
};

// ============================================
// Email Templates (Para configurar no Supabase)
// ============================================

/*
CONFIGURAR EM: Authentication > Email Templates

1. CONFIRM SIGNUP
Subject: Confirme seu email - MozCommerce

Olá {{ .Email }},

Bem-vindo ao MozCommerce - O maior marketplace digital de Moçambique!

Por favor, confirme seu endereço de email clicando no link abaixo:

{{ .ConfirmationURL }}

Este link expira em 24 horas.

Se você não criou uma conta no MozCommerce, por favor ignore este email.

Obrigado,
Equipe MozCommerce

---

2. RESET PASSWORD
Subject: Recuperação de Senha - MozCommerce

Olá {{ .Email }},

Recebemos uma solicitação para redefinir a senha da sua conta MozCommerce.

Clique no link abaixo para criar uma nova senha:

{{ .ConfirmationURL }}

Este link expira em 1 hora.

Se você não solicitou a recuperação de senha, por favor ignore este email. Sua senha permanecerá inalterada.

Obrigado,
Equipe MozCommerce

---

3. EMAIL CHANGE
Subject: Confirme a alteração de email - MozCommerce

Olá,

Você solicitou a alteração do email da sua conta MozCommerce.

Para confirmar a alteração para {{ .NewEmail }}, clique no link abaixo:

{{ .ConfirmationURL }}

Este link expira em 24 horas.

Se você não solicitou esta alteração, por favor entre em contato com nosso suporte imediatamente.

Obrigado,
Equipe MozCommerce
*/

export default AuthService;
