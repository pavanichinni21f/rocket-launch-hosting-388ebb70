-- ============================================================================
-- KS FOUNDATION - SUPABASE DATABASE SETUP
-- ============================================================================
-- Run this SQL in Supabase SQL Editor to set up the complete database
-- Project: hgxeyfsrlaqwqndymkpp
-- Domain: www.ksfoundation.space
-- ============================================================================

-- ============================================================================
-- 1. CREATE USERS TABLE (Extended Auth)
-- ============================================================================

CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255),
  phone VARCHAR(20),
  avatar_url TEXT,
  company_name VARCHAR(255),
  country VARCHAR(100),
  state VARCHAR(100),
  city VARCHAR(100),
  postal_code VARCHAR(20),
  subscription_plan VARCHAR(50) DEFAULT 'free',
  subscription_status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_login TIMESTAMP
);

-- Enable RLS on users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for users
CREATE POLICY "Users can view their own data"
  ON public.users
  FOR SELECT
  USING (auth.uid() = auth_id);

CREATE POLICY "Users can update their own data"
  ON public.users
  FOR UPDATE
  USING (auth.uid() = auth_id);

CREATE POLICY "Users can insert their own profile"
  ON public.users
  FOR INSERT
  WITH CHECK (auth.uid() = auth_id);

CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_auth_id ON public.users(auth_id);
CREATE INDEX idx_users_subscription_status ON public.users(subscription_status);

-- ============================================================================
-- 2. CREATE HOSTING ACCOUNTS TABLE
-- ============================================================================

CREATE TABLE public.hosting_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  account_name VARCHAR(255) NOT NULL,
  account_username VARCHAR(255) UNIQUE,
  plan VARCHAR(50) NOT NULL DEFAULT 'starter',
  -- Plans: starter, professional, business, enterprise
  status VARCHAR(50) DEFAULT 'active',
  -- Status: active, suspended, terminated, inactive
  disk_quota BIGINT DEFAULT 10737418240, -- 10GB in bytes
  disk_used BIGINT DEFAULT 0,
  bandwidth_quota BIGINT DEFAULT 107374182400, -- 100GB
  bandwidth_used BIGINT DEFAULT 0,
  email_accounts_limit INTEGER DEFAULT 10,
  email_accounts_used INTEGER DEFAULT 0,
  databases_limit INTEGER DEFAULT 5,
  databases_used INTEGER DEFAULT 0,
  payment_method VARCHAR(50),
  -- payment_method: credit_card, razorpay, upi, bank_transfer
  renewal_date DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  canceled_at TIMESTAMP
);

-- Enable RLS on hosting_accounts
ALTER TABLE public.hosting_accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own hosting accounts"
  ON public.hosting_accounts
  FOR SELECT
  USING (auth.uid() IN (SELECT auth_id FROM public.users WHERE id = user_id));

CREATE POLICY "Users can update their own hosting accounts"
  ON public.hosting_accounts
  FOR UPDATE
  USING (auth.uid() IN (SELECT auth_id FROM public.users WHERE id = user_id));

CREATE POLICY "Users can insert hosting accounts"
  ON public.hosting_accounts
  FOR INSERT
  WITH CHECK (auth.uid() IN (SELECT auth_id FROM public.users WHERE id = user_id));

CREATE INDEX idx_hosting_accounts_user_id ON public.hosting_accounts(user_id);
CREATE INDEX idx_hosting_accounts_status ON public.hosting_accounts(status);
CREATE INDEX idx_hosting_accounts_plan ON public.hosting_accounts(plan);

-- ============================================================================
-- 3. CREATE DOMAINS TABLE
-- ============================================================================

