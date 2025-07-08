-- Inserir dados iniciais

-- Inserir categorias
INSERT INTO categories (name, slug, description, icon, featured) VALUES
('Smartphones', 'smartphones', 'Os últimos lançamentos em celulares', 'Smartphone', true),
('Laptops', 'laptops', 'Notebooks para trabalho e entretenimento', 'Laptop', true),
('Áudio', 'audio', 'Fones, caixas de som e equipamentos de áudio', 'Headphones', false),
('Smartwatches', 'watches', 'Relógios inteligentes e fitness trackers', 'Watch', false),
('Câmeras', 'cameras', 'Câmeras digitais e equipamentos fotográficos', 'Camera', false),
('Games', 'games', 'Consoles, jogos e acessórios para gamers', 'Gamepad2', true),
('Tablets', 'tablets', 'iPads e tablets Android', 'Tablet', false),
('Monitores', 'monitors', 'Monitores para PC e workstations', 'Monitor', false),
('Periféricos', 'peripherals', 'Teclados, mouses e acessórios', 'Keyboard', false),
('Caixas de Som', 'speakers', 'Alto-falantes e sistemas de som', 'Speaker', false),
('TVs', 'tv', 'Smart TVs e equipamentos de entretenimento', 'Tv', false),
('Acessórios', 'accessories', 'Capas, carregadores e outros acessórios', 'Mouse', false);

-- Inserir marcas
INSERT INTO brands (name, slug) VALUES
('Apple', 'apple'),
('Samsung', 'samsung'),
('Sony', 'sony'),
('Dell', 'dell'),
('Canon', 'canon'),
('Google', 'google'),
('Nintendo', 'nintendo'),
('Microsoft', 'microsoft'),
('Xiaomi', 'xiaomi'),
('LG', 'lg');

-- Inserir produtos (usando IDs das categorias e marcas)
WITH category_ids AS (
  SELECT id, slug FROM categories
),
brand_ids AS (
  SELECT id, slug FROM brands
)
INSERT INTO products (name, slug, description, short_description, price, original_price, discount_percentage, sku, stock_quantity, category_id, brand_id, featured, active)
SELECT 
  'iPhone 15 Pro Max',
  'iphone-15-pro-max',
  'O iPhone mais avançado com chip A17 Pro, câmera de 48MP e tela Super Retina XDR de 6.7 polegadas. Design em titânio com Action Button personalizável.',
  'iPhone mais avançado com chip A17 Pro e câmera de 48MP',
  8999.99,
  9999.99,
  10,
  'IPH15PM-256-TIT',
  25,
  c.id,
  b.id,
  true,
  true
FROM category_ids c, brand_ids b
WHERE c.slug = 'smartphones' AND b.slug = 'apple'

UNION ALL

SELECT 
  'MacBook Air M3',
  'macbook-air-m3',
  'Laptop ultrafino com chip M3, tela Liquid Retina de 13.6 polegadas e até 18 horas de bateria. Perfeito para trabalho e criatividade.',
  'Laptop ultrafino com chip M3 e 18h de bateria',
  12999.99,
  NULL,
  0,
  'MBA-M3-256-SG',
  15,
  c.id,
  b.id,
  true,
  true
FROM category_ids c, brand_ids b
WHERE c.slug = 'laptops' AND b.slug = 'apple'

UNION ALL

SELECT 
  'AirPods Pro 2ª Geração',
  'airpods-pro-2',
  'Fones de ouvido sem fio com cancelamento ativo de ruído e áudio espacial personalizado. Até 6 horas de reprodução com uma carga.',
  'Fones sem fio com cancelamento ativo de ruído',
  2299.99,
  2599.99,
  12,
  'APP-2GEN-WHT',
  40,
  c.id,
  b.id,
  true,
  true
FROM category_ids c, brand_ids b
WHERE c.slug = 'audio' AND b.slug = 'apple'

UNION ALL

SELECT 
  'Apple Watch Series 9',
  'apple-watch-series-9',
  'Smartwatch com GPS, tela Always-On Retina e recursos avançados de saúde e fitness. Resistente à água até 50 metros.',
  'Smartwatch com GPS e recursos de saúde',
  3999.99,
  NULL,
  0,
  'AWS9-45-MID',
  30,
  c.id,
  b.id,
  false,
  true
FROM category_ids c, brand_ids b
WHERE c.slug = 'watches' AND b.slug = 'apple'

UNION ALL

SELECT 
  'Samsung Galaxy S24 Ultra',
  'galaxy-s24-ultra',
  'Smartphone premium com S Pen, câmera de 200MP e tela Dynamic AMOLED 2X de 6.8 polegadas. IA integrada para produtividade.',
  'Smartphone premium com S Pen e câmera 200MP',
  7999.99,
  8999.99,
  11,
  'SGS24U-256-TIT',
  20,
  c.id,
  b.id,
  true,
  true
FROM category_ids c, brand_ids b
WHERE c.slug = 'smartphones' AND b.slug = 'samsung'

UNION ALL

