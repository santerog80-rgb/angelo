// ============================================
// MozCommerce - Configurações de Contato
// ============================================

/**
 * INFORMAÇÕES DE CONTATO DO MOZCOMMERCE
 * 
 * Este arquivo centraliza todas as informações de contato
 * da plataforma. Atualize estas informações com seus dados reais.
 */

const ContactConfig = {
    // Informações da Empresa
    company: {
        name: 'MozCommerce',
        fullName: 'MozCommerce - Marketplace Digital de Moçambique',
        tagline: 'O maior marketplace digital de Moçambique',
        founded: '2026',
        country: 'Moçambique',
        flag: '🇲🇿'
    },
    
    // Telefones
    phones: {
        whatsapp: '+258841234567',          // WhatsApp principal
        whatsappFormatted: '+258 84 123 4567',
        office: '+25821123456',             // Telefone fixo
        officeFormatted: '+258 21 123 456',
        mobile: '+258871234567',            // Celular alternativo
        mobileFormatted: '+258 87 123 4567'
    },
    
    // Emails
    emails: {
        support: 'suporte@mozcommerce.co.mz',      // Suporte geral
        sales: 'vendas@mozcommerce.co.mz',         // Vendas
        sellers: 'vendedores@mozcommerce.co.mz',   // Suporte a vendedores
        admin: 'admin@mozcommerce.co.mz',          // Administração
        info: 'info@mozcommerce.co.mz',            // Informações gerais
        abuse: 'abuse@mozcommerce.co.mz'           // Denúncias
    },
    
    // Endereço Físico
    address: {
        street: 'Av. Julius Nyerere, 1234',
        neighborhood: 'Polana',
        city: 'Maputo',
        province: 'Maputo Cidade',
        postalCode: '1100',
        country: 'Moçambique',
        
        // Endereço completo formatado
        full: 'Av. Julius Nyerere, 1234, Polana, Maputo, Moçambique',
        
        // Coordenadas GPS
        coordinates: {
            latitude: -25.9655,
            longitude: 32.5832
        },
        
        // Link Google Maps
        googleMapsUrl: 'https://maps.google.com/?q=-25.9655,32.5832'
    },
    
    // Horário de Atendimento
    businessHours: {
        weekdays: {
            days: 'Segunda a Sexta-feira',
            hours: '08:00 - 18:00',
            open: '08:00',
            close: '18:00'
        },
        saturday: {
            days: 'Sábado',
            hours: '09:00 - 14:00',
            open: '09:00',
            close: '14:00'
        },
        sunday: {
            days: 'Domingo',
            hours: 'Fechado',
            open: null,
            close: null
        },
        holidays: {
            days: 'Feriados',
            hours: 'Fechado',
            open: null,
            close: null
        }
    },
    
    // Redes Sociais
    social: {
        facebook: 'https://facebook.com/mozcommerce',
        instagram: 'https://instagram.com/mozcommerce',
        twitter: 'https://twitter.com/mozcommerce',
        linkedin: 'https://linkedin.com/company/mozcommerce',
        youtube: 'https://youtube.com/@mozcommerce',
        tiktok: 'https://tiktok.com/@mozcommerce'
    },
    
    // Links Úteis
    links: {
        website: 'https://mozcommerce.co.mz',
        support: 'https://mozcommerce.co.mz/suporte',
        sellerCenter: 'https://mozcommerce.co.mz/seller-dashboard',
        terms: 'https://mozcommerce.co.mz/termos',
        privacy: 'https://mozcommerce.co.mz/privacidade',
        faq: 'https://mozcommerce.co.mz/suporte#faq'
    },
    
    // WhatsApp Links
    whatsappLinks: {
        support: 'https://wa.me/258841234567?text=Olá,%20preciso%20de%20ajuda%20com%20o%20MozCommerce',
        seller: 'https://wa.me/258841234567?text=Olá,%20quero%20ser%20vendedor%20no%20MozCommerce',
        buyer: 'https://wa.me/258841234567?text=Olá,%20tenho%20uma%20dúvida%20sobre%20uma%20compra',
        complaint: 'https://wa.me/258841234567?text=Olá,%20gostaria%20de%20fazer%20uma%20denúncia'
    },
    
    // Informações Legais
    legal: {
        companyName: 'MozCommerce, Lda.',
        nuit: '123456789',              // Número Único de Identificação Tributária
        registrationNumber: 'REG-2026-001234',
        vat: 'MZ123456789',
        registeredOffice: 'Av. Julius Nyerere, 1234, Maputo, Moçambique'
    },
    
    // Métodos de Pagamento
    paymentMethods: [
        {
            name: 'M-Pesa',
            type: 'mobile',
            icon: '📱',
            color: '#00A651',
            enabled: true
        },
        {
            name: 'E-Mola',
            type: 'mobile',
            icon: '💰',
            color: '#FF6B00',
            enabled: true
        },
        {
            name: 'M-Kesh',
            type: 'mobile',
            icon: '💳',
            color: '#1E3A8A',
            enabled: true
        },
        {
            name: 'VISA',
            type: 'card',
            icon: '💳',
            color: '#1A1F71',
            enabled: true
        },
        {
            name: 'Mastercard',
            type: 'card',
            icon: '💳',
            color: '#EB001B',
            enabled: true
        }
    ],
    
    // Informações de Suporte por Tipo
    supportChannels: {
        urgent: {
            name: 'Urgente (WhatsApp)',
            contact: '+258 84 123 4567',
            responseTime: 'Imediato - 30 minutos',
            availability: '24/7'
        },
        normal: {
            name: 'Normal (Email)',
            contact: 'suporte@mozcommerce.co.mz',
            responseTime: 'Até 24 horas',
            availability: 'Dias úteis'
        },
        phone: {
            name: 'Telefone',
            contact: '+258 21 123 456',
            responseTime: 'Imediato',
            availability: 'Segunda-Sexta: 08:00-18:00, Sábado: 09:00-14:00'
        }
    },
    
    // Comissões e Taxas
    fees: {
        commission: {
            free: 0.05,      // 5% para plano gratuito
            premium: 0.03    // 3% para plano premium
        },
        plans: {
            free: {
                name: 'Gratuito',
                price: 0,
                commission: 0.05,
                maxProducts: 50
            },
            premium: {
                name: 'Premium',
                price: 2500,     // MZN/mês
                commission: 0.03,
                maxProducts: -1  // Ilimitado
            }
        }
    }
};

