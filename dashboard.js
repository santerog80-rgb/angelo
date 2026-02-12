// ============================================
// Seller Dashboard JavaScript
// ============================================

const Dashboard = {
    currentView: 'dashboard',
    
    init() {
        this.setupNavigation();
        this.setupModals();
        this.loadDashboardData();
        this.setupProductForm();
    },
    
    setupNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Remove active class from all items
                navItems.forEach(nav => nav.classList.remove('active'));
                
                // Add active to clicked item
                item.classList.add('active');
                
                // Get target section
                const target = item.getAttribute('href').substring(1);
                this.switchView(target);
            });
        });
    },
    
    switchView(viewName) {
        this.currentView = viewName;
        
        // Update page title
        const pageTitle = document.getElementById('pageTitle');
        if (pageTitle) {
            pageTitle.textContent = this.getPageTitle(viewName);
        }
        
        // Show/hide sections based on view
        // For now, just log - in full implementation, show relevant sections
        console.log('Switching to view:', viewName);
    },
    
    getPageTitle(viewName) {
        const titles = {
            'dashboard': 'Dashboard',
            'produtos': 'Meus Produtos',
            'pedidos': 'Pedidos',
            'financeiro': 'Financeiro',
            'estatisticas': 'Estatísticas',
            'avaliacoes': 'Avaliações',
            'configuracoes': 'Configurações'
        };
        
        return titles[viewName] || 'Dashboard';
    },
    
    setupModals() {
        const addProductBtn = document.getElementById('addProductBtn');
        
        if (addProductBtn) {
            addProductBtn.addEventListener('click', () => {
                const modal = document.getElementById('addProductModal');
                if (modal) {
                    modal.classList.add('active');
                }
            });
        }
    },
    
    loadDashboardData() {
        // Load stats
        this.updateStats();
        
        // Load recent orders
        this.loadRecentOrders();
    },
    
    updateStats() {
        // In production, fetch from API
        const stats = {
            sales: 45250.00,
            salesChange: 12.5,
            products: 156,
            productsChange: 0,
            orders: 23,
            ordersChange: -5.2,
            rating: 4.8,
            ratingChange: 0.2
        };
        
        // Update DOM with stats
        console.log('Stats updated:', stats);
    },
    
    loadRecentOrders() {
        // In production, fetch from API
        const orders = [
            {
                id: '12345',
                customer: 'João Silva',
                items: 2,
                total: 3500.00,
                status: 'pending',
                date: '10/02/2026'
            },
            {
                id: '12344',
                customer: 'Maria Santos',
                items: 1,
                total: 1200.00,
                status: 'paid',
                date: '09/02/2026'
            },
            {
                id: '12343',
                customer: 'Carlos Mondlane',
                items: 3,
                total: 5800.00,
                status: 'shipped',
                date: '08/02/2026'
            }
        ];
        
        console.log('Recent orders loaded:', orders);
    },
    
    setupProductForm() {
        const form = document.getElementById('addProductForm');
        const imageInput = document.getElementById('productImages');
        
        if (imageInput) {
            imageInput.addEventListener('change', (e) => {
                this.handleImageUpload(e.target.files);
            });
        }
        
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.submitProduct(new FormData(form));
            });
        }
    },
    
    handleImageUpload(files) {
        const preview = document.getElementById('imagePreview');
        if (!preview) return;
        
        preview.innerHTML = '';
        
        Array.from(files).forEach((file, index) => {
            if (index >= 5) return; // Max 5 images
            
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = document.createElement('div');
                img.className = 'image-preview-item';
                img.style.cssText = `
                    width: 100px;
                    height: 100px;
                    background-image: url(${e.target.result});
                    background-size: cover;
                    background-position: center;
                    border-radius: 8px;
                    position: relative;
                `;
                
                const removeBtn = document.createElement('button');
                removeBtn.innerHTML = '&times;';
                removeBtn.style.cssText = `
                    position: absolute;
                    top: 4px;
                    right: 4px;
                    width: 24px;
                    height: 24px;
                    background: rgba(0,0,0,0.7);
                    color: white;
                    border: none;
                    border-radius: 50%;
                    cursor: pointer;
                    font-size: 18px;
                    line-height: 1;
                `;
                
                removeBtn.addEventListener('click', () => {
                    img.remove();
                });
                
                img.appendChild(removeBtn);
                preview.appendChild(img);
            };
            
            reader.readAsDataURL(file);
        });
    },
    
    submitProduct(formData) {
        const productData = {
            title: formData.get('title'),
            category: formData.get('category'),
            description: formData.get('description'),
            price: parseFloat(formData.get('price')),
            stock: parseInt(formData.get('stock')),
            whatsappEnabled: formData.get('whatsappEnabled') === 'on'
        };
        
        // Validation
        if (!productData.title || !productData.category || !productData.description) {
            Utils.showNotification('Por favor, preencha todos os campos obrigatórios', 'error');
            return;
        }
        
        if (productData.price <= 0) {
            Utils.showNotification('Preço deve ser maior que zero', 'error');
            return;
        }
        
        if (productData.stock < 0) {
            Utils.showNotification('Stock não pode ser negativo', 'error');
            return;
        }
        
        // In production, send to API
        console.log('Submitting product:', productData);
        
        // Simulate success
        setTimeout(() => {
            Utils.showNotification('Produto adicionado com sucesso!', 'success');
            closeModal('addProductModal');
            
            // Reset form
            document.getElementById('addProductForm').reset();
            document.getElementById('imagePreview').innerHTML = '';
            
            // Reload products
            this.loadSellerProducts();
        }, 1000);
    },
    
    loadSellerProducts() {
        // In production, fetch from API
        const products = JSON.parse(localStorage.getItem('seller_products') || '[]');
        
        const grid = document.getElementById('sellerProductsGrid');
        if (!grid) return;
        
        grid.innerHTML = '';
        
        products.forEach(product => {
            const card = this.createSellerProductCard(product);
            grid.appendChild(card);
        });
        
        if (products.length === 0) {
            grid.innerHTML = `
                <div style="text-align: center; padding: 3rem; color: var(--gray-600);">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">📦</div>
                    <h3>Nenhum produto adicionado ainda</h3>
                    <p>Comece adicionando seu primeiro produto!</p>
                </div>
            `;
        }
    },
    
    createSellerProductCard(product) {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${product.image || 'https://via.placeholder.com/300x300/EEEEEE/999999?text=Sem+Imagem'}" 
                 alt="${product.title}" 
                 class="product-image">
            <div class="product-info">
                <h3 class="product-title">${product.title}</h3>
                <p class="product-price">${Utils.formatPrice(product.price)}</p>
                <div class="product-meta">
                    <span>Stock: ${product.stock}</span>
                    <span class="status-badge ${product.status}">${this.getStatusLabel(product.status)}</span>
                </div>
                <div class="product-actions" style="display: flex; gap: 0.5rem; margin-top: 1rem;">
                    <button class="btn-edit" data-id="${product.id}" 
                            style="flex: 1; padding: 0.5rem; background: var(--primary); color: white; border: none; border-radius: 8px; cursor: pointer;">
                        Editar
                    </button>
                    <button class="btn-delete" data-id="${product.id}"
                            style="padding: 0.5rem 1rem; background: var(--danger); color: white; border: none; border-radius: 8px; cursor: pointer;">
                        🗑️
                    </button>
                </div>
            </div>
        `;
        
        // Add event listeners
        const editBtn = card.querySelector('.btn-edit');
        const deleteBtn = card.querySelector('.btn-delete');
        
        editBtn.addEventListener('click', () => this.editProduct(product.id));
        deleteBtn.addEventListener('click', () => this.deleteProduct(product.id));
        
        return card;
    },
    
    getStatusLabel(status) {
        const labels = {
            'active': 'Ativo',
            'inactive': 'Inativo',
            'out_of_stock': 'Sem Stock',
            'pending': 'Pendente'
        };
        
        return labels[status] || status;
    },
    
    editProduct(productId) {
        console.log('Edit product:', productId);
        Utils.showNotification('Funcionalidade em desenvolvimento', 'info');
    },
    
    deleteProduct(productId) {
        if (!confirm('Tem certeza que deseja remover este produto?')) {
            return;
        }
        
        const products = JSON.parse(localStorage.getItem('seller_products') || '[]');
        const filtered = products.filter(p => p.id !== productId);
        localStorage.setItem('seller_products', JSON.stringify(filtered));
        
        Utils.showNotification('Produto removido!', 'success');
        this.loadSellerProducts();
    }
};

// ============================================
// Analytics & Reports
// ============================================

const Analytics = {
    generateSalesReport(startDate, endDate) {
        // In production, fetch from API
        console.log('Generating sales report:', { startDate, endDate });
        
        return {
            totalSales: 145250.00,
            totalOrders: 87,
            averageOrderValue: 1670.11,
            topProducts: [],
            salesByDay: []
        };
    },
    
    getTopProducts(limit = 10) {
        // In production, fetch from API
        return [];
    },
    
    getRevenueByMonth(year) {
        // In production, fetch from API
        return [];
    }
};

// ============================================
// Notifications
// ============================================

const Notifications = {
    init() {
        this.checkNewNotifications();
        this.setupNotificationButton();
    },
    
    checkNewNotifications() {
        // In production, fetch from API
        const notifications = this.getNotifications();
        this.updateBadge(notifications.length);
    },
    
    getNotifications() {
        // Mock notifications
        return [
            {
                id: '1',
                type: 'order',
                message: 'Novo pedido recebido',
                timestamp: new Date().toISOString(),
                read: false
            },
            {
                id: '2',
                type: 'payment',
                message: 'Pagamento confirmado',
                timestamp: new Date().toISOString(),
                read: false
            },
            {
                id: '3',
                type: 'review',
                message: 'Nova avaliação recebida',
                timestamp: new Date().toISOString(),
                read: false
            }
        ];
    },
    
    updateBadge(count) {
        const badge = document.querySelector('.notification-badge');
        if (badge) {
            badge.textContent = count;
            badge.style.display = count > 0 ? 'flex' : 'none';
        }
    },
    
    setupNotificationButton() {
        const btn = document.querySelector('.btn-notification');
        if (btn) {
            btn.addEventListener('click', () => {
                this.showNotificationPanel();
            });
        }
    },
    
    showNotificationPanel() {
        console.log('Show notifications panel');
        Utils.showNotification('Painel de notificações em desenvolvimento', 'info');
    },
    
    markAsRead(notificationId) {
        // In production, send to API
        console.log('Mark notification as read:', notificationId);
    }
};

// ============================================
// Initialize Dashboard
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Check if user is authenticated and is a seller
    const user = MozCommerce.state.user || JSON.parse(localStorage.getItem('mozcommerce_user') || 'null');
    
    if (!user) {
        window.location.href = '/';
        return;
    }
    
    if (user.type !== 'seller') {
        Utils.showNotification('Acesso negado. Apenas vendedores podem acessar esta página.', 'error');
        setTimeout(() => {
            window.location.href = '/';
        }, 2000);
        return;
    }
    
    // Initialize dashboard modules
    Dashboard.init();
    Analytics.init && Analytics.init();
    Notifications.init();
    
    console.log('✅ Seller Dashboard initialized');
});

// Export for global use
window.Dashboard = Dashboard;
window.Analytics = Analytics;
window.Notifications = Notifications;
