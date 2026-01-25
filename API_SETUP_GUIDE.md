# 🚀 Complete API Keys Setup Guide

This guide provides step-by-step instructions to obtain all necessary API keys for Rocket Launch Hosting platform.

## Table of Contents
1. [Supabase Setup](#supabase-setup)
2. [PayU Payment Gateway](#payu-payment-gateway)
3. [SendGrid Email Service](#sendgrid-email-service)
4. [Vercel Deployment](#vercel-deployment)
5. [Environment Variables](#environment-variables)
6. [Deployment Instructions](#deployment-instructions)

---

## 1. Supabase Setup

### Step 1.1: Create Supabase Account
- Go to **https://supabase.com**
- Click **"Start your project"** or **Sign Up**
- Use your email to create account
- Verify your email

### Step 1.2: Create New Project
1. Log in to **Supabase Dashboard**: https://app.supabase.com
2. Click **"New Project"** (top right)
3. Fill in project details:
   - **Organization**: Select or create new
   - **Project name**: `rocket-launch-hosting`
   - **Database password**: Generate strong password (copy and save!)
   - **Region**: Choose closest to your users (e.g., ap-south-1 for India)
4. Click **"Create new project"**
5. Wait 2-5 minutes for project to initialize

### Step 1.3: Get API Keys
1. Once project is created, go to **Project Settings** (⚙️ icon, bottom left)
2. Click **"API"** in left sidebar
3. You'll see:
   - **Project URL** → Copy this as `SUPABASE_URL`
   - **anon key** → Copy this as `SUPABASE_ANON_KEY` / `VITE_SUPABASE_ANON_KEY`
   - **service_role key** → Copy this as `SUPABASE_SERVICE_ROLE_KEY`

### Step 1.4: Copy Keys to .env File
```bash
# Create .env file from template
cp .env.example .env

# Edit .env and add your keys:
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### Step 1.5: Apply Database Migrations
1. Go to **SQL Editor** in Supabase dashboard
2. Click **"New Query"**
3. Copy and run migrations from:
   - `supabase/migrations/20260125_fix_rls_security.sql`
   - `supabase/migrations/20260125_complete_rls_hardening.sql`
   - `supabase/migrations/20260125_complete_rls_security.sql`
4. Wait for each to complete

### Step 1.6: Configure Authentication
1. Go to **Authentication** → **Providers**
2. Enable **Email** provider:
   - Click **Email**
   - Toggle **Enable Email Auth**
   - Configure:
     - Email confirmations: Enabled
     - Auto confirm: Disabled (for security)
     - Double confirm: Enabled
3. Save changes

---

## 2. PayU Payment Gateway

### Step 2.1: Create PayU Account
- Go to **https://www.payumoney.com/cms** (India)
- Click **"Create Account"** or **"Sign Up"**
- Choose **Merchant Account**
- Fill in business details:
  - Business name
  - Email
  - Phone number
  - Address
- Submit application (takes 1-2 business days)

### Step 2.2: Get PayU Credentials
Once account approved:
1. Log in to **PayU Dashboard**: https://merchant.payumoney.com/
2. Go to **Settings** → **Merchant Credentials**
3. You'll see:
   - **Merchant Key** (also called Merchant ID)
   - **Merchant Salt** (authentication key)
4. For testing: Use **Test Mode Credentials** (shown on same page)

### Step 2.3: Set Test/Production Mode
- **Test Mode**: Use test credentials, payments won't actually charge
- **Production Mode**: Use live credentials, payments will charge

### Step 2.4: Add to .env File
```bash
# For Testing (use test credentials from PayU)
PAYU_MERCHANT_KEY=your_test_merchant_key
PAYU_MERCHANT_SALT=your_test_merchant_salt
VITE_PAYU_MERCHANT_KEY=your_test_merchant_key

# For Production (swap with live credentials later)
# PAYU_MERCHANT_KEY=your_live_merchant_key
# PAYU_MERCHANT_SALT=your_live_merchant_salt
# VITE_PAYU_MERCHANT_KEY=your_live_merchant_key
```

### Step 2.5: Test Payment Gateway
After deployment, test with these credentials:
- PayU provides test card numbers in their docs
- Or use: Card: 5123456789012346, Expiry: 12/25, CVV: 123

---

## 3. SendGrid Email Service

### Step 3.1: Create SendGrid Account
1. Go to **https://sendgrid.com**
2. Click **"Sign Up Free"**
3. Fill in registration:
   - Email address
   - Company name
   - Contact number
4. Verify email
5. Create account

### Step 3.2: Generate API Key
1. Log in to **SendGrid Dashboard**: https://app.sendgrid.com
2. Go to **Settings** → **API Keys** (left sidebar)
3. Click **"Create API Key"**
4. Configure:
   - **API Key Name**: `rocket-launch-hosting`
   - **API Key Permissions**: Select "Full Access" (or custom if preferred)
5. Click **"Create & Copy"**
6. **IMPORTANT**: Copy the key immediately (you won't see it again!)

### Step 3.3: Verify Sender Email
1. Go to **Sender Authentication** (left sidebar)
2. Click **"Verify a Single Sender"**
3. Fill in:
   - From Email: `noreply@yourdomain.com` (or any sender email)
   - From Name: `Rocket Launch Hosting`
   - Reply To: `support@yourdomain.com`
4. Check email and verify link

### Step 3.4: Add to .env File
```bash
SENDGRID_API_KEY=SG.your_sendgrid_api_key_here

# If using custom sender
SENDGRID_FROM_EMAIL=noreply@yourdomain.com
SENDGRID_FROM_NAME=Rocket Launch Hosting
```

### Step 3.5: Create Email Templates (Optional)
In SendGrid:
1. Go to **Marketing** → **Templates** → **Transactional**
2. Create templates for:
   - Order confirmation
   - Payment success
   - Payment failure
   - Account activation
   - Password reset

---

## 4. Vercel Deployment

### Step 4.1: Create Vercel Account
1. Go to **https://vercel.com**
2. Click **"Sign Up"**
3. Choose **"GitHub"** (recommended)
4. Authorize Vercel to access your GitHub
5. Create Vercel account

### Step 4.2: Import GitHub Repository
1. Log in to **Vercel Dashboard**: https://vercel.com/dashboard
2. Click **"Add New Project"**
3. Select **"Import Git Repository"**
4. Search for `rocket-launch-hosting-388ebb70`
5. Click **"Import"**

### Step 4.3: Configure Environment Variables
1. In Vercel dashboard, go to **Settings** → **Environment Variables**
2. Add each variable from your .env file:
   ```
   SUPABASE_URL
   SUPABASE_ANON_KEY
   SUPABASE_SERVICE_ROLE_KEY
   PAYU_MERCHANT_KEY
   PAYU_MERCHANT_SALT
   VITE_PAYU_MERCHANT_KEY
   SENDGRID_API_KEY
   VITE_SUPABASE_URL
   VITE_SUPABASE_ANON_KEY
   ```
3. Click **"Save"**

### Step 4.4: Configure Build Settings
1. Go to **Settings** → **Build & Development Settings**
2. Verify:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
3. Save if any changes

### Step 4.5: Deploy
1. Click **"Deploy"** button at top
2. Wait for deployment to complete (2-5 minutes)
3. Once complete, you'll get URL: `https://rocket-launch-hosting-388ebb70.vercel.app`

---

## 5. Environment Variables

### Required Variables
```env
# Supabase
SUPABASE_URL=https://[project-id].supabase.co
SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Frontend Supabase (same values)
VITE_SUPABASE_URL=https://[project-id].supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...

# PayU
PAYU_MERCHANT_KEY=your_key
PAYU_MERCHANT_SALT=your_salt
VITE_PAYU_MERCHANT_KEY=your_key

# SendGrid
SENDGRID_API_KEY=SG.xxx
```

### Optional Variables
```env
# Email (alternative to SendGrid)
RESEND_API_KEY=re_xxx
RESEND_FROM_EMAIL=noreply@yourdomain.com

# Stripe (backup payment)
STRIPE_PUBLIC_KEY=pk_live_xxx
STRIPE_SECRET_KEY=sk_live_xxx

# Analytics
VITE_GOOGLE_ANALYTICS_ID=G_xxx

# Error tracking
VITE_SENTRY_DSN=https://xxx
```

---

## 6. Deployment Instructions

### Step 6.1: Prepare Local Repository
```bash
# 1. Copy .env.example to .env
cp .env.example .env

# 2. Fill in all API keys in .env file
# EDIT .env WITH YOUR ACTUAL VALUES

# 3. Do NOT commit .env file
# Verify: should be in .gitignore
cat .gitignore | grep ".env"

# 4. Build locally to verify
npm run build
# Should complete without errors
```

### Step 6.2: Push to GitHub
```bash
# 1. Stage changes (excluding .env)
git add -A
git commit -m "feat: add environment variables template and deployment config"

# 2. Push to GitHub
git push origin main
# Vercel will auto-deploy if configured
```

### Step 6.3: Configure Vercel (Already done in Step 4.3)
- Add environment variables in Vercel dashboard
- Verify all 7+ variables are set
- Save and redeploy if needed

### Step 6.4: Configure Custom Domain (Optional)
1. In Vercel dashboard, go to **Settings** → **Domains**
2. Click **"Add Domain"**
3. Enter your custom domain: `yourdomain.com`
4. Follow DNS configuration instructions:
   - Update A record to Vercel IP
   - Update CNAME for www subdomain
5. Wait for DNS to propagate (5-48 hours)

### Step 6.5: Test Deployment
```bash
# 1. Visit your deployment URL
curl https://rocket-launch-hosting-388ebb70.vercel.app

# 2. Test main features:
- [ ] Homepage loads
- [ ] Navigation works
- [ ] Can access all pages
- [ ] No console errors
- [ ] API endpoints respond

# 3. Test payment flow:
- [ ] Add item to cart
- [ ] Go to checkout
- [ ] Payment gateway loads
- [ ] Can complete test payment

# 4. Test email service:
- [ ] Receive order confirmation email
- [ ] Email contains correct info
- [ ] Links work in email
```

---

## Quick Reference Links

### Main Services
| Service | URL | Purpose |
|---------|-----|---------|
| Supabase | https://app.supabase.com | Database & Auth |
| PayU | https://www.payumoney.com | Payments |
| SendGrid | https://app.sendgrid.com | Email |
| Vercel | https://vercel.com/dashboard | Hosting |
| GitHub | https://github.com/pavanichinni21f/rocket-launch-hosting-388ebb70 | Code Repository |

### API Documentation Links
| Service | Documentation |
|---------|---|
| Supabase | https://supabase.com/docs |
| PayU | https://www.payumoney.com/api/ |
| SendGrid | https://sendgrid.com/docs |
| Vercel | https://vercel.com/docs |

---

## Troubleshooting

### Email Not Sending
1. Check SendGrid API key is correct
2. Verify sender email is verified in SendGrid
3. Check email isn't going to spam
4. Review SendGrid logs for errors

### Payment Gateway Not Working
1. Verify PayU credentials are correct
2. Check if using test vs production keys
3. Verify Supabase is accessible
4. Check edge function logs

### Deployment Fails
1. Check build succeeds locally: `npm run build`
2. Verify all environment variables in Vercel
3. Check Vercel deployment logs
4. Ensure .env is NOT committed to git

### Database Connection Issues
1. Verify Supabase URL and keys correct
2. Check Supabase project is active
3. Verify network access allowed
4. Check RLS policies aren't blocking operations

---

## Security Best Practices

✅ **DO:**
- Use different keys for dev/staging/production
- Rotate keys every 90 days
- Store .env file securely (never in git)
- Use strong passwords
- Enable 2FA on all accounts
- Restrict API key permissions

❌ **DON'T:**
- Commit .env to git
- Share keys via email/chat
- Use same key for multiple environments
- Commit node_modules or dist/
- Disable security features for convenience
- Use hardcoded keys in source code

---

## Support & Contacts

- **Supabase Docs**: https://supabase.com/docs/guides/getting-started
- **PayU Support**: support@payumoney.com
- **SendGrid Support**: https://support.sendgrid.com
- **Vercel Support**: https://vercel.com/support
- **GitHub Support**: https://support.github.com

---

**Created**: January 25, 2026
**Status**: Production Ready ✅
**Last Updated**: January 25, 2026
