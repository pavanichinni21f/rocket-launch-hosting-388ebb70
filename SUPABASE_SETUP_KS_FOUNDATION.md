# Supabase Setup Guide - KS Foundation

## 🎯 Your Supabase Project

**Project URL**: `https://hgxeyfsrlaqwqndymkpp.supabase.co`

---

## 📋 Required Environment Variables

To complete your Supabase setup for KS Foundation, you need to fill in these keys:

```env
# .env.local or .env.production

# Supabase Configuration
VITE_SUPABASE_URL=https://hgxeyfsrlaqwqndymkpp.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key_here
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
SUPABASE_KEY=your_anon_key_here
```

---

## 🔐 How to Get Your API Keys

### Step 1: Login to Supabase Dashboard
1. Go to: **https://app.supabase.com/**
2. Login with your Supabase account
3. Select project: `hgxeyfsrlaqwqndymkpp`

### Step 2: Get Public Key (VITE_SUPABASE_PUBLISHABLE_KEY)
1. Click on **Settings** (⚙️ icon)
2. Go to **API**
3. Under "Project API keys" section, copy the **anon public** key
4. This starts with: `eyJh...`
5. Paste into: `VITE_SUPABASE_PUBLISHABLE_KEY=`

### Step 3: Get Service Role Key (SUPABASE_SERVICE_ROLE_KEY)
1. In the same **Settings > API** page
2. Look for **Service Role** key (marked as "secret")
3. This starts with: `eyJh...` (longer than anon key)
4. Paste into: `SUPABASE_SERVICE_ROLE_KEY=`

### Step 4: Set SUPABASE_ANON_KEY and SUPABASE_KEY
1. Use the same **anon public** key from Step 2
2. Paste into both:
   - `SUPABASE_ANON_KEY=`
   - `SUPABASE_KEY=`

---

## ✅ Verify Your Setup

Once you've added all keys to `.env.local`, test the connection:

```bash
# 1. Copy environment variables
cp .env.example .env.local

# 2. Fill in the Supabase keys (see above)
nano .env.local

# 3. Start development server
npm run dev

# 4. Open http://localhost:5173
# Check browser console (F12) for any errors
```

If you see no errors and the page loads, **Supabase is properly configured!** ✅

---

## 🔄 Supabase Project Configuration

### Database Tables (To Be Created)
Create these tables in Supabase:

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR UNIQUE NOT NULL,
  full_name VARCHAR,
  avatar_url VARCHAR,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Hosting Accounts
CREATE TABLE hosting_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  account_name VARCHAR NOT NULL,
  plan VARCHAR NOT NULL,
  status VARCHAR DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Domains