// ============================================
// Funções Auxiliares
// ============================================

/**
 * Formatar número de telefone
 */
function formatPhone(phone) {
    return phone.replace(/(\d{3})(\d{2})(\d{3})(\d{4})/, '+$1 $2 $3 $4');
}

/**
 * Gerar link WhatsApp com mensagem personalizada
 */
function getWhatsAppLink(type = 'support', customMessage = '') {
    const baseNumber = ContactConfig.phones.whatsapp.replace(/\D/g, '');
    
    const messages = {
        support: 'Olá, preciso de ajuda com o MozCommerce',
        seller: 'Olá, quero ser vendedor no MozCommerce',
        buyer: 'Olá, tenho uma dúvida sobre uma compra',
        complaint: 'Olá, gostaria de fazer uma denúncia'
    };
    
    const message = customMessage || messages[type] || messages.support;
    const encodedMessage = encodeURIComponent(message);
    
    return `https://wa.me/${baseNumber}?text=${encodedMessage}`;
}

/**
 * Obter horário de atendimento do dia atual
 */
function getTodayBusinessHours() {
    const today = new Date().getDay(); // 0 = Domingo, 6 = Sábado
    
    if (today === 0) {
        return ContactConfig.businessHours.sunday;
    } else if (today === 6) {
        return ContactConfig.businessHours.saturday;
    } else {
        return ContactConfig.businessHours.weekdays;
    }
}

/**
 * Verificar se está em horário de atendimento
 */
function isBusinessHoursNow() {
    const now = new Date();
    const today = getTodayBusinessHours();
    
    if (!today.open) return false; // Fechado
    
    const currentTime = now.getHours() * 60 + now.getMinutes();
    const [openHour, openMin] = today.open.split(':').map(Number);
    const [closeHour, closeMin] = today.close.split(':').map(Number);
    
    const openTime = openHour * 60 + openMin;
    const closeTime = closeHour * 60 + closeMin;
    
    return currentTime >= openTime && currentTime < closeTime;
}

/**
 * Obter canal de suporte recomendado
 */
function getRecommendedSupportChannel() {
    if (isBusinessHoursNow()) {
        return ContactConfig.supportChannels.phone;
    } else {
        return ContactConfig.supportChannels.urgent; // WhatsApp 24/7
    }
}

// ============================================
// Exportar configurações
// ============================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ContactConfig,
        formatPhone,
        getWhatsAppLink,
        getTodayBusinessHours,
        isBusinessHoursNow,
        getRecommendedSupportChannel
    };
}

// ============================================
// INSTRUÇÕES DE USO
// ============================================

/*

COMO USAR ESTE ARQUIVO:

1. ATUALIZAR SUAS INFORMAÇÕES:
   - Substitua todos os dados de exemplo pelos seus dados reais
   - Telefones, emails, endereço, redes sociais, etc.

2. IMPORTAR EM OUTROS ARQUIVOS:
   
   // No seu JavaScript:
   import { ContactConfig, getWhatsAppLink } from './contact-config.js';
   
   // Usar:
   console.log(ContactConfig.emails.support);
   const whatsappUrl = getWhatsAppLink('seller');

3. USAR NO HTML:
   
   <script type="module">
     import { ContactConfig } from './contact-config.js';
     
     document.getElementById('supportEmail').textContent = ContactConfig.emails.support;
     document.getElementById('whatsappBtn').href = ContactConfig.whatsappLinks.support;
   </script>

4. MANTER ATUALIZADO:
   - Este arquivo é a fonte única de verdade para todas as informações de contato
   - Sempre atualize aqui quando mudar telefones, emails, horários, etc.
   - Todos os outros arquivos devem importar daqui

5. VERIFICAR PERIODICAMENTE:
   - Horários de atendimento
   - Números de telefone ativos
   - Emails funcionando
   - Links de redes sociais

*/
