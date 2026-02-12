// ============================================
// Main Application with Supabase Integration
// ============================================

import { supabase } from './supabase-config.js';
import AuthService from './auth-service.js';

// ============================================
// Global State
// ============================================

const App = {
    currentUser: null,
    cart: [],
    products: [],
    categories: [],
    
    async init() {
        console.log('🚀 Initializing MozCommerce...');
        
        // Verificar sessão
        await this.checkSession();
        
        // Inicializar componentes
        this.initializeEventListeners();
        this.initializeAuthForms();
        
        // Carregar dados
        await this.loadCategories();
        await this.loadProducts();
        await this.loadStats();
        
        // Carregar carrinho
        this.loadCart();
        
        // Esconder loading screen
        this.hideLoadingScreen();
        
        // Verificar hash para recuperação de senha
        this.checkPasswordResetHash();
        
        console.log('✅ MozCommerce initialized');
    },
    
    async checkSession() {
        const session = await AuthService.checkSession();
        
        if (session) {
            this.currentUser = session.user;
            this.updateUIForAuthenticatedUser();
        }
    },
    
    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            setTimeout(() => {
                loadingScreen.style.opacity = '0';
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 300);
            }, 500);
        }
    },
    
    initializeEventListeners() {
        // Search
        document.getElementById('openSearch')?.addEventListener('click', () => this.openSearch());
        document.getElementById('closeSearch')?.addEventListener('click', () => this.closeSearch());
        document.getElementById('searchBtn')?.addEventListener('click', () => this.performSearch());
        
        // Auth buttons
        document.getElementById('loginBtn')?.addEventListener('click', () => this.openModal('loginModal'));
        document.getElementById('registerBtn')?.addEventListener('click', () => this.openModal('registerModal'));
        document.getElementById('logoutBtn')?.addEventListener('click', () => this.logout());
        document.getElementById('becomeSellerBtn')?.addEventListener('click', () => this.openSellerRegistration());
        document.getElementById('footerBecomeSellerLink')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.openSellerRegistration();
        });
        
        // Forgot password
        document.getElementById('forgotPasswordLink')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.switchModal('loginModal', 'forgotPasswordModal');
        });
        
        // Register type selector
        document.querySelectorAll('.type-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.type-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                
                const type = e.target.dataset.type;
                const sellerFields = document.querySelector('.seller-fields');
                if (sellerFields) {
                    sellerFields.style.display = type === 'seller' ? 'block' : 'none';
                }
            });
        });
        
        // User dropdown
        document.getElementById('userAvatarBtn')?.addEventListener('click', () => {
            const dropdown = document.getElementById('dropdownMenu');
            dropdown?.classList.toggle('active');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            const dropdown = document.getElementById('dropdownMenu');
            const btn = document.getElementById('userAvatarBtn');
            
            if (dropdown && btn && !dropdown.contains(e.target) && !btn.contains(e.target)) {
                dropdown.classList.remove('active');
            }
        });
        
        // Dashboard link
        document.getElementById('dashboardLink')?.addEventListener('click', (e) => {
            e.preventDefault();
            if (this.currentUser?.type === 'seller') {
                window.location.href = 'seller-dashboard.html';
            } else {
                window.location.href = 'buyer-dashboard.html';
            }
        });
    },
    
    initializeAuthForms() {
        // Login Form
        const loginForm = document.getElementById('loginForm');
        loginForm?.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleLogin(e.target);
        });
        
        // Register Form
        const registerForm = document.getElementById('registerForm');
        registerForm?.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleRegister(e.target);
        });
        
        // Forgot Password Form
        const forgotPasswordForm = document.getElementById('forgotPasswordForm');
        forgotPasswordForm?.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleForgotPassword(e.target);
        });
        
        // Reset Password Form
        const resetPasswordForm = document.getElementById('resetPasswordForm');
        resetPasswordForm?.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleResetPassword(e.target);
        });
        
        // Resend Confirmation
        document.getElementById('resendConfirmationBtn')?.addEventListener('click', async () => {
            const email = document.getElementById('confirmEmail')?.textContent;
            if (email) {
                await this.resendConfirmation(email);
            }
        });
    },
    
    async handleLogin(form) {
        const formData = new FormData(form);
        const submitBtn = form.querySelector('button[type="submit"]');
        
        this.setButtonLoading(submitBtn, true);
        
        try {
            const result = await AuthService.login(
                formData.get('email'),
                formData.get('password')
            );
            
            this.currentUser = result.user;
            this.updateUIForAuthenticatedUser();
            this.closeModal('loginModal');
            this.showNotification('Login realizado com sucesso!', 'success');
            
            // Redirecionar se for vendedor
            if (result.user.type === 'seller') {
                setTimeout(() => {
                    window.location.href = 'seller-dashboard.html';
                }, 1000);
            }
            
        } catch (error) {
            this.showNotification(error.message, 'error');
        } finally {
            this.setButtonLoading(submitBtn, false);
        }
    },
    
    async handleRegister(form) {
        const formData = new FormData(form);
        const submitBtn = form.querySelector('button[type="submit"]');
        const activeType = document.querySelector('.type-btn.active')?.dataset.type || 'buyer';
        
        this.setButtonLoading(submitBtn, true);
        
        try {
            const userData = {
                email: formData.get('email'),
                password: formData.get('password'),
                name: formData.get('name'),
                phone: formData.get('phone'),
                type: activeType
            };
            
            if (activeType === 'seller') {
                userData.storeName = formData.get('storeName');
                userData.businessType = formData.get('businessType');
            }
            
            const result = await AuthService.register(userData);
            
            this.closeModal('registerModal');
            
            // Mostrar modal de confirmação de email
            document.getElementById('confirmEmail').textContent = userData.email;
            this.openModal('emailConfirmationModal');
            
            form.reset();
            
        } catch (error) {
            this.showNotification(error.message, 'error');
        } finally {
            this.setButtonLoading(submitBtn, false);
        }
    },
    
    async handleForgotPassword(form) {
        const formData = new FormData(form);
        const submitBtn = form.querySelector('button[type="submit"]');
        
        this.setButtonLoading(submitBtn, true);
        
        try {
            const result = await AuthService.requestPasswordReset(formData.get('email'));
            
            this.showNotification(result.message, 'success');
            this.closeModal('forgotPasswordModal');
            form.reset();
            
        } catch (error) {
            this.showNotification(error.message, 'error');
        } finally {
            this.setButtonLoading(submitBtn, false);
        }
    },
    
    async handleResetPassword(form) {
        const formData = new FormData(form);
        const submitBtn = form.querySelector('button[type="submit"]');
        const password = formData.get('password');
        const confirmPassword = formData.get('confirmPassword');
        
        if (password !== confirmPassword) {
            this.showNotification('As senhas não coincidem', 'error');
            return;
        }
        
        this.setButtonLoading(submitBtn, true);
        
        try {
            const result = await AuthService.resetPassword(password);
            
            this.showNotification(result.message, 'success');
            this.closeModal('resetPasswordModal');
            
            // Redirecionar para login
            setTimeout(() => {
                window.location.href = '/';
            }, 2000);
            
        } catch (error) {
            this.showNotification(error.message, 'error');
        } finally {
            this.setButtonLoading(submitBtn, false);
        }
    },
    
    async resendConfirmation(email) {
        try {
            await AuthService.resendConfirmationEmail(email);
            this.showNotification('Email de confirmação reenviado!', 'success');
        } catch (error) {
            this.showNotification(error.message, 'error');
        }
    },
    
    checkPasswordResetHash() {
        const hash = window.location.hash;
        
        if (hash.includes('type=recovery')) {
            this.openModal('resetPasswordModal');
        }
    },
    
    async logout() {
        try {
            await AuthService.logout();
            this.currentUser = null;
            this.updateUIForUnauthenticatedUser();
            this.showNotification('Sessão encerrada', 'info');
            window.location.href = '/';
        } catch (error) {
            this.showNotification(error.message, 'error');
        }
    },
    
    updateUIForAuthenticatedUser() {
        const authButtons = document.getElementById('authButtons');
        const userMenu = document.getElementById('userMenu');
        const userName = document.getElementById('userName');
        const userAvatar = document.getElementById('userAvatar');
        
        if (authButtons) authButtons.style.display = 'none';
        if (userMenu) userMenu.style.display = 'block';
        
        if (userName) {
            userName.textContent = this.currentUser.name.split(' ')[0];
        }
        
        if (userAvatar) {
            if (this.currentUser.avatar_url) {
                userAvatar.src = this.currentUser.avatar_url;
            } else {
                userAvatar.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(this.currentUser.name)}&background=D84315&color=fff`;
            }
        }
    },
    
    updateUIForUnauthenticatedUser() {
        const authButtons = document.getElementById('authButtons');
        const userMenu = document.getElementById('userMenu');
        
        if (authButtons) authButtons.style.display = 'flex';
        if (userMenu) userMenu.style.display = 'none';
    },
    
    async loadCategories() {
        try {
            const { data, error } = await supabase
                .from('categories')
                .select('*')
                .eq('is_active', true)
                .is('parent_id', null)
                .order('sort_order');
            
            if (error) throw error;
            
            this.categories = data || [];
            this.renderCategories();
            
        } catch (error) {
            console.error('Error loading categories:', error);
        }
    },
    
    renderCategories() {
        const grid = document.getElementById('categoriesGrid');
        if (!grid) return;
        
        grid.innerHTML = this.categories.map(cat => `
            <div class="category-card" data-category-id="${cat.id}">
                <div class="category-icon">${cat.icon}</div>
                <h3>${cat.name}</h3>
                <p>${cat.description || ''}</p>
            </div>
        `).join('');
        
        // Add click listeners
        grid.querySelectorAll('.category-card').forEach(card => {
            card.addEventListener('click', () => {
                const categoryId = card.dataset.categoryId;
                this.filterByCategory(categoryId);
            });
        });
    },
    
    async loadProducts() {
        try {
            const { data, error } = await supabase
                .from('products')
                .select(`
                    *,
                    seller:users!seller_id(name, store_name, phone, rating),
                    category:categories(name)
                `)
                .eq('status', 'active')
                .order('created_at', { ascending: false })
                .limit(12);
            
            if (error) throw error;
            
            this.products = data || [];
            this.renderProducts();
            
        } catch (error) {
            console.error('Error loading products:', error);
        }
    },
    
    renderProducts() {
        const grid = document.getElementById('productsGrid');
        if (!grid) return;
        
        grid.innerHTML = this.products.map(product => this.createProductCard(product)).join('');
        
        // Add event listeners
        grid.querySelectorAll('.btn-whatsapp').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = e.target.closest('[data-product-id]').dataset.productId;
                const product = this.products.find(p => p.id === productId);
                if (product) this.contactViaWhatsApp(product);
            });
        });
        
        grid.querySelectorAll('.btn-cart-add').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = e.target.closest('[data-product-id]').dataset.productId;
                const product = this.products.find(p => p.id === productId);
                if (product) this.addToCart(product);
            });
        });
    },
    
    createProductCard(product) {
        const imageUrl = product.images && product.images.length > 0 
            ? product.images[0] 
            : 'https://via.placeholder.com/300x300/EEEEEE/999999?text=Sem+Imagem';
        
        return `
            <div class="product-card" data-product-id="${product.id}">
                <img src="${imageUrl}" alt="${product.title}" class="product-image">
                <div class="product-info">
                    <h3 class="product-title">${product.title}</h3>
                    <p class="product-price">${this.formatPrice(product.price)} MZN</p>
                    <div class="product-meta">
                        <div class="product-rating">
                            <span>⭐</span>
                            <span>${product.rating.toFixed(1)} (${product.review_count})</span>
                        </div>
                        <span>${product.stock} em stock</span>
                    </div>
                    <div class="product-actions">
                        <button class="btn-whatsapp" data-product-id="${product.id}">
                            WhatsApp
                        </button>
                        <button class="btn-cart-add" data-product-id="${product.id}">
                            Adicionar
                        </button>
                    </div>
                </div>
            </div>
        `;
    },
    
    contactViaWhatsApp(product) {
        const message = `Olá, estou interessado no produto "${product.title}" anunciado no MozCommerce.`;
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${product.seller.phone}?text=${encodedMessage}`;
        
        window.open(whatsappUrl, '_blank');
    },
    
    addToCart(product) {
        const existingItem = this.cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({
                ...product,
                quantity: 1,
                addedAt: new Date().toISOString()
            });
        }
        
        this.saveCart();
        this.updateCartCount();
        this.showNotification('Produto adicionado ao carrinho!', 'success');
    },
    
    loadCart() {
        const savedCart = localStorage.getItem('mozcommerce_cart');
        if (savedCart) {
            this.cart = JSON.parse(savedCart);
        }
        this.updateCartCount();
    },
    
    saveCart() {
        localStorage.setItem('mozcommerce_cart', JSON.stringify(this.cart));
    },
    
    updateCartCount() {
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCount.textContent = totalItems;
        }
    },
    
    async loadStats() {
        try {
            // Load product count
            const { count: productCount } = await supabase
                .from('products')
                .select('*', { count: 'exact', head: true })
                .eq('status', 'active');
            
            // Load seller count
            const { count: sellerCount } = await supabase
                .from('users')
                .select('*', { count: 'exact', head: true })
                .eq('type', 'seller')
                .eq('status', 'active');
            
            // Load customer count
            const { count: customerCount } = await supabase
                .from('users')
                .select('*', { count: 'exact', head: true });
            
            // Update UI
            if (productCount) {
                document.getElementById('statsProducts').textContent = this.formatNumber(productCount);
            }
            if (sellerCount) {
                document.getElementById('statsSellers').textContent = this.formatNumber(sellerCount);
            }
            if (customerCount) {
                document.getElementById('statsCustomers').textContent = this.formatNumber(customerCount);
            }
            
        } catch (error) {
            console.error('Error loading stats:', error);
        }
    },
    
    formatPrice(price) {
        return new Intl.NumberFormat('pt-MZ', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(price);
    },
    
    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M+';
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K+';
        }
        return num.toString();
    },
    
    openSearch() {
        const modal = document.getElementById('searchModal');
        if (modal) {
            modal.classList.add('active');
            document.getElementById('searchInput')?.focus();
        }
    },
    
    closeSearch() {
        const modal = document.getElementById('searchModal');
        if (modal) {
            modal.classList.remove('active');
        }
    },
    
    async performSearch() {
        const input = document.getElementById('searchInput');
        const query = input?.value.trim();
        
        if (!query) return;
        
        console.log('Searching for:', query);
        // Implement search logic
    },
    
    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
        }
    },
    
    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
        }
    },
    
    switchModal(fromModalId, toModalId) {
        this.closeModal(fromModalId);
        setTimeout(() => {
            this.openModal(toModalId);
        }, 300);
    },
    
    openSellerRegistration() {
        this.openModal('registerModal');
        
        // Selecionar tipo vendedor
        const sellerBtn = document.querySelector('.type-btn[data-type="seller"]');
        if (sellerBtn) {
            document.querySelectorAll('.type-btn').forEach(b => b.classList.remove('active'));
            sellerBtn.classList.add('active');
            
            const sellerFields = document.querySelector('.seller-fields');
            if (sellerFields) {
                sellerFields.style.display = 'block';
            }
        }
    },
    
    setButtonLoading(button, loading) {
        if (!button) return;
        
        const btnText = button.querySelector('.btn-text');
        const btnLoading = button.querySelector('.btn-loading');
        
        if (loading) {
            button.disabled = true;
            if (btnText) btnText.style.display = 'none';
            if (btnLoading) btnLoading.style.display = 'inline-flex';
        } else {
            button.disabled = false;
            if (btnText) btnText.style.display = 'inline';
            if (btnLoading) btnLoading.style.display = 'none';
        }
    },
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            background: ${type === 'success' ? '#66BB6A' : type === 'error' ? '#EF5350' : '#2196F3'};
            color: white;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            z-index: 10000;
            animation: slideInRight 0.3s ease-out;
            max-width: 400px;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    },
    
    filterByCategory(categoryId) {
        console.log('Filter by category:', categoryId);
        // Implement category filtering
    }
};

// ============================================
// Close modal when clicking outside
// ============================================

window.closeModal = (modalId) => {
    App.closeModal(modalId);
};

window.switchModal = (fromModalId, toModalId) => {
    App.switchModal(fromModalId, toModalId);
};

document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('active');
    }
});

// ============================================
// Initialize App
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

// Export for use in other modules
export default App;
