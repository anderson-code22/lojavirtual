-- Funções SQL para validação e controle (versão corrigida)

-- Função para incrementar tentativas de login
CREATE OR REPLACE FUNCTION increment_login_attempts(user_email VARCHAR)
RETURNS VOID AS $$
BEGIN
  UPDATE users 
  SET login_attempts = COALESCE(login_attempts, 0) + 1,
      updated_at = NOW()
  WHERE email = user_email;
END;
$$ LANGUAGE plpgsql;

-- Função para resetar tentativas de login
CREATE OR REPLACE FUNCTION reset_login_attempts(user_email VARCHAR)
RETURNS VOID AS $$
BEGIN
  UPDATE users 
  SET login_attempts = 0,
      locked_until = NULL,
      updated_at = NOW()
  WHERE email = user_email;
END;
$$ LANGUAGE plpgsql;

-- Função para bloquear usuário temporariamente
CREATE OR REPLACE FUNCTION lock_user_temporarily(user_email VARCHAR, minutes INTEGER DEFAULT 30)
RETURNS VOID AS $$
BEGIN
  UPDATE users 
  SET locked_until = NOW() + INTERVAL '1 minute' * minutes,
      updated_at = NOW()
  WHERE email = user_email;
END;
$$ LANGUAGE plpgsql;

-- Função para adicionar pontos de fidelidade
CREATE OR REPLACE FUNCTION add_loyalty_points(user_id_param UUID, points INTEGER)
RETURNS VOID AS $$
BEGIN
  -- Inserir ou atualizar programa de fidelidade
  INSERT INTO loyalty_program (user_id, points_balance, total_points_earned, updated_at)
  VALUES (user_id_param, points, points, NOW())
  ON CONFLICT (user_id) 
  DO UPDATE SET 
    points_balance = loyalty_program.points_balance + points,
    total_points_earned = loyalty_program.total_points_earned + points,
    updated_at = NOW();
    
  -- Registrar transação
  INSERT INTO loyalty_transactions (user_id, type, points, description, created_at)
  VALUES (user_id_param, 'earned', points, 'Pontos ganhos por compra', NOW());
END;
$$ LANGUAGE plpgsql;

-- Função para subtrair pontos de fidelidade
CREATE OR REPLACE FUNCTION subtract_loyalty_points(user_id_param UUID, points INTEGER)
RETURNS BOOLEAN AS $$
DECLARE
  current_balance INTEGER;
BEGIN
  -- Verificar saldo atual
  SELECT points_balance INTO current_balance
  FROM loyalty_program
  WHERE user_id = user_id_param;
  
  IF current_balance IS NULL OR current_balance < points THEN
    RETURN FALSE;
  END IF;
  
  -- Subtrair pontos
  UPDATE loyalty_program 
  SET 
    points_balance = points_balance - points,
    total_points_redeemed = total_points_redeemed + points,
    updated_at = NOW()
  WHERE user_id = user_id_param;
  
  -- Registrar transação
  INSERT INTO loyalty_transactions (user_id, type, points, description, created_at)
  VALUES (user_id_param, 'redeemed', -points, 'Pontos utilizados', NOW());
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Função para validar estoque antes de venda
CREATE OR REPLACE FUNCTION validate_stock(product_id_param UUID, quantity INTEGER)
RETURNS BOOLEAN AS $$
DECLARE
  available_stock INTEGER;
BEGIN
  SELECT (quantity - reserved_quantity) INTO available_stock
  FROM inventory
  WHERE product_id = product_id_param;
  
  RETURN COALESCE(available_stock, 0) >= quantity;
END;
$$ LANGUAGE plpgsql;

-- Função para reservar estoque
CREATE OR REPLACE FUNCTION reserve_stock(product_id_param UUID, quantity INTEGER)
RETURNS BOOLEAN AS $$
DECLARE
  available_stock INTEGER;
