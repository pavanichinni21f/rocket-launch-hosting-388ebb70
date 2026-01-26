# Environment Variables Setup Guide

**Generated:** January 26, 2026
**Status:** For Local Development & Production Deployment

---

## ⚠️ IMPORTANT SECURITY NOTICE

These `.env` files contain sensitive information:
- **DO NOT commit to GitHub** ✅ (Already in .gitignore)
- **DO NOT share with untrusted parties**
- **DO NOT log or expose to frontend** (except VITE_ prefixed keys)
- **Use secrets management for production** (Vercel, AWS, etc.)
- **Rotate keys quarterly**

---

## 📁 Environment Files Generated

```
✅ .env.local           ← General development configuration
✅ .env.development     ← Local development with test credentials
✅ .env.production      ← Production deployment template
```

**All files are in `.gitignore` and will NOT be committed.**

---

## 🔑 API Keys Required

### 1. **Stripe** (US/Global Payments)
**Get from:** https://dashboard.stripe.com/apikeys

```
STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_test_...
```

**Test Cards:**
- Success: 4242 4242 4242 4242
- Decline: 4000 0000 0000 0002
- Auth: 4000 0025 0000 3155

---

### 2. **Razorpay** (India Payments)
**Get from:** https://dashboard.razorpay.com/settings/api-keys

```
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...
RAZORPAY_WEBHOOK_SECRET=...
```

**Setup Webhook:** https://dashboard.razorpay.com/app/webhooks

---

### 3. **PayU** (India/Global)
**Get from:** https://admin.payu.in/merchant/credentials

```
PAYU_MERCHANT_KEY=...
PAYU_MERCHANT_SALT=...
PAYU_WEBHOOK_SECRET=...
```

---

### 4. **Cashfree** (India Alternative)
**Get from:** https://dashboard.cashfree.com/merchants/me/settings/integration-keys

```
CASHFREE_APP_ID=...
CASHFREE_SECRET_KEY=...
CASHFREE_WEBHOOK_TOKEN=...
```

---

### 5. **Supabase** (Database & Auth)
**Get from:** https://supabase.com > Project Settings > API

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

---

### 6. **SendGrid** (Email Service)
**Get from:** https://app.sendgrid.com/settings/api_keys

```
SENDGRID_API_KEY=SG....
SENDGRID_FROM_EMAIL=noreply@domain.com
SENDGRID_FROM_NAME=Your Company
```

---

### 7. **OpenAI** (AI Chat)
**Get from:** https://platform.openai.com/account/api-keys

```
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-3.5-turbo
```

---

## 🚀 Setup Instructions

### Step 1: Copy Template Files

```bash
# Files are already created
# Located at:
# - .env.local (general)
# - .env.development (dev only)
# - .env.production (prod only)
```

### Step 2: Update API Keys

Edit `.env.local` with your test keys:

```bash
# Edit with your favorite editor
nano .env.local
# or
code .env.local
```

### Step 3: For Development

```bash
# Start dev server
npm run dev

# The .env.local and .env.development files will be loaded
# Verify with: console.log(import.meta.env)
```

### Step 4: For Production (Vercel)

1. Go to Vercel Dashboard > Project Settings > Environment Variables
2. Add each variable from `.env.production`
3. Set to Production environment
4. Deploy

**Example in Vercel UI:**
```
Key: STRIPE_SECRET_KEY
Value: sk_live_...
Environments: Production
```

### Step 5: For Production (Other Hosting)

```bash
# Docker / Custom Server
export STRIPE_SECRET_KEY=sk_live_...
export RAZORPAY_KEY_ID=rzp_live_...
# ... etc

npm run build
npm start
```

---

## 📋 Checklist

### Development Setup
- [ ] Created `.env.local` with test keys
- [ ] Created `.env.development` for local testing
- [ ] Added test payment method
- [ ] Verified webhook localhost working (ngrok recommended)
- [ ] Tested payment flow locally

