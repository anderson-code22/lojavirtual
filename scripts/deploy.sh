#!/bin/bash

echo "🚀 Iniciando deploy da EcoStore..."

# Verificar se está na pasta correta
if [ ! -f "package.json" ]; then
    echo "❌ Execute este script na pasta raiz do projeto"
    exit 1
fi

# Instalar dependências
echo "📦 Instalando dependências..."
npm install

# Build do projeto
echo "🔨 Fazendo build do projeto..."
npm run build

# Verificar se build foi bem-sucedido
if [ $? -eq 0 ]; then
    echo "✅ Build concluído com sucesso!"
else
    echo "❌ Erro no build. Verifique os erros acima."
    exit 1
fi

# Deploy na Vercel
echo "🌐 Fazendo deploy na Vercel..."
npx vercel --prod

echo "🎉 Deploy concluído! Sua loja está online!"
echo "📋 Não esqueça de:"
echo "   - Configurar variáveis de ambiente"
echo "   - Executar scripts SQL no Supabase"
echo "   - Testar todas as funcionalidades"
