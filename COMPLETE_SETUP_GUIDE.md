# Complete Setup Guide - Rocket Launch Hosting

This guide walks you through setting up all required and optional services for the Rocket Launch Hosting platform.

---

## 📋 Quick Reference

| Service | Required | Setup Time | Cost |
|---------|----------|-----------|------|
| Supabase | ✅ Yes | 10 min | Free tier available |
| Razorpay | ✅ Yes | 15 min | No setup cost |
| SendGrid | ✅ Yes | 10 min | Free tier (100/day) |
| Google OAuth | ⭕ Recommended | 15 min | Free |
| Cloudflare | ⭕ Recommended | 15 min | Free tier available |
| Stripe | ⭕ Optional | 15 min | No setup cost |
| OpenAI | ⭕ Optional | 5 min | Pay-as-you-go |

---

## ✅ STEP 1: SUPABASE - Database & Authentication

### 1.1 Create Supabase Project

**Time: 10 minutes**

1. Go to https://supabase.com/dashboard
2. Click **"New Project"**
3. Fill in:
   - **Project Name**: `rocket-launch-prod`
   - **Database Password**: Generate a strong password (save it!)
   - **Region**: Select closest to your users
   - **Pricing**: Free tier is fine for MVP

4. Wait for project setup (2-3 minutes)

### 1.2 Get API Keys

1. Once project is ready, go to **Settings > API**
2. Copy the following:
   ```env
   VITE_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=xxxxxxx
   SUPABASE_ANON_KEY=xxxxxxx
   SUPABASE_SERVICE_ROLE_KEY=xxxxxxx
   ```

### 1.3 Enable Authentication Providers

1. Go to **Authentication > Providers**
2. Enable:
   - ✅ Email (default)
   - ✅ GitHub (see Step 2.2)
   - ✅ Google (see Step 2.1)
   - ✅ Apple (see Step 2.3)

### 1.4 Run Database Migrations

```bash
# Install Supabase CLI
npm install -g supabase

# Link to your project
supabase link --project-ref xxxxx

# Run migrations
supabase db push

# Set secrets for Edge Functions
supabase secrets set RAZORPAY_SECRET_KEY=xxxxx
supabase secrets set PAYU_MERCHANT_SALT=xxxxx
supabase secrets set CASHFREE_SECRET_KEY=xxxxx
supabase secrets set LOVABLE_API_KEY=xxxxx
```

### 1.5 Verify in Dashboard

```bash
# Test connection
npm run dev
# Check if you can access database in application
```

**Status**: ✅ Ready for next step

---

## 🔐 STEP 2: OAUTH PROVIDERS - Social Login

### 2.1 Google OAuth Setup

**Time: 15 minutes**

#### In Google Cloud Console

1. Go to https://console.cloud.google.com/
2. Create **New Project** → Name: `Rocket Launch Hosting`
3. Click on project name
4. Go to **APIs & Services > OAuth consent screen**
5. Select **External** → Click **Create**
6. Fill OAuth consent screen:
   - **App name**: Rocket Launch Hosting
   - **User support email**: your-email@gmail.com
   - **Developer contact**: your-email@gmail.com
   - **Scopes**: Add `email` and `profile`
   - Click **Save and Continue**

7. Go to **Credentials > Create Credentials > OAuth 2.0 Client ID**
8. Select **Web application**
9. Add **Authorized JavaScript origins**:
   ```
   http://localhost:5173
   http://localhost:3000
   https://yourdomain.com
   ```
10. Add **Authorized redirect URIs**:
    ```
    http://localhost:5173/auth/callback
    http://localhost:3000/auth/callback
    https://yourdomain.com/auth/callback
    https://xxxxx.supabase.co/auth/v1/callback?provider=google
    ```
11. Copy **Client ID** and **Client Secret**

#### In Supabase Dashboard

1. Go to **Authentication > Providers > Google**
2. Enable the provider
3. Paste:
   - **Client ID**: (from Google Console)
   - **Client Secret**: (from Google Console)
