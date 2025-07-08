-- Adicionar coluna cargo na tabela users
ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'user';

-- Criar índice para performance
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Inserir usuário administrador de exemplo
INSERT INTO users (email, name, password_hash, role) VALUES
('admin@ecostore.com', 'Administrador', '$2b$10$example', 'admin')
ON CONFLICT (email) DO UPDATE SET role = 'admin';

-- Atualizar trigger para incluir role
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';