CREATE TABLE domains (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  domain_name VARCHAR UNIQUE NOT NULL,
  status VARCHAR DEFAULT 'active',
  expires_at DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Payments/Orders
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  amount DECIMAL NOT NULL,
  currency VARCHAR DEFAULT 'INR',
  status VARCHAR DEFAULT 'pending',
  payment_method VARCHAR,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Analytics Events
CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  event_name VARCHAR NOT NULL,
  event_data JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Enable Row Level Security (RLS)

For each table, enable RLS:

```sql
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE hosting_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY "Users can view their own data"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own data"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- Similar policies for other tables
CREATE POLICY "Users can view their own hosting accounts"
  ON hosting_accounts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own domains"
  ON domains FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own orders"
  ON orders FOR SELECT
  USING (auth.uid() = user_id);
```

---

## 🔐 Authentication Setup

### Enable Authentication Providers

1. Go to **Authentication** > **Providers**
2. Enable:
   - ✅ **Email** (default, already enabled)
   - ✅ **Google OAuth** (see below)
   - ✅ **GitHub OAuth** (see below)
   - ✅ **Apple** (optional)

### Google OAuth Configuration

1. Go to **Authentication** > **Providers** > **Google**
2. Fill in:
   - **Client ID**: Your Google OAuth Client ID
   - **Client Secret**: Your Google OAuth Client Secret
3. Click **Save**

Redirect URLs to use in Google Console:
```
http://localhost:5173/auth/callback
https://www.ksfoundation.space/auth/callback
https://hgxeyfsrlaqwqndymkpp.supabase.co/auth/v1/callback?provider=google
```

### GitHub OAuth Configuration

1. Go to **Authentication** > **Providers** > **GitHub**
2. Fill in:
   - **Client ID**: Your GitHub OAuth App ID
   - **Client Secret**: Your GitHub OAuth App Secret
3. Click **Save**

Redirect URLs to use in GitHub:
```
http://localhost:5173/auth/callback
https://www.ksfoundation.space/auth/callback
https://hgxeyfsrlaqwqndymkpp.supabase.co/auth/v1/callback?provider=github
```

---

## 📤 Enable File Storage

For user uploads (profiles, documents, etc.):

1. Go to **Storage**
2. Create bucket: `ks-foundation-uploads`
3. Click **Create new bucket**
4. Set to **Private** (for security)

### Configure CORS for Storage

1. Go to **Settings** > **Storage**
2. Add CORS policy:

```json
[
  {
    "origin": [
      "http://localhost:5173",
      "https://www.ksfoundation.space"
    ],
    "methods": ["GET", "PUT", "POST", "DELETE"],
    "allowedHeaders": ["*"],
    "maxAgeSeconds": 3600
  }
]
```

---

## 🪝 Webhooks & Edge Functions

### Enable Edge Functions

For backend operations (emails, payments, etc.):

1. Go to **Edge Functions**
2. Create new function:

```typescript
// supabase/functions/send-welcome-email/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  const { email, full_name } = await req.json();
  
  // Send welcome email logic here
  
  return new Response(
    JSON.stringify({ success: true }),
    { headers: { "Content-Type": "application/json" } }
  );
});
```

---

## 🧪 Test Your Setup

### 1. Test Database Connection

```bash
# In your app, try this:
import { supabase } from "@/integrations/supabase/client";

// Test query
const { data, error } = await supabase
  .from('users')
  .select('*')
  .limit(1);

if (error) {
  console.error('Database error:', error);
} else {
  console.log('✅ Database connected!', data);
}
```

### 2. Test Authentication

```bash
# Test signup
const { data, error } = await supabase.auth.signUp({
  email: 'test@ksfoundation.space',
  password: 'TestPassword123!',
});

if (error) {
  console.error('Auth error:', error);
} else {
  console.log('✅ User created!', data);
}
```

### 3. Test File Upload

```bash
# Test file upload
const { data, error } = await supabase.storage
  .from('ks-foundation-uploads')
  .upload('test.txt', new File(['test'], 'test.txt'));

if (error) {
  console.error('Upload error:', error);
} else {
  console.log('✅ File uploaded!', data);
}
```

---

## 🔒 Security Best Practices

### ✅ DO
- Keep `SUPABASE_SERVICE_ROLE_KEY` **secret** (never expose in frontend)
- Only use `VITE_SUPABASE_PUBLISHABLE_KEY` in frontend code
- Enable Row Level Security (RLS) on all tables
- Rotate keys regularly
- Use environment variables (never hardcode)

### ❌ DON'T
- Commit `.env.local` to git
- Share API keys in messages
- Use service role key in client-side code
- Expose sensitive data in public functions
- Disable RLS without reason

---

## 📞 Support

- **Supabase Docs**: https://supabase.com/docs
- **Supabase Discord**: https://discord.supabase.com
- **Supabase Status**: https://status.supabase.com

---

## ✨ Quick Commands

```bash
# Install Supabase CLI
npm install -g supabase

# Link to your project
supabase link --project-ref hgxeyfsrlaqwqndymkpp

# Run migrations
supabase db push

# Create migration
supabase migration new create_users_table

# View database in local
supabase start

# Stop local
supabase stop
```

---

**Last Updated**: January 26, 2026  
**Organization**: KS Foundation  
**Domain**: www.ksfoundation.space  
**Supabase Project**: hgxeyfsrlaqwqndymkpp

---
