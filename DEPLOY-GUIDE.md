# 🚀 Guia Completo de Deploy - EcoStore

## 📋 Pré-requisitos

### 1. Contas Necessárias
- [Vercel](https://vercel.com) (hospedagem gratuita)
- [Supabase](https://supabase.com) (banco de dados gratuito)
- [GitHub](https://github.com) (código fonte)

### 2. Ferramentas
- Node.js 18+ instalado
- Git instalado
- CLI da Vercel (opcional)

## 🗄️ Configuração do Banco de Dados

### Passo 1: Criar Projeto no Supabase
1. Acesse [supabase.com](https://supabase.com)
2. Clique em "Start your project"
3. Crie uma nova organização (se necessário)
4. Clique em "New Project"
5. Escolha:
   - **Name**: ecostore-db
   - **Database Password**: (anote essa senha!)
   - **Region**: South America (São Paulo)
6. Clique em "Create new project"

### Passo 2: Executar Scripts SQL
1. No painel do Supabase, vá em **SQL Editor**
2. Execute os scripts na ordem:

**Primeiro - Schema Principal:**
\`\`\`sql
-- Cole o conteúdo do arquivo scripts/fix-database-schema.sql
\`\`\`

**Segundo - Funções e Validações:**
\`\`\`sql
-- Cole o conteúdo do arquivo scripts/add-validation-functions-final.sql
\`\`\`

**Terceiro - Dados de Exemplo:**
\`\`\`sql
-- Cole o conteúdo do arquivo scripts/seed-complete-data.sql
\`\`\`

### Passo 3: Configurar Autenticação
1. Vá em **Authentication > Settings**
2. Configure:
   - **Site URL**: `https://seu-dominio.vercel.app`
   - **Redirect URLs**: `https://seu-dominio.vercel.app/auth/callback`

### Passo 4: Obter Credenciais
1. Vá em **Settings > API**
2. Anote:
   - **Project URL**
   - **anon/public key**
   - **service_role key** (mantenha seguro!)

## 🌐 Deploy na Vercel

### Método 1: Deploy via GitHub (Recomendado)

#### Passo 1: Subir Código para GitHub
\`\`\`bash
# No terminal, na pasta do projeto:
git init
git add .
git commit -m "Initial commit - EcoStore"

# Crie um repositório no GitHub e execute:
git remote add origin https://github.com/SEU-USUARIO/ecostore.git
git branch -M main
git push -u origin main
\`\`\`

#### Passo 2: Conectar Vercel ao GitHub
1. Acesse [vercel.com](https://vercel.com)
2. Clique em "New Project"
3. Conecte sua conta GitHub
4. Selecione o repositório "ecostore"
5. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: ./
   - **Build Command**: `npm run build`
   - **Output Directory**: .next

#### Passo 3: Configurar Variáveis de Ambiente
Na seção "Environment Variables", adicione:

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-publica-aqui
SUPABASE_SERVICE_ROLE_KEY=sua-chave-service-role-aqui
\`\`\`

#### Passo 4: Deploy
1. Clique em "Deploy"
2. Aguarde o build (2-5 minutos)
3. Sua loja estará online! 🎉

### Método 2: Deploy via CLI da Vercel

\`\`\`bash
# Instalar CLI da Vercel
npm i -g vercel

# Na pasta do projeto
vercel

# Seguir as instruções:
# - Set up and deploy? Y
# - Which scope? (sua conta)
# - Link to existing project? N
# - Project name: ecostore
# - Directory: ./
# - Override settings? N

# Configurar variáveis de ambiente
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY

# Deploy final
vercel --prod
\`\`\`

## 🔧 Configurações Pós-Deploy

### 1. Configurar Domínio Personalizado (Opcional)
1. No painel da Vercel, vá em **Settings > Domains**
2. Adicione seu domínio personalizado
3. Configure DNS conforme instruções

### 2. Configurar HTTPS e Segurança
- ✅ HTTPS automático (Vercel)
- ✅ Headers de segurança configurados
- ✅ CSP (Content Security Policy)

### 3. Monitoramento e Analytics
\`\`\`bash
# Instalar Vercel Analytics
npm install @vercel/analytics

# Adicionar ao layout.tsx
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
\`\`\`

## 📊 Configurações de Performance

### 1. Otimização de Imagens
\`\`\`javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['seu-projeto.supabase.co'],
    formats: ['image/webp', 'image/avif'],
  },
  experimental: {
    optimizeCss: true,
  },
}

module.exports = nextConfig
\`\`\`

### 2. Cache e CDN
- ✅ CDN global automático (Vercel)
- ✅ Cache de assets estáticos
- ✅ Compressão gzip/brotli

## 🛡️ Segurança em Produção

### 1. Variáveis de Ambiente Seguras
\`\`\`env
# Nunca commitar essas chaves!
SUPABASE_SERVICE_ROLE_KEY=sua-chave-secreta
NEXTAUTH_SECRET=sua-chave-nextauth-secreta
STRIPE_SECRET_KEY=sua-chave-stripe-secreta
\`\`\`

### 2. RLS (Row Level Security) no Supabase
\`\`\`sql
-- Habilitar RLS em todas as tabelas sensíveis
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Políticas de exemplo
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);
\`\`\`

## 📱 PWA (Progressive Web App)

### 1. Configurar Manifest
\`\`\`json
// public/manifest.json
{
  "name": "EcoStore - Sua Loja Online",
  "short_name": "EcoStore",
  "description": "Loja online completa com os melhores produtos",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#000000",
  "icons": [
    {
      "src": "/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
\`\`\`

### 2. Service Worker
\`\`\`javascript
// public/sw.js
const CACHE_NAME = 'ecostore-v1';
const urlsToCache = [
  '/',
  '/products',
  '/categories',
  '/static/js/bundle.js',
  '/static/css/main.css',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request);
      }
    )
  );
});
\`\`\`

## 🔍 SEO e Marketing

### 1. Meta Tags Dinâmicas
\`\`\`typescript
// app/products/[id]/page.tsx
export async function generateMetadata({ params }): Promise<Metadata> {
  const product = await getProduct(params.id);
  
  return {
    title: `${product.name} - EcoStore`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [product.image_url],
    },
  };
}
\`\`\`

### 2. Sitemap Automático
\`\`\`typescript
// app/sitemap.ts
export default async function sitemap() {
  const products = await getProducts();
  
  const productUrls = products.map((product) => ({
    url: `https://seu-dominio.com/products/${product.id}`,
    lastModified: new Date(product.updated_at),
  }));

  return [
    {
      url: 'https://seu-dominio.com',
      lastModified: new Date(),
    },
    {
      url: 'https://seu-dominio.com/products',
      lastModified: new Date(),
    },
    ...productUrls,
  ];
}
\`\`\`

## 💳 Integração de Pagamentos

### 1. Stripe (Recomendado)
\`\`\`bash
npm install stripe @stripe/stripe-js
\`\`\`

\`\`\`typescript
// lib/stripe.ts
import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});
\`\`\`

### 2. Mercado Pago (Brasil)
\`\`\`bash
npm install mercadopago
\`\`\`

## 📧 Email e Notificações

### 1. Resend (Email)
\`\`\`bash
npm install resend
\`\`\`

\`\`\`typescript
// lib/email.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOrderConfirmation(order: Order) {
  await resend.emails.send({
    from: 'noreply@ecostore.com',
    to: order.customer_email,
    subject: `Pedido #${order.order_number} confirmado!`,
    html: `<h1>Obrigado pela compra!</h1>...`,
  });
}
\`\`\`

## 🚀 Checklist Final de Deploy

### Antes do Deploy:
- [ ] Código testado localmente
- [ ] Banco de dados configurado
- [ ] Variáveis de ambiente definidas
- [ ] Imagens otimizadas
- [ ] SEO configurado

### Após o Deploy:
- [ ] Testar todas as funcionalidades
- [ ] Verificar formulários
- [ ] Testar pagamentos (modo teste)
- [ ] Verificar emails
- [ ] Testar responsividade
- [ ] Verificar performance (PageSpeed)

### Monitoramento:
- [ ] Configurar alertas de erro
- [ ] Monitorar performance
- [ ] Backup automático do banco
- [ ] Logs de segurança

## 🎯 Próximos Passos

1. **Marketing Digital**
   - Google Analytics
   - Facebook Pixel
   - Google Ads
   - SEO avançado

2. **Funcionalidades Avançadas**
   - Chat ao vivo
   - Programa de afiliados
   - Multi-idiomas
   - App mobile

3. **Escalabilidade**
   - CDN para imagens
   - Cache Redis
   - Load balancing
   - Microserviços

---

## 🆘 Suporte

Se encontrar problemas:
1. Verifique os logs na Vercel
2. Teste localmente primeiro
3. Verifique variáveis de ambiente
4. Consulte documentação oficial

**Sua loja está pronta para o mundo! 🌟**