4. Click **Save**

#### In .env.local

```env
VITE_GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
```

**Test**: Try "Continue with Google" button

---

### 2.2 GitHub OAuth Setup

**Time: 15 minutes**

#### In GitHub Settings

1. Go to https://github.com/settings/developers
2. Click **New OAuth App**
3. Fill form:
   - **Application name**: Rocket Launch Hosting
   - **Homepage URL**: https://yourdomain.com
   - **Authorization callback URL**: https://yourdomain.com/auth/callback/github
   - **Application description**: Hosting control panel

4. Copy **Client ID** and generate **Client Secret**

#### In Supabase Dashboard

1. Go to **Authentication > Providers > GitHub**
2. Enable the provider
3. Paste:
   - **Client ID**: (from GitHub)
   - **Client Secret**: (from GitHub)
4. Click **Save**

#### In .env.local

```env
VITE_GITHUB_CLIENT_ID=your_github_client_id
VITE_GITHUB_CLIENT_SECRET=your_github_client_secret
```

**Test**: Try "Continue with GitHub" button

---

### 2.3 Apple OAuth Setup

**Time: 20 minutes** (Most complex)

#### In Apple Developer Account

1. Go to https://developer.apple.com/account/resources/identifiers/list
2. Register **App ID**:
   - Click **+** next to "Identifiers"
   - Select **App IDs**
   - Fill details:
     - **Description**: Rocket Launch Hosting
     - **Bundle ID**: `com.rocklaunch.hosting`
     - Check **Sign in with Apple**
   - Click **Continue > Register**

3. Create **Service ID**:
   - Click **+** next to "Identifiers"
   - Select **Service IDs**
   - Fill:
     - **Description**: Rocket Launch Service
     - **Identifier**: `com.rocklaunch.hosting.service`
   - Check **Sign in with Apple**
   - Click **Configure**
   - Add **Return URLs**:
     ```
     yourdomain.com
     localhost
     ```

4. Create **Private Key**:
   - Go to **Keys**
   - Click **+**
   - Name: `Rocket Launch Key`
   - Check **Sign in with Apple**
   - Click **Configure**
   - Select App ID and Service ID created above
   - Click **Continue > Register**
   - **Download .p8 file** (save securely!)

#### In Supabase Dashboard