BEGIN
  -- Verificar estoque disponível
  SELECT (quantity - reserved_quantity) INTO available_stock
  FROM inventory
  WHERE product_id = product_id_param;
  
  IF COALESCE(available_stock, 0) < quantity THEN
    RETURN FALSE;
  END IF;
  
  -- Reservar estoque
  UPDATE inventory
  SET reserved_quantity = reserved_quantity + quantity,
      updated_at = NOW()
  WHERE product_id = product_id_param;
  
  -- Registrar movimentação
  INSERT INTO inventory_movements (product_id, type, quantity, reference_type, notes, created_at)
  VALUES (product_id_param, 'out', quantity, 'reservation', 'Estoque reservado', NOW());
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Função para liberar estoque reservado
CREATE OR REPLACE FUNCTION release_reserved_stock(product_id_param UUID, quantity INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE inventory
  SET reserved_quantity = GREATEST(0, reserved_quantity - quantity),
      updated_at = NOW()
  WHERE product_id = product_id_param;
  
  -- Registrar movimentação
  INSERT INTO inventory_movements (product_id, type, quantity, reference_type, notes, created_at)
  VALUES (product_id_param, 'in', quantity, 'release', 'Estoque liberado', NOW());
END;
$$ LANGUAGE plpgsql;

-- Função para gerar número de pedido único
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS VARCHAR AS $$
DECLARE
  order_number VARCHAR;
  counter INTEGER;
BEGIN
  SELECT COUNT(*) + 1 INTO counter FROM orders WHERE DATE(created_at) = CURRENT_DATE;
  order_number := 'ECO-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(counter::TEXT, 4, '0');
  RETURN order_number;
END;
$$ LANGUAGE plpgsql;

-- Função para calcular desconto de cupom
CREATE OR REPLACE FUNCTION calculate_coupon_discount(
  coupon_code VARCHAR,
  order_amount DECIMAL,
  user_id_param UUID
)
RETURNS DECIMAL AS $$
DECLARE
  coupon_record RECORD;
  discount_amount DECIMAL := 0;
  usage_count INTEGER;
  user_usage_count INTEGER;
BEGIN
  -- Buscar cupom válido
  SELECT * INTO coupon_record
  FROM coupons
  WHERE code = coupon_code
    AND active = true
    AND (valid_from IS NULL OR valid_from <= NOW())
    AND (valid_until IS NULL OR valid_until >= NOW())
    AND (minimum_amount IS NULL OR order_amount >= minimum_amount);
  
  IF NOT FOUND THEN
    RETURN 0;
  END IF;
  
  -- Verificar limite de uso geral
  IF coupon_record.usage_limit IS NOT NULL THEN
    SELECT COUNT(*) INTO usage_count
    FROM coupon_uses
    WHERE coupon_id = coupon_record.id;
    
    IF usage_count >= coupon_record.usage_limit THEN
      RETURN 0;
    END IF;
  END IF;
  
  -- Verificar limite de uso por usuário
  SELECT COUNT(*) INTO user_usage_count
  FROM coupon_uses
  WHERE coupon_id = coupon_record.id AND user_id = user_id_param;
  
  IF user_usage_count >= coupon_record.max_uses_per_user THEN
    RETURN 0;
  END IF;
  
  -- Calcular desconto
  IF coupon_record.discount_type = 'percentage' THEN
    discount_amount := order_amount * (coupon_record.discount_value / 100);
    -- Aplicar desconto máximo se definido
    IF coupon_record.maximum_discount IS NOT NULL THEN
      discount_amount := LEAST(discount_amount, coupon_record.maximum_discount);
    END IF;
  ELSE
    discount_amount := coupon_record.discount_value;
  END IF;
  
  -- Não pode ser maior que o valor do pedido
  discount_amount := LEAST(discount_amount, order_amount);
  
  RETURN discount_amount;
END;
$$ LANGUAGE plpgsql;

-- Função para aplicar cupom
CREATE OR REPLACE FUNCTION apply_coupon(
  coupon_code VARCHAR,
  order_id_param UUID,
  user_id_param UUID,
  order_amount DECIMAL
)
RETURNS DECIMAL AS $$
DECLARE
  coupon_record RECORD;
  discount_amount DECIMAL;
BEGIN
  -- Calcular desconto
  discount_amount := calculate_coupon_discount(coupon_code, order_amount, user_id_param);
  
  IF discount_amount > 0 THEN
    -- Buscar cupom
    SELECT * INTO coupon_record
    FROM coupons
    WHERE code = coupon_code AND active = true;
    
    -- Registrar uso do cupom
    INSERT INTO coupon_uses (coupon_id, user_id, order_id, discount_amount, used_at)
    VALUES (coupon_record.id, user_id_param, order_id_param, discount_amount, NOW());
  END IF;
  
  RETURN discount_amount;
END;
$$ LANGUAGE plpgsql;

-- Função para atualizar tier de fidelidade
CREATE OR REPLACE FUNCTION update_loyalty_tier(user_id_param UUID)
RETURNS VARCHAR AS $$
DECLARE
  total_points INTEGER;
  new_tier VARCHAR;
BEGIN
  SELECT total_points_earned INTO total_points
  FROM loyalty_program
  WHERE user_id = user_id_param;
  
  IF total_points IS NULL THEN
    RETURN 'bronze';
  END IF;
  
  -- Definir tier baseado nos pontos totais ganhos
  IF total_points >= 10000 THEN
    new_tier := 'platinum';
  ELSIF total_points >= 5000 THEN
    new_tier := 'gold';
  ELSIF total_points >= 1000 THEN
    new_tier := 'silver';
  ELSE
    new_tier := 'bronze';
  END IF;
  
  -- Atualizar tier
  UPDATE loyalty_program
  SET tier = new_tier, updated_at = NOW()
  WHERE user_id = user_id_param;
  
  RETURN new_tier;
END;
$$ LANGUAGE plpgsql;

-- Função para limpar dados antigos
CREATE OR REPLACE FUNCTION cleanup_old_data()
RETURNS VOID AS $$
BEGIN
  -- Limpar sessões expiradas
  DELETE FROM user_sessions WHERE expires_at < NOW() - INTERVAL '7 days';
  
  -- Limpar tokens de reset expirados
  DELETE FROM password_reset_tokens WHERE expires_at < NOW() - INTERVAL '1 day';
  
  -- Limpar verificações de email expiradas
  DELETE FROM email_verifications WHERE expires_at < NOW() - INTERVAL '1 day';
  
  -- Limpar logs antigos (manter apenas 90 dias)
  DELETE FROM system_logs WHERE created_at < NOW() - INTERVAL '90 days';
  
  -- Limpar visualizações antigas (manter apenas 30 dias)
  DELETE FROM product_views WHERE viewed_at < NOW() - INTERVAL '30 days';
  
  -- Limpar itens do carrinho abandonados (mais de 30 dias)
  DELETE FROM cart_items WHERE updated_at < NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql;

-- Função para calcular métricas de vendas
CREATE OR REPLACE FUNCTION calculate_sales_metrics(start_date DATE, end_date DATE)
RETURNS TABLE(
  total_orders INTEGER,
  total_revenue DECIMAL,
  avg_order_value DECIMAL,
  new_customers INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::INTEGER as total_orders,
    COALESCE(SUM(o.total_amount), 0) as total_revenue,
    COALESCE(AVG(o.total_amount), 0) as avg_order_value,
    COUNT(DISTINCT CASE WHEN u.created_at >= start_date THEN o.user_id END)::INTEGER as new_customers
  FROM orders o
  LEFT JOIN users u ON o.user_id = u.id
  WHERE o.created_at >= start_date 
    AND o.created_at <= end_date
    AND o.status = 'delivered';
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar estoque automaticamente quando itens são adicionados/removidos do pedido
CREATE OR REPLACE FUNCTION update_inventory_on_order()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Reservar estoque quando item é adicionado ao pedido
    PERFORM reserve_stock(NEW.product_id, NEW.quantity);
    
  ELSIF TG_OP = 'UPDATE' THEN
    -- Ajustar reserva se quantidade mudou
    IF OLD.quantity != NEW.quantity THEN
      PERFORM release_reserved_stock(OLD.product_id, OLD.quantity);
      PERFORM reserve_stock(NEW.product_id, NEW.quantity);
    END IF;
    
  ELSIF TG_OP = 'DELETE' THEN
    -- Liberar estoque quando item é removido
    PERFORM release_reserved_stock(OLD.product_id, OLD.quantity);
    RETURN OLD;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger apenas se a tabela order_items existir
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'order_items') THEN
    DROP TRIGGER IF EXISTS inventory_update_trigger ON order_items;
    CREATE TRIGGER inventory_update_trigger
      AFTER INSERT OR UPDATE OR DELETE ON order_items
      FOR EACH ROW EXECUTE FUNCTION update_inventory_on_order();
  END IF;
END $$;

-- Trigger para confirmar venda e atualizar estoque quando pedido é entregue
CREATE OR REPLACE FUNCTION confirm_sale_inventory()
RETURNS TRIGGER AS $$
BEGIN
  -- Quando pedido é confirmado como entregue
  IF NEW.status = 'delivered' AND OLD.status != 'delivered' THEN
    -- Confirmar venda no estoque
    UPDATE inventory
    SET 
      quantity = quantity - oi.quantity,
      reserved_quantity = reserved_quantity - oi.quantity,
      updated_at = NOW()
    FROM order_items oi
    WHERE oi.order_id = NEW.id AND inventory.product_id = oi.product_id;
    
    -- Registrar movimentação
    INSERT INTO inventory_movements (product_id, type, quantity, reference_id, reference_type, notes, created_at)
    SELECT 
      oi.product_id,
      'out',
      oi.quantity,
      NEW.id,
      'order',
      'Venda confirmada - Pedido ' || NEW.order_number,
      NOW()
    FROM order_items oi
    WHERE oi.order_id = NEW.id;
    
    -- Adicionar pontos de fidelidade (1 ponto por real gasto)
    IF NEW.user_id IS NOT NULL THEN
      PERFORM add_loyalty_points(NEW.user_id, FLOOR(NEW.total_amount)::INTEGER);
      PERFORM update_loyalty_tier(NEW.user_id);
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger
DROP TRIGGER IF EXISTS confirm_sale_trigger ON orders;
CREATE TRIGGER confirm_sale_trigger
  AFTER UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION confirm_sale_inventory();

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger de updated_at em todas as tabelas relevantes
DO $$
DECLARE
  table_name TEXT;
  tables_with_updated_at TEXT[] := ARRAY[
    'users', 'categories', 'products', 'addresses', 'orders', 
    'coupons', 'reviews', 'cart_items', 'inventory', 'loyalty_program'
  ];
BEGIN
  FOREACH table_name IN ARRAY tables_with_updated_at
  LOOP
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = table_name) THEN
      EXECUTE format('DROP TRIGGER IF EXISTS update_%s_updated_at ON %s', table_name, table_name);
      EXECUTE format('CREATE TRIGGER update_%s_updated_at 
                      BEFORE UPDATE ON %s 
                      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()', 
                     table_name, table_name);
    END IF;
  END LOOP;