SELECT 
  'Dell XPS 13',
  'dell-xps-13',
  'Ultrabook premium com processador Intel Core i7, 16GB RAM e SSD de 512GB. Tela InfinityEdge de 13.4 polegadas.',
  'Ultrabook premium com Intel Core i7',
  8999.99,
  NULL,
  0,
  'DXS13-I7-16-512',
  12,
  c.id,
  b.id,
  false,
  true
FROM category_ids c, brand_ids b
WHERE c.slug = 'laptops' AND b.slug = 'dell'

UNION ALL

SELECT 
  'Sony WH-1000XM5',
  'sony-wh-1000xm5',
  'Headphone premium com cancelamento de ruído líder da indústria e qualidade de som excepcional. Até 30 horas de bateria.',
  'Headphone premium com cancelamento de ruído',
  1899.99,
  2199.99,
  14,
  'SWH1000XM5-BLK',
  35,
  c.id,
  b.id,
  true,
  true
FROM category_ids c, brand_ids b
WHERE c.slug = 'audio' AND b.slug = 'sony'

UNION ALL

SELECT 
  'Canon EOS R6 Mark II',
  'canon-eos-r6-mark-ii',
  'Câmera mirrorless full-frame com sensor de 24.2MP e gravação de vídeo 4K. Sistema de foco automático avançado.',
  'Câmera mirrorless full-frame 24.2MP',
  15999.99,
  NULL,
  0,
  'CEOSR6M2-BODY',
  8,
  c.id,
  b.id,
  false,
  true
FROM category_ids c, brand_ids b
WHERE c.slug = 'cameras' AND b.slug = 'canon'

UNION ALL

SELECT 
  'PlayStation 5',
  'playstation-5',
  'Console de videogame de nova geração com SSD ultra-rápido e gráficos ray tracing. Inclui controle DualSense.',
  'Console nova geração com SSD ultra-rápido',
  4999.99,
  5499.99,
  9,
  'PS5-825GB-WHT',
  18,
  c.id,
  b.id,
  true,
  true
FROM category_ids c, brand_ids b
WHERE c.slug = 'games' AND b.slug = 'sony'

UNION ALL

SELECT 
  'iPad Pro 12.9"',
  'ipad-pro-12-9',
  'Tablet profissional com chip M2, tela Liquid Retina XDR e suporte ao Apple Pencil. Ideal para criatividade e produtividade.',
  'Tablet profissional com chip M2',
  10999.99,
  NULL,
  0,
  'IPP129-M2-256-SG',
  22,
  c.id,
  b.id,
  false,
  true
FROM category_ids c, brand_ids b
WHERE c.slug = 'tablets' AND b.slug = 'apple';

-- Inserir imagens dos produtos
WITH product_data AS (
  SELECT id, slug FROM products
)
INSERT INTO product_images (product_id, image_url, alt_text, is_primary, sort_order)
SELECT 
  p.id,
  '/placeholder.svg?height=400&width=400',
  'Imagem do ' || REPLACE(p.slug, '-', ' '),
  true,
  0
FROM product_data p;

-- Inserir especificações dos produtos
WITH iphone_id AS (
  SELECT id FROM products WHERE slug = 'iphone-15-pro-max'
)
INSERT INTO product_specifications (product_id, name, value, sort_order)
SELECT id, 'Tela', '6.7" Super Retina XDR', 1 FROM iphone_id
UNION ALL
SELECT id, 'Processador', 'A17 Pro', 2 FROM iphone_id
UNION ALL
SELECT id, 'Câmera', '48MP Principal + 12MP Ultra Wide', 3 FROM iphone_id
UNION ALL
SELECT id, 'Armazenamento', '256GB', 4 FROM iphone_id
UNION ALL
SELECT id, 'Bateria', 'Até 29 horas de vídeo', 5 FROM iphone_id;

-- Inserir avaliações de exemplo
WITH product_ids AS (
  SELECT id FROM products LIMIT 5
),
user_sample AS (
  INSERT INTO users (email, name, password_hash) VALUES
  ('joao@email.com', 'João Silva', '$2b$10$example'),
  ('maria@email.com', 'Maria Santos', '$2b$10$example'),
  ('pedro@email.com', 'Pedro Costa', '$2b$10$example')
  RETURNING id
)
INSERT INTO reviews (product_id, user_id, rating, title, comment, verified_purchase)
SELECT 
  p.id,
  u.id,
  5,
  'Produto excelente!',
  'Superou minhas expectativas. Qualidade incrível e entrega rápida.',
  true
FROM product_ids p
CROSS JOIN user_sample u
LIMIT 10;

-- Inserir cupons de exemplo
INSERT INTO coupons (code, description, discount_type, discount_value, minimum_amount, usage_limit, valid_from, valid_until, active) VALUES
('BEMVINDO10', 'Desconto de boas-vindas', 'percentage', 10.00, 200.00, 100, NOW(), NOW() + INTERVAL '30 days', true),
('FRETEGRATIS', 'Frete grátis', 'fixed_amount', 15.00, 100.00, 500, NOW(), NOW() + INTERVAL '60 days', true),
('BLACKFRIDAY', 'Black Friday 2024', 'percentage', 25.00, 500.00, 1000, NOW(), NOW() + INTERVAL '7 days', true);