1. Go to **Authentication > Providers > Apple**
2. Enable provider
3. Paste:
   - **Client ID**: `com.rocklaunch.hosting.service` (Service ID)
   - **Team ID**: Your Apple Team ID (from https://developer.apple.com/account/#/membership)
   - **Key ID**: From the key you created
   - **Private Key**: Content of .p8 file
4. Click **Save**

#### In .env.local

```env
VITE_APPLE_CLIENT_ID=com.rocklaunch.hosting.service
VITE_APPLE_TEAM_ID=your_team_id
VITE_APPLE_KEY_ID=your_key_id
```

**Test**: Try "Continue with Apple" button

---

## 💳 STEP 3: PAYMENT GATEWAYS

### 3.1 Razorpay Setup (Primary - India)

**Time: 15 minutes**

#### In Razorpay Dashboard

1. Go to https://dashboard.razorpay.com/app/keys
2. **Create Account** if not exists at https://razorpay.com/
3. Verify your business details (Email verification required)
4. Once verified, go to **Settings > API Keys**
5. Copy:
   - **Key ID**: `rzp_live_xxxxx`
   - **Key Secret**: `xxxxx` (Keep secret!)

#### Enable Webhooks

1. Go to **Settings > Webhooks**
2. Add webhook URL:
   ```
   https://yourdomain.com/api/webhooks/razorpay
   ```
3. Select events:
   - `payment.authorized`
   - `payment.failed`
   - `payment.captured`
   - `refund.created`
4. Copy **Webhook Secret** for verification

#### In .env.local

```env
VITE_RAZORPAY_KEY_ID=rzp_live_xxxxx
RAZORPAY_SECRET_KEY=your_secret_key
RAZORPAY_WEBHOOK_SECRET=webhook_secret
```

#### Test Payment

1. Use Razorpay test card: `4111 1111 1111 1111`
2. Any future date, any CVV
3. OTP: 123456

---

### 3.2 PayU Setup (India Alternative)

**Time: 15 minutes**

#### In PayU Merchant Dashboard

1. Go to https://dashboard.payumoney.com/
2. Create account or login
3. Complete **KYC Verification**
4. Go to **Merchant Settings > Merchant Credentials**
5. Copy:
   - **Merchant Key**: `xxxxx`
   - **Merchant Salt**: `xxxxx`

#### Enable Webhooks

1. Go to **Settings > Webhook Configuration**
2. Add webhook URL:
   ```
   https://yourdomain.com/api/webhooks/payu
   ```
3. Enable all payment events

#### In .env.local

```env
PAYU_MERCHANT_KEY=your_merchant_key
PAYU_MERCHANT_SALT=your_merchant_salt
```

#### Test Payment

PayU provides test cards in their documentation.

---

### 3.3 Cashfree Setup (India Alternative)

**Time: 15 minutes**

#### In Cashfree Dashboard

1. Go to https://dashboard.cashfree.com/
2. Create account or login
3. Go to **Settings > API Keys**
4. Copy:
   - **App ID**: `xxxxx`
   - **Secret Key**: `xxxxx`

#### Enable Webhooks

1. Go to **Settings > Webhooks**
2. Add webhook:
   ```
   https://yourdomain.com/api/webhooks/cashfree
   ```
3. Select all payment events

#### In .env.local

```env
CASHFREE_APP_ID=your_app_id
CASHFREE_SECRET_KEY=your_secret_key
CASHFREE_CLIENT_ID=optional_client_id
CASHFREE_CLIENT_SECRET=optional_client_secret
```

---

### 3.4 Stripe Setup (Global Backup)

**Time: 15 minutes**

#### In Stripe Dashboard

1. Go to https://dashboard.stripe.com/apikeys
2. Create account at https://stripe.com if needed
3. Copy:
   - **Publishable Key**: `pk_live_xxxxx`
   - **Secret Key**: `sk_live_xxxxx` (Keep secret!)

#### Enable Webhooks

1. Go to **Developers > Webhooks**
2. Add endpoint:
   ```
   https://yourdomain.com/api/webhooks/stripe
   ```
3. Select events:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.refunded`

4. Copy **Webhook Secret**: `whsec_xxxxx`

#### In .env.local

```env
VITE_STRIPE_PUBLIC_KEY=pk_live_xxxxx
STRIPE_SECRET_KEY=sk_live_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
```

#### Test Payment

Use Stripe test card: `4242 4242 4242 4242`

---

## 📧 STEP 4: EMAIL SERVICES

### 4.1 SendGrid Setup (Primary)

**Time: 10 minutes**

#### In SendGrid Dashboard

1. Go to https://app.sendgrid.com/settings/api_keys
2. Create account at https://sendgrid.com if needed
3. Click **Create API Key**
4. Name: `Rocket Launch Production`
5. Permissions:
   - ✅ Mail Send
   - ✅ Template Engine Read/Write
   - ✅ Suppression List Read/Write

6. Copy API Key: `SG.xxxxx` (starts with SG.)

#### Verify Sender Email

1. Go to **Settings > Sender Authentication**
2. Click **Verify a Single Sender**
3. Enter: `noreply@yourdomain.com`
4. Click verification link in email

#### Create Email Templates

1. Go to **Marketing > Templates**
2. Create templates for:
   - Welcome email
   - Password reset
   - Payment confirmation
   - Hosting activation
   - Support ticket

#### In .env.local

```env
SENDGRID_API_KEY=SG.xxxxx
EMAIL_FROM_ADDRESS=noreply@yourdomain.com
EMAIL_FROM_NAME=Rocket Launch Hosting
```

#### Test Email

```bash
npm run test:email
```

---

### 4.2 Resend Setup (Alternative)

**Time: 10 minutes**

#### In Resend Dashboard

1. Go to https://resend.com/api-keys
2. Create account at https://resend.com if needed
3. Click **Create API Key**
4. Copy: `re_xxxxx`

#### Verify Domain

1. Go to **Domains**
2. Add your domain
3. Add DNS records provided
4. Wait for verification

#### In .env.local

```env
RESEND_API_KEY=re_xxxxx
RESEND_FROM_EMAIL=noreply@yourdomain.com
```

---

## 📱 STEP 5: SMS SERVICES - Twilio

**Time: 15 minutes**

#### In Twilio Console

1. Go to https://www.twilio.com/console
2. Create account if needed (requires phone verification)
3. Once verified, go to **Account**
4. Copy:
   - **Account SID**: `ACxxxxx`
   - **Auth Token**: `xxxxx`

#### Get Twilio Phone Number

1. Go to **Phone Numbers > Manage Numbers**
2. Buy a number (select country)
3. Copy number: `+1234567890`

#### Enable SMS Capabilities

1. Go to **Messaging > Services**
2. Create service for OTP
3. Add sender phone number
4. Enable SMS in Messaging settings

#### In .env.local

```env
TWILIO_ACCOUNT_SID=ACxxxxx
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890
```

#### Test SMS

```bash
npm run test:sms
```

---

## 🤖 STEP 6: AI SERVICES

### 6.1 Lovable AI Setup

**Time: 5 minutes**

#### In Lovable Dashboard

1. Go to https://lovable.dev/dashboard
2. Create account or login
3. Create new **AI Agent** for customer support
4. Go to **Settings > API Keys**
5. Copy API Key: `lvb_xxxxx`

#### Configure Chatbot

1. In **Agent Settings**:
   - Add system prompt for support
   - Enable web search
   - Set response tone to "Professional but friendly"
2. Test in preview

#### In .env.local

```env
LOVABLE_API_KEY=your_lovable_api_key
```

---

### 6.2 OpenAI Setup (Alternative)

**Time: 5 minutes**

#### In OpenAI Platform

1. Go to https://platform.openai.com/api-keys
2. Create account at https://openai.com if needed
3. Add payment method (pay-as-you-go)
4. Click **Create new secret key**
5. Copy: `sk_xxxxx` (starts with `sk-`)

#### Set Usage Limits

1. Go to **Settings > Billing**
2. Set **Usage limits** to prevent unexpected charges
3. Set soft limit: $20/month

#### In .env.local

```env
OPENAI_API_KEY=sk_xxxxx
```

---

## 📊 STEP 7: ANALYTICS & MONITORING

### 7.1 Google Analytics Setup

**Time: 10 minutes**

#### In Google Analytics

1. Go to https://analytics.google.com/
2. Create **New Property**
3. Fill details:
   - **Property name**: Rocket Launch Hosting
   - **Reporting timezone**: Your timezone
   - **Currency**: USD or INR

4. Create **Web Stream**:
   - **Website URL**: https://yourdomain.com
   - Get **Measurement ID**: `G_xxxxx`

#### Install Tracking

The app already includes Google Analytics tracking in `src/lib/analytics.ts`

#### In .env.local

```env
VITE_GOOGLE_ANALYTICS_ID=G_xxxxx
```

#### Test Tracking

1. Open application
2. Go to Google Analytics > Real time
3. You should see your session

---

### 7.2 Sentry Error Tracking Setup

**Time: 10 minutes**

#### In Sentry Dashboard

1. Go to https://sentry.io/
2. Create account or login
3. Click **Create Project**
4. Select **React** platform
5. Name: `rocket-launch-hosting`
6. Get **DSN**: `https://xxxxx@xxxxx.ingest.sentry.io/xxxxx`

#### Configure Project

1. Go to **Settings > Integrations**
2. Enable:
   - ✅ GitHub integration (to link commits)
   - ✅ Slack integration (for alerts)

3. Go to **Alerts > Rules**
4. Create alert for:
   - Error rate > 1%
   - New issues

#### In .env.local

```env
VITE_SENTRY_DSN=https://xxxxx@xxxxx.ingest.sentry.io/xxxxx
```

#### Test Error Tracking

```bash
# In browser console
throw new Error("Test error");
# Check in Sentry dashboard
```

---

## 🌐 STEP 8: DNS & DOMAIN MANAGEMENT

### 8.1 Cloudflare Setup (Recommended)

**Time: 15 minutes**

#### In Cloudflare Dashboard

1. Go to https://dash.cloudflare.com/
2. Create account at https://cloudflare.com if needed
3. Click **Add site**
4. Enter your domain: `yourdomain.com`
5. Select **Free plan** (sufficient for MVP)
6. Update nameservers at your registrar to Cloudflare's

#### Generate API Token

1. Go to **My Profile > API Tokens**
2. Click **Create Token**
3. Use template: **Edit zone DNS**
4. Permissions:
   - ✅ Zone:DNS:Edit
   - ✅ Zone:Zone:Read
5. Zone Resources: Specific zone → your domain
6. Copy token: `xxxxx`

#### Get Zone ID

1. Go to your domain
2. Copy **Zone ID** from bottom of settings

#### In .env.local

```env
CLOUDFLARE_API_TOKEN=your_api_token
CLOUDFLARE_ZONE_ID=your_zone_id
```

#### Test DNS API

```bash
npm run test:dns
```

---

### 8.2 AWS Route53 Setup (Alternative)

**Time: 20 minutes**

#### In AWS Console

1. Go to https://console.aws.amazon.com/
2. Create account at https://aws.amazon.com if needed
3. Go to **Route53 > Hosted Zones**
4. Create hosted zone for your domain
5. Update nameservers at your registrar

#### Create IAM User for DNS

1. Go to **IAM > Users > Create User**
2. Name: `rocket-launch-dns`
3. Attach policy: `AmazonRoute53FullAccess`
4. Create access key
5. Copy:
   - **Access Key ID**: `AKIAXXXXX`
   - **Secret Access Key**: `xxxxx`

#### In .env.local

```env
AWS_ACCESS_KEY_ID=AKIAXXXXX
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
```

---

## 🖥️ STEP 9: HOSTING & CPANEL

**Time: 30 minutes** (Depends on hosting provider)

### 9.1 Generate cPanel API Token

1. Login to your hosting cPanel
2. Go to **Security > API Tokens** or **Advanced > API Tokens**
3. Click **Generate New Token**
4. Name: `Rocket Launch API`
5. Permissions:
   - ✅ account
   - ✅ email
   - ✅ domains
   - ✅ addons

6. Copy token: `cPanel_xxxxx`

#### In .env.local

```env
CPANEL_API_TOKEN=your_cpanel_api_token
CPANEL_HOST=your-hosting-provider.com
```

#### Test cPanel API

```bash
npm run test:cpanel
```

---

## ☁️ STEP 10: CLOUD STORAGE - AWS S3

**Time: 20 minutes**

#### In AWS Console

1. Go to https://console.aws.amazon.com/s3/
2. Click **Create bucket**
3. Name: `rocket-launch-uploads-prod` (must be globally unique)
4. Region: Closest to users
5. Block public access: ✅ (We'll use CloudFront CDN)

#### Enable CORS

1. Go to bucket > **Permissions > CORS**
2. Add configuration:
   ```json
   [
     {
       "AllowedHeaders": ["*"],
       "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
       "AllowedOrigins": ["https://yourdomain.com"],
       "ExposeHeaders": ["ETag"]
     }
   ]
   ```

#### Create IAM User for S3

1. Go to **IAM > Users > Create User**
2. Name: `rocket-launch-s3`
3. Attach policy: `AmazonS3FullAccess` (or create custom)
4. Create access key
5. Copy keys

#### Create CloudFront Distribution (Optional but Recommended)

1. Go to **CloudFront > Distributions > Create**
2. Origin: Your S3 bucket
3. Create OAI (Origin Access Identity)
4. Copy distribution URL: `d123456.cloudfront.net`

#### In .env.local

```env
AWS_S3_ACCESS_KEY_ID=AKIAXXXXX
AWS_S3_SECRET_ACCESS_KEY=your_secret_key
AWS_S3_BUCKET=rocket-launch-uploads-prod
AWS_S3_REGION=ap-south-1
AWS_CLOUDFRONT_URL=https://d123456.cloudfront.net
```

#### Test S3 Upload

```bash
npm run test:s3
```

---

## ⚙️ STEP 11: APP CONFIGURATION

### 11.1 Environment URLs

Update based on deployment environment:

#### Development (.env.local)
```env
VITE_APP_URL=http://localhost:5173
VITE_API_URL=http://localhost:3000
VITE_SUPABASE_FUNCTIONS_URL=http://localhost:54321/functions/v1
```

#### Staging (.env.staging)
```env
VITE_APP_URL=https://staging.yourdomain.com
VITE_API_URL=https://staging-api.yourdomain.com
VITE_SUPABASE_FUNCTIONS_URL=https://xxxxx.supabase.co/functions/v1
```

#### Production (.env.production)
```env
VITE_APP_URL=https://yourdomain.com
VITE_API_URL=https://api.yourdomain.com
VITE_SUPABASE_FUNCTIONS_URL=https://xxxxx.supabase.co/functions/v1
```

### 11.2 Feature Flags

```env
# Enable/disable features
VITE_ENABLE_PAYMENT=true
VITE_ENABLE_AI_CHAT=true
VITE_ENABLE_AFFILIATE=true
VITE_ENABLE_EMAIL_VERIFICATION=true

# Debug modes
VITE_DEBUG=false
VITE_LOG_LEVEL=info
```

### 11.3 Payment Provider Selection

```env
# Options: razorpay, stripe, payu, cashfree
VITE_PAYMENT_PROVIDER=razorpay
```

---

## ✅ STEP 12: FINAL VERIFICATION CHECKLIST

### Pre-Launch Testing

- [ ] **Supabase**
  - [ ] Database connection working
  - [ ] Auth providers enabled
  - [ ] Test user can register
  - [ ] Test user can login

- [ ] **OAuth**
  - [ ] Google login works
  - [ ] GitHub login works
  - [ ] Apple login works (iOS Safari)

- [ ] **Payment**
  - [ ] Razorpay test payment successful
  - [ ] Webhook received correctly
  - [ ] Test order created in database
  - [ ] Invoice sent via email

- [ ] **Email**
  - [ ] Welcome email received
  - [ ] Password reset email works
  - [ ] Payment receipts delivered
  - [ ] All emails have branding

- [ ] **DNS**
  - [ ] Domain resolves correctly
  - [ ] SSL certificate valid
  - [ ] CNAME records correct

- [ ] **Analytics**
  - [ ] Google Analytics tracking working
  - [ ] Error tracking in Sentry working
  - [ ] Real-time data visible

- [ ] **File Storage**
  - [ ] S3 uploads working
  - [ ] CloudFront CDN serving files
  - [ ] CORS errors resolved

### Pre-Production Deployment

```bash
# Run full test suite
npm run test

# Build for production
npm run build

# Check bundle size
npm run analyze

# Run security audit
npm audit

# Check for secrets in code
npm run check:secrets
```

### Deployment Commands

```bash
# Deploy to Vercel
vercel deploy --prod

# Or deploy manually to your server
npm run build
scp -r dist/* user@server:/var/www/app/

# Verify deployment
curl https://yourdomain.com
```

---

## 🔒 Security Checklist

- [ ] All API keys in environment variables (never in code)
- [ ] `.env.local` in `.gitignore`
- [ ] Webhook secrets verified
- [ ] HTTPS enforced on all domains
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] SQL injection prevention checked
- [ ] XSS protection enabled
- [ ] CSRF tokens validated
- [ ] Secrets rotation scheduled (quarterly)
- [ ] API keys have minimal required permissions
- [ ] Webhook IPs whitelisted where possible

---

## 🚀 Deployment Steps

### Step 1: Prepare Production Environment

```bash
# Create .env.production file
cp .env.example .env.production

# Fill in all production API keys
nano .env.production
```

### Step 2: Build & Test

```bash
# Install dependencies
npm ci

# Run tests
npm run test:ci

# Build production
npm run build

# Check build output
ls -la dist/
```

### Step 3: Deploy

**Option A: Vercel (Recommended)**
```bash
npm i -g vercel
vercel login
vercel --prod
```

**Option B: Docker**
```bash
docker build -t rocket-launch:latest .
docker run -p 3000:3000 rocket-launch:latest
```

**Option C: Traditional Server**
```bash
# SSH into your server
ssh user@server

# Pull latest code
cd /var/www/app
git pull origin main

# Install and build
npm ci
npm run build

# Restart services
sudo systemctl restart app
```

### Step 4: Post-Deployment

```bash
# Verify website is up
curl https://yourdomain.com

# Check SSL certificate
openssl s_client -connect yourdomain.com:443

# Monitor error logs
tail -f /var/log/app/error.log

# Check Sentry for errors
# Check Google Analytics for traffic
```

---

## 🆘 Troubleshooting

### Issue: "Blank screen on landing page"

**Solution:**
```bash
# 1. Clear cache
rm -rf node_modules/.cache

# 2. Reinstall dependencies
npm ci

# 3. Rebuild
npm run build

# 4. Check console errors
npm run dev
# Open browser console (F12) and check for JavaScript errors
```

### Issue: "Payment not working"

```bash
# 1. Check Razorpay credentials
echo $RAZORPAY_SECRET_KEY

# 2. Check webhook endpoint
curl https://yourdomain.com/api/webhooks/razorpay

# 3. Check payment logs in Razorpay dashboard
# 4. Verify webhook secret in .env
```

### Issue: "Emails not sending"

```bash
# 1. Check SendGrid API key
npm run test:email

# 2. Verify from address is authorized
# 3. Check spam folder
# 4. Review SendGrid activity logs
```

### Issue: "Database connection error"

```bash
# 1. Verify Supabase URL and key
echo $VITE_SUPABASE_URL
echo $VITE_SUPABASE_PUBLISHABLE_KEY

# 2. Test connection
npm run test:db

# 3. Check Supabase dashboard for outages
# 4. Verify VPN/firewall isn't blocking connection
```

---

## 📞 Support Resources

| Service | Support URL |
|---------|------------|
| Supabase | https://supabase.com/docs |
| Razorpay | https://razorpay.com/docs |
| SendGrid | https://sendgrid.com/docs |
| Stripe | https://stripe.com/docs |
| Cloudflare | https://developers.cloudflare.com/ |
| AWS | https://docs.aws.amazon.com/ |
| Google OAuth | https://developers.google.com/identity |
| Twilio | https://www.twilio.com/docs |
| OpenAI | https://platform.openai.com/docs |

---

## 📝 Notes

- **First Setup**: Allocate 2-3 hours for complete setup
- **Testing**: Thoroughly test each service before going live
- **Monitoring**: Set up alerts in Sentry and Google Analytics
- **Backups**: Enable automated database backups in Supabase
- **Scaling**: Start with free tiers, upgrade as traffic grows
- **Cost**: MVP monthly cost ~$0-50/month with free tiers

---

**Last Updated**: January 26, 2026

**Maintained By**: GitHub Copilot

---