END $$;

-- Índices adicionais para performance
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_orders_created_at_status ON orders(created_at, status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_order_items_product_order ON order_items(product_id, order_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_inventory_movements_created_at ON inventory_movements(created_at);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_coupon_uses_created_at ON coupon_uses(used_at);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_loyalty_transactions_created_at ON loyalty_transactions(created_at);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_product_views_created_at ON product_views(viewed_at);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_sessions_expires_at ON user_sessions(expires_at);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_name_search ON products USING gin(to_tsvector('portuguese', name || ' ' || COALESCE(description, '')));
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_categories_name_search ON categories USING gin(to_tsvector('portuguese', name || ' ' || COALESCE(description, '')));

-- Constraints adicionais para integridade
ALTER TABLE products ADD CONSTRAINT IF NOT EXISTS chk_price_positive CHECK (price > 0);
ALTER TABLE products ADD CONSTRAINT IF NOT EXISTS chk_stock_non_negative CHECK (stock_quantity >= 0);
ALTER TABLE products ADD CONSTRAINT IF NOT EXISTS chk_compare_price_higher CHECK (compare_price IS NULL OR compare_price >= price);
ALTER TABLE inventory ADD CONSTRAINT IF NOT EXISTS chk_inventory_non_negative CHECK (quantity >= 0 AND reserved_quantity >= 0);
ALTER TABLE inventory ADD CONSTRAINT IF NOT EXISTS chk_reserved_not_exceed_quantity CHECK (reserved_quantity <= quantity);
ALTER TABLE reviews ADD CONSTRAINT IF NOT EXISTS chk_rating_range CHECK (rating >= 1 AND rating <= 5);
ALTER TABLE coupons ADD CONSTRAINT IF NOT EXISTS chk_discount_positive CHECK (discount_value > 0);
ALTER TABLE coupons ADD CONSTRAINT IF NOT EXISTS chk_valid_dates CHECK (valid_from IS NULL OR valid_until IS NULL OR valid_from <= valid_until);
ALTER TABLE loyalty_transactions ADD CONSTRAINT IF NOT EXISTS chk_points_non_zero CHECK (points != 0);
ALTER TABLE order_items ADD CONSTRAINT IF NOT EXISTS chk_quantity_positive CHECK (quantity > 0);
ALTER TABLE order_items ADD CONSTRAINT IF NOT EXISTS chk_prices_positive CHECK (unit_price > 0 AND total_price > 0);

-- Função para busca full-text em produtos
CREATE OR REPLACE FUNCTION search_products(search_term TEXT, category_filter UUID DEFAULT NULL, limit_results INTEGER DEFAULT 20)
RETURNS TABLE(
  id UUID,
  name VARCHAR,
  slug VARCHAR,
  price DECIMAL,
  stock_quantity INTEGER,
  category_name VARCHAR,
  rank REAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.name,
    p.slug,
    p.price,
    p.stock_quantity,
    c.name as category_name,
    ts_rank(to_tsvector('portuguese', p.name || ' ' || COALESCE(p.description, '')), plainto_tsquery('portuguese', search_term)) as rank
  FROM products p
  LEFT JOIN categories c ON p.category_id = c.id
  WHERE 
    p.status = 'active'
    AND (category_filter IS NULL OR p.category_id = category_filter)
    AND (
      to_tsvector('portuguese', p.name || ' ' || COALESCE(p.description, '')) @@ plainto_tsquery('portuguese', search_term)
      OR p.name ILIKE '%' || search_term || '%'
      OR p.sku ILIKE '%' || search_term || '%'
    )
  ORDER BY rank DESC, p.name
  LIMIT limit_results;
END;
$$ LANGUAGE plpgsql;

-- Inserir dados iniciais se não existirem
INSERT INTO categories (id, name, slug, description, active) 
VALUES 
  (gen_random_uuid(), 'Eletrônicos', 'eletronicos', 'Produtos eletrônicos e tecnologia', true),
  (gen_random_uuid(), 'Roupas', 'roupas', 'Vestuário e acessórios', true),
  (gen_random_uuid(), 'Casa e Jardim', 'casa-jardim', 'Produtos para casa e jardim', true),
  (gen_random_uuid(), 'Esportes', 'esportes', 'Artigos esportivos e fitness', true),
  (gen_random_uuid(), 'Livros', 'livros', 'Livros e material educativo', true)
ON CONFLICT (slug) DO NOTHING;

-- Criar usuário admin padrão se não existir
INSERT INTO users (id, email, password_hash, first_name, last_name, role, email_verified)
VALUES (
  gen_random_uuid(),
  'admin@loja.com',
  '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm', -- senha: admin123
  'Admin',
  'Sistema',
  'admin',
  true
)
ON CONFLICT (email) DO NOTHING;

-- Mensagem de sucesso
DO $$
BEGIN
  RAISE NOTICE 'Database schema and functions created successfully!';
  RAISE NOTICE 'Default admin user: admin@loja.com / admin123';
END $$;
