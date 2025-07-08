-- Funções SQL para validação e controle automático

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
  
  -- Verificar se cupom foi encontrado
  IF coupon_record.id IS NULL THEN
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

-- Função para atualizar estoque automaticamente
CREATE OR REPLACE FUNCTION update_product_stock()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Diminuir estoque quando item é adicionado ao pedido
    UPDATE products 
    SET stock_quantity = stock_quantity - NEW.quantity,
        updated_at = NOW()
    WHERE id = NEW.product_id;
    
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    -- Ajustar estoque quando quantidade é alterada
    UPDATE products 
    SET stock_quantity = stock_quantity + OLD.quantity - NEW.quantity,
        updated_at = NOW()
    WHERE id = NEW.product_id;
    
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    -- Restaurar estoque quando item é removido
    UPDATE products 
    SET stock_quantity = stock_quantity + OLD.quantity,
        updated_at = NOW()
    WHERE id = OLD.product_id;
    
    RETURN OLD;
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Função para calcular total do pedido
CREATE OR REPLACE FUNCTION calculate_order_total()
RETURNS TRIGGER AS $$
DECLARE
  order_subtotal DECIMAL(10,2);
  order_discount DECIMAL(10,2) := 0;
  order_shipping DECIMAL(10,2);
  order_tax DECIMAL(10,2);
  order_total DECIMAL(10,2);
BEGIN
  -- Calcular subtotal
  SELECT COALESCE(SUM(total_price), 0) INTO order_subtotal
  FROM order_items
  WHERE order_id = COALESCE(NEW.order_id, OLD.order_id);
  
  -- Buscar dados do pedido
  SELECT shipping_cost, tax_amount, discount_amount
  INTO order_shipping, order_tax, order_discount
  FROM orders
  WHERE id = COALESCE(NEW.order_id, OLD.order_id);
  
  -- Calcular total
  order_total := order_subtotal + COALESCE(order_shipping, 0) + COALESCE(order_tax, 0) - COALESCE(order_discount, 0);
  
  -- Atualizar pedido
  UPDATE orders
  SET subtotal = order_subtotal,
      total_amount = order_total,
      updated_at = NOW()
  WHERE id = COALESCE(NEW.order_id, OLD.order_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Criar triggers
CREATE TRIGGER update_product_stock_trigger
  AFTER INSERT OR UPDATE OR DELETE ON order_items
  FOR EACH ROW EXECUTE FUNCTION update_product_stock();

CREATE TRIGGER calculate_order_total_trigger
  AFTER INSERT OR UPDATE OR DELETE ON order_items
  FOR EACH ROW EXECUTE FUNCTION calculate_order_total();

-- Triggers para updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_addresses_updated_at
  BEFORE UPDATE ON addresses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_coupons_updated_at
  BEFORE UPDATE ON coupons
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cart_items_updated_at
  BEFORE UPDATE ON cart_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at
  BEFORE UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_loyalty_program_updated_at
  BEFORE UPDATE ON loyalty_program
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_support_chats_updated_at
  BEFORE UPDATE ON support_chats
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Função para limpeza automática de dados antigos
CREATE OR REPLACE FUNCTION cleanup_old_data()
RETURNS VOID AS $$
BEGIN
  -- Limpar carrinho abandonado (mais de 30 dias)
  DELETE FROM cart_items 
  WHERE updated_at < NOW() - INTERVAL '30 days';
  
  -- Limpar notificações antigas (mais de 90 dias)
  DELETE FROM notifications 
  WHERE created_at < NOW() - INTERVAL '90 days' AND read = true;
  
  -- Limpar tentativas de login antigas
  UPDATE users 
  SET login_attempts = 0, locked_until = NULL
  WHERE locked_until < NOW();
  
  RAISE NOTICE 'Cleanup completed successfully';
END;
$$ LANGUAGE plpgsql;

-- Mensagem de sucesso
SELECT 'Validation functions and triggers created successfully!' as message;
