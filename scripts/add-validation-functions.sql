-- Funções SQL para validação e controle

-- Função para incrementar tentativas de login
CREATE OR REPLACE FUNCTION increment_login_attempts(user_email VARCHAR)
RETURNS VOID AS $$
BEGIN
  UPDATE users 
  SET login_attempts = COALESCE(login_attempts, 0) + 1
  WHERE email = user_email;
END;
$$ LANGUAGE plpgsql;

-- Função para adicionar pontos de fidelidade
CREATE OR REPLACE FUNCTION add_loyalty_points(user_id UUID, points INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE loyalty_program 
  SET 
    points_balance = points_balance + points,
    total_points_earned = total_points_earned + points,
    updated_at = NOW()
  WHERE user_id = user_id;
END;
$$ LANGUAGE plpgsql;

-- Função para subtrair pontos de fidelidade
CREATE OR REPLACE FUNCTION subtract_loyalty_points(user_id UUID, points INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE loyalty_program 
  SET 
    points_balance = GREATEST(0, points_balance - points),
    updated_at = NOW()
  WHERE user_id = user_id;
END;
$$ LANGUAGE plpgsql;

-- Função para validar estoque antes de venda
CREATE OR REPLACE FUNCTION validate_stock(product_id UUID, quantity INTEGER)
RETURNS BOOLEAN AS $$
DECLARE
  available_stock INTEGER;
BEGIN
  SELECT (quantity - reserved_quantity) INTO available_stock
  FROM inventory
  WHERE product_id = product_id;
  
  RETURN available_stock >= quantity;
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
  order_number := 'ECO-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(counter::TEXT, 6, '0');
  RETURN order_number;
END;
$$ LANGUAGE plpgsql;

-- Função para calcular desconto de cupom
CREATE OR REPLACE FUNCTION calculate_coupon_discount(
  coupon_code VARCHAR,
  order_amount DECIMAL,
  user_id UUID
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
  WHERE coupon_id = coupon_record.id AND user_id = user_id;
  
  IF user_usage_count >= coupon_record.max_uses_per_user THEN
    RETURN 0;
  END IF;
  
  -- Calcular desconto
  IF coupon_record.discount_type = 'percentage' THEN
    discount_amount := order_amount * (coupon_record.discount_value / 100);
  ELSE
    discount_amount := coupon_record.discount_value;
  END IF;
  
  -- Não pode ser maior que o valor do pedido
  discount_amount := LEAST(discount_amount, order_amount);
  
  RETURN discount_amount;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar estoque automaticamente
CREATE OR REPLACE FUNCTION update_inventory_on_order()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Reservar estoque quando item é adicionado ao pedido
    UPDATE inventory
    SET reserved_quantity = reserved_quantity + NEW.quantity
    WHERE product_id = NEW.product_id;
    
  ELSIF TG_OP = 'UPDATE' THEN
    -- Ajustar reserva se quantidade mudou
    UPDATE inventory
    SET reserved_quantity = reserved_quantity - OLD.quantity + NEW.quantity
    WHERE product_id = NEW.product_id;
    
  ELSIF TG_OP = 'DELETE' THEN
    -- Liberar estoque quando item é removido
    UPDATE inventory
    SET reserved_quantity = reserved_quantity - OLD.quantity
    WHERE product_id = OLD.product_id;
    
    RETURN OLD;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger
CREATE TRIGGER inventory_update_trigger
  AFTER INSERT OR UPDATE OR DELETE ON order_items
  FOR EACH ROW EXECUTE FUNCTION update_inventory_on_order();

-- Trigger para confirmar venda e atualizar estoque
CREATE OR REPLACE FUNCTION confirm_sale_inventory()
RETURNS TRIGGER AS $$
BEGIN
  -- Quando pedido é confirmado como entregue
  IF NEW.status = 'delivered' AND OLD.status != 'delivered' THEN
    -- Confirmar venda no estoque
    UPDATE inventory
    SET 
      quantity = quantity - oi.quantity,
      reserved_quantity = reserved_quantity - oi.quantity
    FROM order_items oi
    WHERE oi.order_id = NEW.id AND inventory.product_id = oi.product_id;
    
    -- Registrar movimentação
    INSERT INTO inventory_movements (product_id, type, quantity, reference_id, reference_type, notes)
    SELECT 
      oi.product_id,
      'out',
      oi.quantity,
      NEW.id,
      'order',
      'Venda confirmada - Pedido ' || NEW.order_number
    FROM order_items oi
    WHERE oi.order_id = NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger
CREATE TRIGGER confirm_sale_trigger
  AFTER UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION confirm_sale_inventory();

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

-- Índices adicionais para performance
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_orders_created_at_status ON orders(created_at, status);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_order_items_product_order ON order_items(product_id, order_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_inventory_movements_created_at ON inventory_movements(created_at);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_coupon_uses_created_at ON coupon_uses(used_at);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_loyalty_transactions_created_at ON loyalty_transactions(created_at);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_product_views_created_at ON product_views(viewed_at);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_sessions_expires_at ON user_sessions(expires_at);

-- Constraints adicionais para integridade
ALTER TABLE products ADD CONSTRAINT chk_price_positive CHECK (price > 0);
ALTER TABLE products ADD CONSTRAINT chk_stock_non_negative CHECK (stock_quantity >= 0);
ALTER TABLE inventory ADD CONSTRAINT chk_inventory_non_negative CHECK (quantity >= 0 AND reserved_quantity >= 0);
ALTER TABLE reviews ADD CONSTRAINT chk_rating_range CHECK (rating >= 1 AND rating <= 5);
ALTER TABLE coupons ADD CONSTRAINT chk_discount_positive CHECK (discount_value > 0);
ALTER TABLE loyalty_transactions ADD CONSTRAINT chk_points_non_zero CHECK (points != 0);