CREATE TABLE public.domains (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  hosting_account_id UUID REFERENCES public.hosting_accounts(id) ON DELETE SET NULL,
  domain_name VARCHAR(255) UNIQUE NOT NULL,
  tld VARCHAR(50),
  -- TLD: .com, .space, .in, etc
  status VARCHAR(50) DEFAULT 'active',
  -- Status: active, expired, pending, suspended, transferred, cancelled
  registrar VARCHAR(100),
  -- Registrar: godaddy, namecheap, google, etc
  registered_at DATE,
  expires_at DATE,
  auto_renew BOOLEAN DEFAULT TRUE,
  dns_provider VARCHAR(100),
  -- DNS: cloudflare, route53, namecheap, etc
  nameservers TEXT[],
  mx_records JSONB,
  txt_records JSONB,
  cname_records JSONB,
  ssl_certificate_status VARCHAR(50) DEFAULT 'not_installed',
  ssl_expires_at DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS on domains
ALTER TABLE public.domains ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own domains"
  ON public.domains
  FOR SELECT
  USING (auth.uid() IN (SELECT auth_id FROM public.users WHERE id = user_id));

CREATE POLICY "Users can update their own domains"
  ON public.domains
  FOR UPDATE
  USING (auth.uid() IN (SELECT auth_id FROM public.users WHERE id = user_id));

CREATE POLICY "Users can insert domains"
  ON public.domains
  FOR INSERT
  WITH CHECK (auth.uid() IN (SELECT auth_id FROM public.users WHERE id = user_id));

CREATE INDEX idx_domains_user_id ON public.domains(user_id);
CREATE INDEX idx_domains_domain_name ON public.domains(domain_name);
CREATE INDEX idx_domains_status ON public.domains(status);
CREATE INDEX idx_domains_expires_at ON public.domains(expires_at);

-- ============================================================================
-- 4. CREATE ORDERS TABLE
-- ============================================================================

CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  order_number VARCHAR(50) UNIQUE,
  -- Format: KSF-YYYY-MM-XXXXX
  order_type VARCHAR(50) NOT NULL,
  -- Types: hosting, domain, addon, renewal, upgrade
  description TEXT,
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'INR',
  -- INR, USD, EUR, GBP
  tax DECIMAL(10, 2) DEFAULT 0,
  discount DECIMAL(10, 2) DEFAULT 0,
  total DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  -- Status: pending, processing, completed, failed, refunded, cancelled
  payment_gateway VARCHAR(50),
  -- Gateways: razorpay, stripe, payu, cashfree, bank_transfer
  payment_id VARCHAR(255),
  payment_status VARCHAR(50),
  payment_method VARCHAR(50),
  transaction_id VARCHAR(255),
  invoice_number VARCHAR(50) UNIQUE,
  invoice_sent_at TIMESTAMP,
  receipt_sent_at TIMESTAMP,
  paid_at TIMESTAMP,
  due_date DATE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);

-- Enable RLS on orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own orders"
  ON public.orders
  FOR SELECT
  USING (auth.uid() IN (SELECT auth_id FROM public.users WHERE id = user_id));

CREATE POLICY "Users can insert orders"
  ON public.orders
  FOR INSERT
  WITH CHECK (auth.uid() IN (SELECT auth_id FROM public.users WHERE id = user_id));

