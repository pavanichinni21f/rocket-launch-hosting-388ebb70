# Supabase SQL Setup - Quick Reference

## 🎯 Complete SQL Setup File

File: **SUPABASE_SQL_SETUP.sql** - Copy entire content and run in Supabase SQL Editor

---

## 📋 What's Included

### Tables Created (8 main tables):

1. **users** - User profiles with auth sync
2. **hosting_accounts** - Hosting plans & quotas
3. **domains** - Domain management
4. **orders** - Payment orders & invoices
5. **analytics_events** - User activity tracking
6. **invoices** - Invoice management
7. **support_tickets** - Support ticket system
8. **audit_logs** - Activity audit trail

### Features:
- ✅ Row Level Security (RLS) on all tables
- ✅ Auto-syncing with Supabase Auth
- ✅ Automatic timestamp updates
- ✅ Performance indexes
- ✅ Analytics views
- ✅ Audit trail

---

## 🚀 How to Run

### Step 1: Open Supabase SQL Editor

1. Go to: https://app.supabase.com/
2. Select your project: **hgxeyfsrlaqwqndymkpp**
3. Click **SQL Editor** in left sidebar
4. Click **New Query**

### Step 2: Copy & Paste SQL

1. Open: `SUPABASE_SQL_SETUP.sql` (in your workspace)
2. Copy entire content
3. Paste into Supabase SQL Editor
4. Click **Run** button (or Ctrl+Enter)

### Step 3: Create Storage Buckets

After SQL runs, create these buckets manually:

1. Go to **Storage** tab in Supabase
2. Click **Create a new bucket**
3. Name: `ks-foundation-uploads`
   - Private: ✅ Yes
   - File size limit: 10 MB
   - Click **Create**

4. Repeat for:
   - `ks-foundation-invoices` (5 MB limit)
   - `ks-foundation-backups` (500 MB limit)

### Step 4: Configure CORS

For each bucket:

1. Click bucket name
2. Click **Settings** tab
3. Scroll to **CORS**
4. Add this configuration:

```json
[
  {
    "origin": [
      "https://www.ksfoundation.space",
      "http://localhost:5173",
      "http://localhost:3000"
    ],
    "methods": ["GET", "POST", "PUT", "DELETE"],
    "allowedHeaders": ["Content-Type", "Authorization"],
    "maxAgeSeconds": 3600
  }
]
```

5. Click **Save**

---

## ✅ Verification

After running SQL, verify these tables exist:

```sql
-- Check all tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

Expected output:
```
analytics_events
audit_logs
domains
hosting_accounts
invoices
orders
support_tickets
users
```

---

## 🔐 Security Checklist

After setup, verify:

- [ ] All tables have RLS enabled
- [ ] Users can only see their own data
- [ ] Policies are working:
  ```sql
  -- Check policies
  SELECT * FROM pg_policies WHERE schemaname = 'public';
  ```

- [ ] Indexes are created:
  ```sql
  -- Check indexes
  SELECT * FROM pg_indexes WHERE schemaname = 'public';
  ```

---

## 📊 Test Data (Optional)

After setup, you can add test data:

```sql
-- 1. Get a user ID from auth.users first:
SELECT id FROM auth.users LIMIT 1;

-- 2. Insert test user profile
INSERT INTO public.users (auth_id, email, full_name, phone)
VALUES (
  'YOUR_USER_ID_FROM_ABOVE',
  'test@ksfoundation.space',
  'Test User',
  '+1234567890'
);

-- 3. Insert test hosting account
INSERT INTO public.hosting_accounts (user_id, account_name, plan)
VALUES (
  (SELECT id FROM public.users LIMIT 1),
  'Test Hosting',
  'starter'
);

-- 4. Insert test domain
INSERT INTO public.domains (user_id, domain_name, registrar)
VALUES (
  (SELECT id FROM public.users LIMIT 1),
  'testdomain.space',
  'namecheap'
);

-- 5. Insert test order
INSERT INTO public.orders (user_id, order_type, amount, total)
VALUES (
  (SELECT id FROM public.users LIMIT 1),
  'hosting',
  999.00,
  999.00
);
```

---

## 🔄 Data Relationships

```
auth.users (Supabase Auth)
    ↓
