// ============================================
// Supabase Configuration & Database Setup
// ============================================

// SUPABASE SETUP INSTRUCTIONS:
// 1. Criar conta em https://supabase.com
// 2. Criar novo projeto
// 3. Copiar URL e Anon Key
// 4. Substituir abaixo pelas suas credenciais

const SUPABASE_URL = 'https://wqlvbntkddssnnbaigks.supabase.co'; // Ex: https://xxxxx.supabase.co
const SUPABASE_ANON_KEY = 'sb_publishable_K18cbMyjdcEsJAuwsPvTtA__sWdTJQ8';

// Inicializar cliente Supabase
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ============================================
// DATABASE SCHEMA (SQL para executar no Supabase)
// ============================================

/*
-- EXECUTAR NO SQL EDITOR DO SUPABASE:

-- 1. Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Tabela de Usuários (users)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    phone TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('buyer', 'seller', 'admin')),
    password_hash TEXT NOT NULL,
    avatar_url TEXT,
    verified BOOLEAN DEFAULT FALSE,
    phone_verified BOOLEAN DEFAULT FALSE,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'pending', 'suspended', 'banned')),
    
    -- Dados do vendedor (opcional)
    store_name TEXT,
    business_type TEXT,
    rating DECIMAL(2,1) DEFAULT 0,
    total_sales DECIMAL(12,2) DEFAULT 0,
    
    -- KYC
    kyc_status TEXT DEFAULT 'pending' CHECK (kyc_status IN ('pending', 'approved', 'rejected')),
    kyc_document_url TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Tabela de Tokens de Verificação
CREATE TABLE verification_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    token TEXT UNIQUE NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('email', 'phone', 'password_reset')),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Tabela de Categorias
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    icon TEXT,
    description TEXT,
    parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Tabela de Produtos
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    seller_id UUID REFERENCES users(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL,
    
    price DECIMAL(12,2) NOT NULL CHECK (price >= 0),
    compare_price DECIMAL(12,2),
    
    stock INTEGER DEFAULT 0 CHECK (stock >= 0),
    sku TEXT,
    
    images TEXT[] DEFAULT '{}',
    
    whatsapp_enabled BOOLEAN DEFAULT TRUE,
    
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'out_of_stock', 'pending')),
    
    views INTEGER DEFAULT 0,
    sales_count INTEGER DEFAULT 0,
    
    rating DECIMAL(2,1) DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Tabela de Pedidos
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number TEXT UNIQUE NOT NULL,
    
    buyer_id UUID REFERENCES users(id) ON DELETE SET NULL,
    
    subtotal DECIMAL(12,2) NOT NULL,
    commission DECIMAL(12,2) NOT NULL,
    shipping_cost DECIMAL(12,2) DEFAULT 0,
    total DECIMAL(12,2) NOT NULL,
    
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'processing', 'shipped', 'delivered', 'completed', 'cancelled', 'refunded')),
    
    payment_method TEXT NOT NULL,
    payment_reference TEXT,
    paid_at TIMESTAMP WITH TIME ZONE,
    
    shipping_name TEXT NOT NULL,
    shipping_phone TEXT NOT NULL,
    shipping_address TEXT NOT NULL,
    shipping_city TEXT NOT NULL,
    shipping_province TEXT NOT NULL,
    
    tracking_code TEXT,
    
    delivery_confirmed BOOLEAN DEFAULT FALSE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    
    notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Tabela de Itens do Pedido
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    seller_id UUID REFERENCES users(id) ON DELETE SET NULL,
    
    product_title TEXT NOT NULL,
    product_price DECIMAL(12,2) NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    subtotal DECIMAL(12,2) NOT NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Tabela de Pagamentos
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    
    amount DECIMAL(12,2) NOT NULL,
    method TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'refunded')),
    
    transaction_id TEXT,
    reference TEXT NOT NULL,
    
    provider_response JSONB,
    
    seller_amount DECIMAL(12,2),
    platform_commission DECIMAL(12,2),
    released_to_seller BOOLEAN DEFAULT FALSE,
    released_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Tabela de Avaliações
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
    
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title TEXT,
    comment TEXT,
    
    helpful_count INTEGER DEFAULT 0,
    
    seller_response TEXT,
    seller_responded_at TIMESTAMP WITH TIME ZONE,
    
    is_verified_purchase BOOLEAN DEFAULT FALSE,
    is_approved BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(product_id, user_id, order_id)
);

-- 10. Tabela de Notificações
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    
    link TEXT,
    
    read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. Tabela de Sistema Antifraude
CREATE TABLE fraud_checks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    risk_score INTEGER NOT NULL CHECK (risk_score >= 0 AND risk_score <= 100),
    risk_factors JSONB,
    
    approved BOOLEAN,
    reviewed_by UUID REFERENCES users(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    
    notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 12. Tabela de Logs de Atividade
CREATE TABLE activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    action TEXT NOT NULL,
    entity_type TEXT,
    entity_id UUID,
    
    ip_address TEXT,
    user_agent TEXT,
    
    metadata JSONB,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ÍNDICES para Performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_type ON users(type);
CREATE INDEX idx_products_seller ON products(seller_id);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_orders_buyer ON orders(buyer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_seller ON order_items(seller_id);
CREATE INDEX idx_payments_order ON payments(order_id);
CREATE INDEX idx_reviews_product ON reviews(product_id);
CREATE INDEX idx_notifications_user ON notifications(user_id);

-- TRIGGERS para Updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- FUNÇÕES ÚTEIS

-- Função para gerar número de pedido
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
BEGIN
    RETURN 'MZC' || TO_CHAR(NOW(), 'YYYYMMDD') || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;

-- Função para atualizar rating do produto
CREATE OR REPLACE FUNCTION update_product_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE products
    SET 
        rating = (SELECT COALESCE(AVG(rating), 0) FROM reviews WHERE product_id = NEW.product_id AND is_approved = TRUE),
        review_count = (SELECT COUNT(*) FROM reviews WHERE product_id = NEW.product_id AND is_approved = TRUE)
    WHERE id = NEW.product_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_product_rating_trigger
AFTER INSERT OR UPDATE ON reviews
FOR EACH ROW EXECUTE FUNCTION update_product_rating();

-- POLÍTICAS DE SEGURANÇA (Row Level Security)

-- Habilitar RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Políticas para Users (usuários podem ver e editar apenas seus próprios dados)
CREATE POLICY users_select_own ON users
    FOR SELECT
    USING (auth.uid()::text = id::text);

CREATE POLICY users_update_own ON users
    FOR UPDATE
    USING (auth.uid()::text = id::text);

-- Políticas para Products (todos podem ver produtos ativos)
CREATE POLICY products_select_all ON products
    FOR SELECT
    USING (status = 'active' OR seller_id::text = auth.uid()::text);

CREATE POLICY products_insert_seller ON products
    FOR INSERT
    WITH CHECK (seller_id::text = auth.uid()::text);

CREATE POLICY products_update_own ON products
    FOR UPDATE
    USING (seller_id::text = auth.uid()::text);

-- Inserir categorias padrão
INSERT INTO categories (name, slug, icon, description) VALUES
('Eletrónicos', 'eletronicos', '📱', 'Telemóveis, computadores, tablets e acessórios'),
('Moda', 'moda', '👗', 'Roupas, calçados e acessórios'),
('Casa & Jardim', 'casa-jardim', '🏠', 'Móveis, decoração e utensílios'),
('Desporto', 'desporto', '⚽', 'Equipamentos e artigos desportivos'),
('Beleza', 'beleza', '💄', 'Cosméticos e produtos de beleza'),
('Livros & Papelaria', 'livros-papelaria', '📚', 'Livros, material escolar e escritório'),
('Ferramentas', 'ferramentas', '🔧', 'Ferramentas e equipamentos'),
('Automóveis', 'automoveis', '🚗', 'Peças e acessórios para veículos');

*/

// ============================================
// Exportar configuração
// ============================================

export { supabase };