### Production Setup
- [ ] Created production API keys on each platform
- [ ] Added keys to Vercel/hosting environment variables
- [ ] Verified HTTPS certificates
- [ ] Configured webhooks on each platform
- [ ] Tested payment flow in production
- [ ] Set up monitoring/alerts

---

## 🔗 Webhook Configuration

### Stripe
```
https://yourdomain.com/api/webhooks/stripe
Events: payment_intent.succeeded, payment_intent.failed, charge.refunded
Secret: STRIPE_WEBHOOK_SECRET
```

### Razorpay
```
https://yourdomain.com/api/webhooks/razorpay
Events: payment.authorized, payment.failed, invoice.paid
Secret: RAZORPAY_WEBHOOK_SECRET
```

### PayU
```
https://yourdomain.com/api/webhooks/payu
Events: payment_success, payment_failed, payment_completed
Secret: PAYU_WEBHOOK_SECRET
```

### Cashfree
```
https://yourdomain.com/api/webhooks/cashfree
Events: order.paid, order.failed
Secret: CASHFREE_WEBHOOK_TOKEN
```

---

## 🧪 Testing Payment Integrations

### Test with Test Keys

```javascript
// stripe.ts - Test mode
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Card will charge successfully
// amount: 4242 (in cents = $42.42)
```

### Test Cards

| Provider | Test Card | Result |
|----------|-----------|--------|
| Stripe | 4242 4242 4242 4242 | Success |
| Razorpay | See documentation | Success |
| PayU | See documentation | Success |
| Cashfree | See documentation | Success |

---

## 🔒 Security Best Practices

### ✅ DO
- [x] Store keys in `.env` files (git-ignored)
- [x] Use service role key only on backend
- [x] Rotate keys quarterly
- [x] Use different keys per environment
- [x] Enable webhook signature verification
- [x] Log transaction IDs (not API keys)
- [x] Monitor rate limits
- [x] Use HTTPS for all API calls

### ❌ DON'T
- [ ] Commit .env files
- [ ] Log API keys
- [ ] Share keys via email/chat
- [ ] Use same key for dev/prod
- [ ] Expose secret keys in frontend
- [ ] Hardcode keys in source code
- [ ] Use weak webhook signatures
- [ ] Ignore SSL/TLS warnings

---

## 📞 Support & Documentation

### Platform Documentation
- [Stripe Docs](https://stripe.com/docs)
- [Razorpay Docs](https://razorpay.com/docs/)
- [PayU Docs](https://www.payumoney.com/business/developers)
- [Cashfree Docs](https://docs.cashfree.com/)
- [Supabase Docs](https://supabase.com/docs)
- [SendGrid Docs](https://docs.sendgrid.com/)
- [OpenAI Docs](https://platform.openai.com/docs)

### Environment Variables Debugging

```bash
# Check loaded env vars
echo $STRIPE_PUBLIC_KEY

# List all env vars
env | grep -E "STRIPE|RAZORPAY|PAYU"

# Frontend (only VITE_ prefixed)
console.log(import.meta.env.VITE_SUPABASE_URL)
```

---

## ⚡ Quick Reference

### Environment Variables by Type

**Frontend Only (Exposed to Browser)**
```
VITE_SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY
VITE_APP_URL
VITE_API_URL
STRIPE_PUBLIC_KEY (publishable key)
```

**Backend Only (Keep Secret)**
```
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
RAZORPAY_KEY_SECRET
PAYU_MERCHANT_SALT
CASHFREE_SECRET_KEY
SENDGRID_API_KEY
OPENAI_API_KEY
SUPABASE_SERVICE_ROLE_KEY
```

---

## 🎯 Next Steps

1. **For Local Development:**
   ```bash
   npm run dev
   # Use .env.local and .env.development
   ```

2. **For Staging/Testing:**
   ```bash
   npm run build
   # Deploy with test API keys
   ```

3. **For Production:**
   ```bash
   npm run build
   # Deploy with production API keys in secrets manager
   vercel deploy --prod
   ```

---

**Status:** ✅ Ready for Configuration
**Last Updated:** January 26, 2026
**Location:** Root directory of project
