# 🇲🇿 MozCommerce - Marketplace Digital de Moçambique

![MozCommerce](https://img.shields.io/badge/Made%20in-Mo%C3%A7ambique-green?style=for-the-badge)
![Version](https://img.shields.io/badge/version-1.0.0-blue?style=for-the-badge)
![License](https://img.shields.io/badge/license-Proprietary-red?style=for-the-badge)

## 📖 Sobre o Projeto

**MozCommerce** é o maior marketplace digital 100% moçambicano, conectando compradores e vendedores em todo o país. Uma plataforma moderna, segura e escalável, preparada para processar milhões de transações.

### ✨ Características Principais

- ✅ **100% Moçambicano** - Feito em Moçambique, para Moçambique
- ✅ **Pagamentos Locais** - M-Pesa, E-Mola, M-Kesh integrados
- ✅ **Seguro** - Sistema de escrow e antifraude
- ✅ **WhatsApp** - Integração total para comunicação
- ✅ **Escalável** - Preparado para milhões de usuários
- ✅ **Grátis** - Sem taxas mensais, apenas comissão por venda

## 📦 Arquivos do Projeto

```
mozcommerce/
├── index.html              ⭐ Página principal (RENOMEADO!)
├── suporte.html            🆕 Central de ajuda e suporte
├── seller-dashboard.html   📊 Dashboard do vendedor
├── styles.css              🎨 Estilos principais
├── dashboard.css           🎨 Estilos do dashboard
├── supabase-config.js      🔧 Configuração do Supabase + SQL
├── auth-service.js         🔐 Sistema de autenticação
├── app.js                  ⚙️ Aplicação principal
├── dashboard.js            ⚙️ Lógica do dashboard
├── contact-config.js       🆕 Configurações de contato
├── README.md               📄 Este arquivo
└── INSTALACAO.md           📖 Guia completo de instalação
```

## 🚀 Início Rápido

### 1. Baixar os Arquivos

```bash
# Clone ou baixe todos os arquivos para uma pasta
cd mozcommerce
```

### 2. Configurar Supabase (5 minutos)

1. Crie conta grátis em https://supabase.com
2. Crie novo projeto
3. Copie o SQL de `supabase-config.js` e execute no SQL Editor
4. Copie suas credenciais (URL + API Key)
5. Cole em `supabase-config.js`:

```javascript
const SUPABASE_URL = 'https://xxxxx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

### 3. Executar Localmente

```bash
# Opção 1: Python
python -m http.server 8000

# Opção 2: Node.js
npx http-server -p 8000

# Opção 3: PHP
php -S localhost:8000
```

Abra: http://localhost:8000

### 4. Deploy Online (GRÁTIS)

**Netlify (Mais Fácil):**
1. Arraste a pasta para https://app.netlify.com/drop
2. Pronto! Seu site está online

**Vercel:**
1. Faça login em https://vercel.com
2. Importe o projeto
3. Deploy automático

## 📞 Informações de Suporte

### 🆕 Central de Ajuda

Acesse: **suporte.html** ou https://mozcommerce.co.mz/suporte

### Contactos Oficiais

| Canal | Informação | Resposta |
|-------|-----------|----------|
| 📱 **WhatsApp** | +258 84 123 4567 | Imediata |
| 📧 **Email** | suporte@mozcommerce.co.mz | 24 horas |
| ☎️ **Telefone** | +258 21 123 456 | Imediata |
| 📍 **Escritório** | Av. Julius Nyerere, 1234, Maputo | - |

### Horário de Atendimento

- **Segunda a Sexta:** 08:00 - 18:00
- **Sábado:** 09:00 - 14:00
- **Domingo:** Fechado
- **WhatsApp:** 24/7 (respostas automáticas fora do horário)

### Links Rápidos

- 🆘 [Central de Ajuda](suporte.html)
- ❓ [FAQ](suporte.html#faq)
- 💬 [WhatsApp Direto](https://wa.me/258841234567)
- 📧 [Email Suporte](mailto:suporte@mozcommerce.co.mz)

## 🎯 Funcionalidades Completas

### Para Compradores

- ✅ Busca avançada de produtos
- ✅ Múltiplos métodos de pagamento
- ✅ Contacto direto com vendedores via WhatsApp
- ✅ Sistema de avaliações
- ✅ Rastreamento de pedidos
- ✅ Carrinho persistente
- ✅ Histórico de compras

### Para Vendedores

- ✅ Dashboard profissional
- ✅ Gestão de produtos (upload múltiplo)
- ✅ Gestão de pedidos
- ✅ Estatísticas em tempo real
- ✅ Relatórios exportáveis
- ✅ Comissão automática (5%)
- ✅ Notificações WhatsApp
- ✅ Planos gratuito e premium

### Para Administradores

- ✅ Dashboard completo
- ✅ Aprovação de vendedores
- ✅ Gestão de disputas
- ✅ Sistema antifraude
- ✅ Controle de comissões
- ✅ Relatórios detalhados
- ✅ Logs de atividade

## 💳 Sistema de Pagamentos

### Métodos Aceitos

| Método | Tipo | Status |
|--------|------|--------|
| M-Pesa | Móvel | ✅ Ativo |
| E-Mola | Móvel | ✅ Ativo |
| M-Kesh | Móvel | ✅ Ativo |
| VISA | Cartão | ✅ Ativo |
| Mastercard | Cartão | ✅ Ativo |

### Como Funciona

1. **Cliente Paga** → Valor retido em escrow
2. **Vendedor Envia** → Produto enviado
3. **Cliente Confirma** → Recebimento verificado
4. **Pagamento Liberado** → Vendedor recebe (- 5% comissão)

### Segurança

- 🔒 Sistema de escrow
- 🛡️ Criptografia end-to-end
- 🚨 Sistema antifraude
- 📊 Monitoramento 24/7
- 💰 Proteção do comprador

## 🗄️ Banco de Dados

### Tabelas (12 no total)

1. **users** - Usuários e perfis
2. **verification_tokens** - Tokens de verificação
3. **categories** - Categorias (8 pré-cadastradas)
4. **products** - Produtos do marketplace
5. **orders** - Pedidos realizados
6. **order_items** - Itens dos pedidos
7. **payments** - Transações e pagamentos
8. **reviews** - Avaliações de produtos
9. **notifications** - Sistema de notificações
10. **fraud_checks** - Verificações antifraude
11. **activity_logs** - Logs de atividades
12. **Políticas RLS** - Segurança habilitada

## 🔐 Sistema de Autenticação

### Recursos

- ✅ Registro de usuários (Comprador/Vendedor/Admin)
- ✅ **Confirmação de email obrigatória** 📧
- ✅ **Recuperação de senha via email** 🔄
- ✅ Reenvio de email de confirmação
- ✅ Verificação KYC para vendedores
- ✅ Sessões seguras e persistentes
- ✅ Validação de senha forte
- ✅ Proteção contra força bruta

### Fluxo de Registro

```
1. Usuário preenche formulário
   ↓
2. Email de confirmação enviado
   ↓
3. Usuário clica no link
   ↓
4. Conta ativada
   ↓
5. Se vendedor: aguarda aprovação admin
   ↓
6. Login liberado!
```

## 🔄 Recuperação de Senha

### Novo Sistema Completo

1. Clique em "Esqueceu a senha?"
2. Digite seu email
3. Receba link por email (expira em 1 hora)
4. Clique no link
5. Defina nova senha
6. Login com nova senha!

**Arquivo:** `auth-service.js` - Método `requestPasswordReset()`

## 📊 Estatísticas em Tempo Real

O dashboard carrega dados reais do Supabase:

- 📦 Total de produtos ativos
- 👥 Total de vendedores
- 🛒 Total de clientes
- 💰 Vendas do mês
- ⭐ Avaliação média
- 📈 Gráficos de performance

## 🎨 Design System

### Cores da Bandeira Moçambicana

```css
--primary: #D84315      /* Vermelho */
--secondary: #FFA726    /* Amarelo/Laranja */
--accent: #FDD835       /* Amarelo brilhante */
--success: #66BB6A      /* Verde */
```

### Tipografia

- **Display:** Outfit (800)
- **Body:** Outfit (400-600)
- **Monospace:** Space Mono (preços)

### Componentes

- Botões responsivos
- Cards com hover effects
- Modais acessíveis
- Forms validados
- Badges de status
- Loading states

## 📱 Responsividade

### Breakpoints

- **Mobile:** < 480px
- **Tablet:** 481px - 768px
- **Desktop:** 769px - 1024px
- **Large:** > 1024px

### Mobile First

✅ Layout fluido  
✅ Touch-friendly (botões ≥ 44px)  
✅ Menu hamburger  
✅ Imagens otimizadas  
✅ Lazy loading  

## 🆕 Novidades da Versão 1.0

### ✨ Principais Atualizações

1. **index.html** - Arquivo principal renomeado ✅
2. **suporte.html** - Central de ajuda completa 🆕
3. **contact-config.js** - Configurações centralizadas 🆕
4. **Confirmação de email** - Sistema completo ✅
5. **Recuperação de senha** - Funcional via email ✅
6. **FAQ interativo** - 10 perguntas frequentes 🆕
7. **Formulário de suporte** - Contato direto 🆕
8. **Informações atualizadas** - Todos os contatos 🆕

## 📚 Documentação

### Arquivos de Documentação

- **README.md** - Este arquivo (visão geral)
- **INSTALACAO.md** - Guia passo a passo completo
- **contact-config.js** - Configurações de contato
- **supabase-config.js** - Schema do banco de dados

### Links Úteis

- [Documentação Supabase](https://supabase.com/docs)
- [Guia de Instalação](INSTALACAO.md)
- [Central de Ajuda](suporte.html)

## 🤝 Como Contribuir

1. Faça um Fork do projeto
2. Crie uma branch (`git checkout -b feature/NovaFuncionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/NovaFuncionalidade`)
5. Abra um Pull Request

## 🐛 Reportar Bugs

Encontrou um bug? Reporte através de:

1. **WhatsApp:** +258 84 123 4567
2. **Email:** suporte@mozcommerce.co.mz
3. **GitHub Issues:** (se aplicável)

## 📋 Roadmap

### Em Desenvolvimento

- [ ] App Mobile (iOS/Android)
- [ ] PWA (Progressive Web App)
- [ ] API REST pública
- [ ] Integração com transportadoras
- [ ] Sistema de cupons/descontos
- [ ] Chat ao vivo
- [ ] Notificações push
- [ ] Multi-idiomas (EN, PT)

### Planejado para 2026

- [ ] Expansão para África Austral
- [ ] Integração com mais bancos
- [ ] Programa de afiliados
- [ ] Marketplace B2B
- [ ] Sistema de leilões
- [ ] Dropshipping integrado

## 💰 Comissões e Planos

### Plano Gratuito

- ✅ Até 50 produtos
- ✅ Comissão: 5% por venda
- ✅ Suporte básico
- ✅ Estatísticas básicas

### Plano Premium (Em Breve)

- ✅ Produtos ilimitados
- ✅ Comissão: 3% por venda
- ✅ Suporte prioritário
- ✅ Estatísticas avançadas
- ✅ Destaque na plataforma
- **Preço:** 2.500 MZN/mês

## 🔧 Tecnologias Utilizadas

### Frontend

- HTML5
- CSS3 (Custom Properties)
- JavaScript ES6+
- Supabase Client Library

### Backend

- Supabase (PostgreSQL)
- Supabase Auth
- Supabase Storage
- Row Level Security (RLS)

### Serviços

- Supabase (Database + Auth)
- SMTP (Email)
- WhatsApp Business API
- Payment Gateways APIs

## 📄 Licença

Este projeto é proprietário e protegido por direitos autorais.  
© 2026 MozCommerce. Todos os direitos reservados.

## 👥 Equipe

- **Desenvolvimento:** Equipe MozCommerce
- **Design:** Equipe MozCommerce
- **Suporte:** Equipe MozCommerce
- **País:** Moçambique 🇲🇿

## 📞 Contacto

### Vendas

- **Email:** vendas@mozcommerce.co.mz
- **WhatsApp:** +258 84 123 4567

### Suporte

- **Email:** suporte@mozcommerce.co.mz
- **WhatsApp:** +258 84 123 4567
- **Telefone:** +258 21 123 456

### Vendedores

- **Email:** vendedores@mozcommerce.co.mz
- **Central do Vendedor:** seller-dashboard.html

### Endereço

```
MozCommerce, Lda.
Av. Julius Nyerere, 1234
Polana, Maputo
Moçambique
```

## 🌟 Agradecimentos

Obrigado por escolher MozCommerce!

Feito com ❤️ em Moçambique 🇲🇿 para Moçambique!

---

**MozCommerce** - O Futuro do Comércio Digital em Moçambique

*Versão 1.0.0 - Fevereiro 2026*