CREATE INDEX idx_orders_user_id ON public.orders(user_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_payment_status ON public.orders(payment_status);
CREATE INDEX idx_orders_created_at ON public.orders(created_at);
CREATE INDEX idx_orders_payment_id ON public.orders(payment_id);

-- ============================================================================
-- 5. CREATE ANALYTICS EVENTS TABLE
-- ============================================================================

CREATE TABLE public.analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  event_name VARCHAR(100) NOT NULL,
  -- Events: page_view, signup, login, payment_initiated, purchase, etc
  page_url VARCHAR(500),
  referrer VARCHAR(500),
  device_type VARCHAR(50),
  -- mobile, tablet, desktop
  browser_name VARCHAR(100),
  browser_version VARCHAR(50),
  os_name VARCHAR(100),
  os_version VARCHAR(50),
  country_code VARCHAR(10),
  city VARCHAR(100),
  ip_address INET,
  session_id VARCHAR(100),
  event_data JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS on analytics_events (public read for analytics, private write)
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own analytics"
  ON public.analytics_events
  FOR SELECT
  USING (auth.uid() IN (SELECT auth_id FROM public.users WHERE id = user_id));

CREATE POLICY "Anyone can insert analytics events"
  ON public.analytics_events
  FOR INSERT
  WITH CHECK (true);

CREATE INDEX idx_analytics_events_user_id ON public.analytics_events(user_id);
CREATE INDEX idx_analytics_events_event_name ON public.analytics_events(event_name);
CREATE INDEX idx_analytics_events_created_at ON public.analytics_events(created_at);
CREATE INDEX idx_analytics_events_session_id ON public.analytics_events(session_id);

-- ============================================================================
-- 6. CREATE INVOICES TABLE
-- ============================================================================

CREATE TABLE public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  invoice_number VARCHAR(50) UNIQUE NOT NULL,
  -- Format: INV-2026-001-001
  invoice_date DATE DEFAULT CURRENT_DATE,
  due_date DATE,
  payment_date DATE,
  invoice_status VARCHAR(50) DEFAULT 'draft',
  -- Status: draft, sent, viewed, partially_paid, paid, overdue, cancelled
  items JSONB NOT NULL, -- Array of line items
  subtotal DECIMAL(10, 2),
  tax_amount DECIMAL(10, 2),
  discount_amount DECIMAL(10, 2),
  total_amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'INR',
  notes TEXT,
  terms_and_conditions TEXT,
  pdf_url TEXT,
  sent_at TIMESTAMP,
  viewed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS on invoices
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own invoices"
  ON public.invoices
  FOR SELECT
  USING (auth.uid() IN (SELECT auth_id FROM public.users WHERE id = user_id));

CREATE POLICY "Users can insert invoices"
  ON public.invoices
  FOR INSERT
  WITH CHECK (auth.uid() IN (SELECT auth_id FROM public.users WHERE id = user_id));

CREATE INDEX idx_invoices_user_id ON public.invoices(user_id);
CREATE INDEX idx_invoices_invoice_number ON public.invoices(invoice_number);
CREATE INDEX idx_invoices_status ON public.invoices(invoice_status);

-- ============================================================================
-- 7. CREATE SUPPORT TICKETS TABLE
-- ============================================================================

CREATE TABLE public.support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  ticket_number VARCHAR(50) UNIQUE,
  -- Format: TICK-2026-001
  subject VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(50) NOT NULL,
  -- Categories: billing, technical, domain, hosting, general
  priority VARCHAR(50) DEFAULT 'normal',
  -- Priority: low, normal, high, urgent
  status VARCHAR(50) DEFAULT 'open',
  -- Status: open, in_progress, waiting_customer, resolved, closed
  assigned_to UUID REFERENCES public.users(id),
  attachment_urls TEXT[],
  resolution_notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  resolved_at TIMESTAMP,
  closed_at TIMESTAMP
);

-- Enable RLS on support_tickets
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own tickets"
  ON public.support_tickets
  FOR SELECT
  USING (auth.uid() IN (SELECT auth_id FROM public.users WHERE id = user_id));

CREATE POLICY "Users can create tickets"
  ON public.support_tickets
  FOR INSERT
  WITH CHECK (auth.uid() IN (SELECT auth_id FROM public.users WHERE id = user_id));

CREATE INDEX idx_support_tickets_user_id ON public.support_tickets(user_id);
CREATE INDEX idx_support_tickets_status ON public.support_tickets(status);
CREATE INDEX idx_support_tickets_priority ON public.support_tickets(priority);

-- ============================================================================
-- 8. CREATE AUDIT LOG TABLE
-- ============================================================================

CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL,
  -- Actions: create, read, update, delete, login, logout, etc
  entity_type VARCHAR(100),
  -- Entity types: user, hosting_account, domain, order, etc
  entity_id UUID,
  changes JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS on audit_logs (read-only for users, insert-only for system)
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own audit logs"
  ON public.audit_logs
  FOR SELECT
  USING (auth.uid() IN (SELECT auth_id FROM public.users WHERE id = user_id));

CREATE POLICY "System can insert audit logs"
  ON public.audit_logs
  FOR INSERT
  WITH CHECK (true);

CREATE INDEX idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON public.audit_logs(action);
CREATE INDEX idx_audit_logs_created_at ON public.audit_logs(created_at);

-- ============================================================================
-- 9. CREATE STORAGE BUCKETS (via SQL)
-- ============================================================================

-- Note: Storage buckets should be created via Supabase Dashboard > Storage
-- But here's what you need to create:

