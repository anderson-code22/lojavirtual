-- Dados iniciais para sistema completo

-- Configurações do sistema
INSERT INTO system_settings (key, value, type, description) VALUES
('site_name', 'EcoStore', 'string', 'Nome da loja'),
('site_description', 'Sua loja online de confiança', 'string', 'Descrição da loja'),
('currency', 'BRL', 'string', 'Moeda padrão'),
('tax_rate', '0.18', 'number', 'Taxa de imposto padrão'),
('free_shipping_threshold', '200.00', 'number', 'Valor mínimo para frete grátis'),
('loyalty_points_rate', '0.01', 'number', 'Taxa de pontos por real gasto'),
('max_login_attempts', '5', 'number', 'Máximo de tentativas de login'),
('session_timeout', '86400', 'number', 'Timeout da sessão em segundos'),
('email_verification_required', 'true', 'boolean', 'Verificação de email obrigatória'),
('maintenance_mode', 'false', 'boolean', 'Modo de manutenção'),
('analytics_enabled', 'true', 'boolean', 'Analytics habilitado'),
('chat_support_enabled', 'true', 'boolean', 'Chat de suporte habilitado');

-- Métodos de pagamento
INSERT INTO payment_methods (name, type, provider, config, active) VALUES
('Cartão de Crédito', 'credit_card', 'stripe', '{"public_key": "pk_test_...", "secret_key": "sk_test_..."}', true),
('Cartão de Débito', 'debit_card', 'stripe', '{"public_key": "pk_test_...", "secret_key": "sk_test_..."}', true),
('PIX', 'pix', 'mercadopago', '{"access_token": "APP_USR_..."}', true),
('Boleto Bancário', 'boleto', 'pagseguro', '{"email": "vendedor@ecostore.com", "token": "..."}', true),
('Carteira Digital', 'wallet', 'internal', '{}', true);

-- Transportadoras
INSERT INTO shipping_carriers (name, code, api_config, active) VALUES
('Correios', 'correios', '{"user": "empresa", "password": "senha", "service_codes": ["04014", "04510"]}', true),
('Transportadora Express', 'express', '{"api_key": "key123", "base_url": "https://api.express.com"}', true),
('Entrega Local', 'local', '{"radius": 50, "base_price": 15.00}', true);

-- Métodos de envio
INSERT INTO shipping_methods (carrier_id, name, code, description, estimated_days, price, free_shipping_threshold, active)
SELECT 
  c.id,
  'PAC',
  'pac',
  'Entrega econômica dos Correios',
  7,
  15.00,
  200.00,
  true
FROM shipping_carriers c WHERE c.code = 'correios'

UNION ALL

SELECT 
  c.id,
  'SEDEX',
  'sedex',
  'Entrega expressa dos Correios',
  3,
  25.00,
  500.00,
  true
FROM shipping_carriers c WHERE c.code = 'correios'

UNION ALL

SELECT 
  c.id,
  'Express 24h',
  'express_24h',
  'Entrega em até 24 horas',
  1,
  35.00,
  1000.00,
  true
FROM shipping_carriers c WHERE c.code = 'express';

-- Fornecedores
INSERT INTO suppliers (name, email, phone, document, address, contact_person, active) VALUES
('Apple Inc.', 'supplier@apple.com', '+1-408-996-1010', '12.345.678/0001-90', 
 '{"street": "One Apple Park Way", "city": "Cupertino", "state": "CA", "country": "USA"}', 
 'Tim Cook', true),
('Samsung Electronics', 'supplier@samsung.com', '+82-2-2255-0114', '23.456.789/0001-01',
 '{"street": "129 Samsung-ro", "city": "Seoul", "country": "South Korea"}',
 'Jong-Hee Han', true),
('Sony Corporation', 'supplier@sony.com', '+81-3-6748-2111', '34.567.890/0001-12',
 '{"street": "1-7-1 Konan", "city": "Tokyo", "country": "Japan"}',
 'Kenichiro Yoshida', true);

-- Estoque inicial para produtos existentes
INSERT INTO inventory (product_id, quantity, reserved_quantity, min_stock, max_stock, location)
SELECT 
  p.id,
  FLOOR(RANDOM() * 100 + 10)::INTEGER, -- quantidade aleatória entre 10-110
  0,
  5,
  200,
  'Depósito Principal'
FROM products p;

-- Templates de email
INSERT INTO email_templates (name, subject, html_content, text_content, variables, active) VALUES
('welcome', 'Bem-vindo à EcoStore!', 
 '<h1>Olá {{name}}!</h1><p>Bem-vindo à EcoStore. Sua conta foi criada com sucesso.</p>',
 'Olá {{name}}! Bem-vindo à EcoStore. Sua conta foi criada com sucesso.',
 '["name", "email"]', true),

