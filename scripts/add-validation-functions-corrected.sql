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
  coupon_found BOOLEAN := FALSE;
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
  GET DIAGNOSTICS coupon_found = FOUND;
  
  IF NOT coupon_found THEN
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
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = table_name) THEN
      EXECUTE format('DROP TRIGGER IF EXISTS update_%s_updated_at ON %s', table_name, table_name);
      EXECUTE format('CREATE TRIGGER update_%s_updated_at 
                      BEFORE UPDATE ON %s 
                      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()', 
                     table_name, table_name);
    END IF;
  END LOOP;
END $$;

-- Mensagem de sucesso
DO $$
BEGIN
  RAISE NOTICE 'Validation functions created successfully!';
END $$;