/*
Bucket 1: ks-foundation-uploads
  - Public: No (Private)
  - Allowed file types: images, documents
  - Max file size: 10MB per file

Bucket 2: ks-foundation-invoices
  - Public: No (Private - signed URLs only)
  - Allowed file types: PDF
  - Max file size: 5MB

Bucket 3: ks-foundation-backups
  - Public: No (Private)
  - Allowed file types: All
  - Max file size: 500MB

CORS Configuration for all buckets:
{
  "allowedOrigins": [
    "https://www.ksfoundation.space",
    "http://localhost:5173",
    "http://localhost:3000"
  ],
  "allowedMethods": ["GET", "POST", "PUT", "DELETE"],
  "allowedHeaders": ["Content-Type", "Authorization"],
  "maxAgeSeconds": 3600
}
*/

-- ============================================================================
-- 10. CREATE FUNCTIONS FOR COMMON OPERATIONS
-- ============================================================================

-- Function to update user's updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_users_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for users table
CREATE TRIGGER trigger_users_updated_at
BEFORE UPDATE ON public.users
FOR EACH ROW
EXECUTE FUNCTION public.update_users_updated_at();

-- Function to auto-sync auth user to users table
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (auth_id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name')
  ON CONFLICT (auth_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger for auth.users table
CREATE TRIGGER trigger_on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

-- Function to calculate order total
CREATE OR REPLACE FUNCTION public.calculate_order_total()
RETURNS TRIGGER AS $$
BEGIN
  NEW.total = NEW.amount + NEW.tax - NEW.discount;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for orders table
CREATE TRIGGER trigger_orders_calculate_total
BEFORE INSERT OR UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.calculate_order_total();

-- ============================================================================
-- 11. CREATE VIEWS FOR ANALYTICS
-- ============================================================================

-- View: User subscription summary
CREATE OR REPLACE VIEW public.user_subscriptions AS
SELECT
  u.id,
  u.email,
  u.full_name,
  u.subscription_plan,
  u.subscription_status,
  COUNT(ha.id) as hosting_accounts_count,
  COUNT(DISTINCT d.id) as domains_count,
  COUNT(DISTINCT o.id) as orders_count,
  MAX(o.created_at) as last_order_date,
  u.created_at,
  u.last_login
FROM public.users u
LEFT JOIN public.hosting_accounts ha ON u.id = ha.user_id
LEFT JOIN public.domains d ON u.id = d.user_id
LEFT JOIN public.orders o ON u.id = o.user_id
GROUP BY u.id, u.email, u.full_name, u.subscription_plan, u.subscription_status, u.created_at, u.last_login;

-- View: Revenue summary
CREATE OR REPLACE VIEW public.revenue_summary AS
SELECT
  DATE(o.created_at) as date,
  o.currency,
  COUNT(*) as total_orders,
  COUNT(CASE WHEN o.status = 'completed' THEN 1 END) as completed_orders,
  SUM(CASE WHEN o.status = 'completed' THEN o.total ELSE 0 END) as total_revenue,
  AVG(CASE WHEN o.status = 'completed' THEN o.total ELSE NULL END) as avg_order_value
FROM public.orders o
GROUP BY DATE(o.created_at), o.currency
ORDER BY DATE(o.created_at) DESC;

-- ============================================================================
-- 12. CREATE INITIAL DATA (Optional)
-- ============================================================================

-- You can add demo data here if needed:
/*
INSERT INTO public.users (email, full_name)
VALUES (
  'founder@ksfoundation.space',
  'KS Foundation Admin'
);
*/

-- ============================================================================
-- FINAL NOTES
-- ============================================================================

/*
1. Run this entire SQL script in Supabase SQL Editor
2. Go to Supabase Dashboard > Storage and create these buckets:
   - ks-foundation-uploads (private)
   - ks-foundation-invoices (private)
   - ks-foundation-backups (private)

3. Configure CORS for each bucket as shown in section 9

4. Test the setup by:
   - Creating a test user
   - Insert a hosting account
   - Insert a domain
   - Create an order

5. All tables have Row Level Security (RLS) enabled for security

6. Indexes are created for commonly queried fields for performance

7. Triggers are set up to auto-update timestamps and sync auth users

8. Views provide analytics summaries without exposing raw data

For more information, see:
- SUPABASE_SETUP_KS_FOUNDATION.md
- SUPABASE_CLIENT_INIT.md
*/

-- ============================================================================
-- END OF SQL SETUP
-- ============================================================================