('order_confirmation', 'Pedido Confirmado - #{{order_number}}',
 '<h1>Pedido Confirmado!</h1><p>Seu pedido #{{order_number}} foi confirmado e está sendo processado.</p><p>Total: R$ {{total}}</p>',
 'Pedido Confirmado! Seu pedido #{{order_number}} foi confirmado. Total: R$ {{total}}',
 '["order_number", "total", "items"]', true),

('shipping_notification', 'Pedido Enviado - #{{order_number}}',
 '<h1>Pedido Enviado!</h1><p>Seu pedido #{{order_number}} foi enviado.</p><p>Código de rastreamento: {{tracking_code}}</p>',
 'Pedido Enviado! Código de rastreamento: {{tracking_code}}',
 '["order_number", "tracking_code", "carrier"]', true),

('password_reset', 'Redefinir Senha - EcoStore',
 '<h1>Redefinir Senha</h1><p>Clique no link para redefinir sua senha: <a href="{{reset_link}}">Redefinir</a></p>',
 'Redefinir senha: {{reset_link}}',
 '["reset_link", "expires_at"]', true),

('email_verification', 'Verificar Email - EcoStore',
 '<h1>Verificar Email</h1><p>Clique no link para verificar seu email: <a href="{{verification_link}}">Verificar</a></p>',
 'Verificar email: {{verification_link}}',
 '["verification_link", "expires_at"]', true);

-- Cupons de desconto avançados
INSERT INTO coupons (code, description, discount_type, discount_value, minimum_amount, usage_limit, max_uses_per_user, first_purchase_only, valid_from, valid_until, active) VALUES
('PRIMEIRA10', 'Desconto para primeira compra', 'percentage', 10.00, 100.00, 1000, 1, true, NOW(), NOW() + INTERVAL '90 days', true),
('FIDELIDADE20', 'Desconto para clientes fiéis', 'percentage', 20.00, 500.00, 500, 1, false, NOW(), NOW() + INTERVAL '30 days', true),
('FRETE15', 'Desconto no frete', 'fixed_amount', 15.00, 50.00, 2000, 3, false, NOW(), NOW() + INTERVAL '60 days', true),
('VIP25', 'Desconto VIP', 'percentage', 25.00, 1000.00, 100, 1, false, NOW(), NOW() + INTERVAL '7 days', true);

-- Configurações de SEO para páginas principais
INSERT INTO seo_settings (page_type, meta_title, meta_description, meta_keywords, og_title, og_description, robots, schema_markup) VALUES
('home', 'EcoStore - Sua Loja Online de Confiança', 
 'Encontre os melhores produtos de tecnologia com preços incríveis e entrega rápida. Smartphones, laptops, games e muito mais!',
 'loja online, tecnologia, smartphones, laptops, games, eletrônicos',
 'EcoStore - Tecnologia com o Melhor Preço',
 'Sua loja online de confiança com os melhores produtos de tecnologia',
 'index,follow',
 '{"@context": "https://schema.org", "@type": "Store", "name": "EcoStore"}'),

('category', 'Categorias - EcoStore',
 'Explore nossas categorias de produtos organizadas para facilitar sua busca',
 'categorias, produtos, organização, busca',
 'Categorias de Produtos - EcoStore',
 'Encontre produtos organizados por categoria',
 'index,follow',
 '{"@context": "https://schema.org", "@type": "CollectionPage"}'),

('product', 'Produtos - EcoStore',
 'Confira nosso catálogo completo de produtos com os melhores preços',
 'produtos, catálogo, preços, qualidade',
 'Produtos com Qualidade - EcoStore',
 'Produtos de qualidade com os melhores preços',
 'index,follow',
 '{"@context": "https://schema.org", "@type": "Product"}');

-- Dados de analytics iniciais
INSERT INTO sales_analytics (date, total_orders, total_revenue, total_customers, new_customers, avg_order_value, conversion_rate)
SELECT 
  CURRENT_DATE - INTERVAL '1 day' * generate_series(0, 29),
  FLOOR(RANDOM() * 50 + 10)::INTEGER,
  ROUND((RANDOM() * 10000 + 5000)::NUMERIC, 2),
  FLOOR(RANDOM() * 30 + 5)::INTEGER,
  FLOOR(RANDOM() * 10 + 1)::INTEGER,
  ROUND((RANDOM() * 500 + 200)::NUMERIC, 2),
  ROUND((RANDOM() * 0.05 + 0.02)::NUMERIC, 4);