public.users (Your user table)
    ├── hosting_accounts (many accounts per user)
    ├── domains (many domains per user)
    ├── orders (many orders per user)
    ├── invoices (many invoices per user)
    ├── support_tickets (many tickets per user)
    └── analytics_events (many events per user)
```

---

## 📞 Useful Queries

### Get User's Subscription Summary
```sql
SELECT * FROM public.user_subscriptions 
WHERE email = 'your-email@ksfoundation.space';
```

### Get Revenue by Date
```sql
SELECT * FROM public.revenue_summary 
ORDER BY date DESC;
```

### Get User's Recent Orders
```sql
SELECT * FROM public.orders
WHERE user_id = 'USER_ID'
ORDER BY created_at DESC
LIMIT 10;
```

### Get Pending Orders
```sql
SELECT * FROM public.orders
WHERE status = 'pending'
ORDER BY created_at DESC;
```

### Get Failed Payments
```sql
SELECT * FROM public.orders
WHERE payment_status = 'failed'
OR status = 'failed'
ORDER BY created_at DESC;
```

### Get Expired Domains
```sql
SELECT * FROM public.domains
WHERE expires_at < CURRENT_DATE
AND auto_renew = FALSE;
```

### Get Open Support Tickets
```sql
SELECT * FROM public.support_tickets
WHERE status != 'closed'
ORDER BY priority DESC, created_at ASC;
```

---

## 🛠️ Common Maintenance Tasks

### Update User Subscription
```sql
UPDATE public.users
SET subscription_plan = 'professional', 
    subscription_status = 'active'
WHERE email = 'user@ksfoundation.space';
```

### Mark Order as Paid
```sql
UPDATE public.orders
SET status = 'completed', 
    payment_status = 'paid',
    paid_at = NOW()
WHERE id = 'ORDER_ID';
```

### Update Domain Renewal Date
```sql
UPDATE public.domains
SET expires_at = CURRENT_DATE + INTERVAL '1 year'
WHERE id = 'DOMAIN_ID';
```

### Close Support Ticket
```sql
UPDATE public.support_tickets
SET status = 'closed',
    closed_at = NOW()
WHERE id = 'TICKET_ID';
```

---

## 🐛 Troubleshooting

### RLS Errors
**Error:** "new row violates row-level security policy"

**Solution:** Make sure you're logged in and the policy allows the operation:
```sql
-- Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('users', 'orders', 'domains');
```

### Auth Sync Issues
**Error:** User created in auth but no row in users table

**Solution:** Trigger might not have fired. Insert manually:
```sql
INSERT INTO public.users (auth_id, email, full_name)
SELECT id, email, raw_user_meta_data->>'full_name'
FROM auth.users
WHERE id NOT IN (SELECT auth_id FROM public.users WHERE auth_id IS NOT NULL);
```

### Performance Issues
If queries are slow, rebuild indexes:
```sql
REINDEX INDEX CONCURRENTLY idx_users_email;
REINDEX INDEX CONCURRENTLY idx_orders_user_id;
REINDEX INDEX CONCURRENTLY idx_domains_user_id;
```

---

## 📈 Monitoring

### Check Table Sizes
```sql
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### Check Row Counts
```sql
SELECT 
  'users' as table_name, count(*) as rows FROM public.users
UNION ALL
SELECT 'orders', count(*) FROM public.orders
UNION ALL
SELECT 'domains', count(*) FROM public.domains
UNION ALL
SELECT 'hosting_accounts', count(*) FROM public.hosting_accounts
UNION ALL
SELECT 'invoices', count(*) FROM public.invoices
UNION ALL
SELECT 'support_tickets', count(*) FROM public.support_tickets
UNION ALL
SELECT 'analytics_events', count(*) FROM public.analytics_events
UNION ALL
SELECT 'audit_logs', count(*) FROM public.audit_logs;
```

---

## 🎓 Next Steps

1. ✅ Run SUPABASE_SQL_SETUP.sql
2. ✅ Create storage buckets
3. ✅ Configure CORS
4. ✅ Test with sample data
5. ✅ Verify RLS policies work
6. ✅ Set up Edge Functions for webhooks
7. ✅ Configure email notifications

---

**Setup Time:** ~10-15 minutes
**Difficulty:** Easy
**Prerequisites:** Supabase account + project created

---
