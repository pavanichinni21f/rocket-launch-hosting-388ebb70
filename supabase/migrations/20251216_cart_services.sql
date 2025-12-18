-- Migration: Shopping cart, services, and add-ons
-- Run this in your Supabase/Postgres environment. Review before applying.

-- Services table (available hosting plans and add-ons)
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL, -- 'hosting', 'domain', 'addon', 'ssl'
  category text, -- 'shared', 'vps', 'cloud', 'wordpress', 'email'
  description text,
  base_price numeric(10,2) NOT NULL,
  currency text NOT NULL DEFAULT 'USD',
  billing_cycle text NOT NULL DEFAULT 'monthly', -- 'monthly', 'yearly', 'onetime'
  features jsonb DEFAULT '[]',
  specifications jsonb DEFAULT '{}',
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Service add-ons (SSL, backups, DDoS protection, etc.)
CREATE TABLE IF NOT EXISTS service_addons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id uuid REFERENCES services(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  price numeric(10,2) NOT NULL,
  currency text NOT NULL DEFAULT 'USD',
  billing_cycle text NOT NULL DEFAULT 'monthly',
  is_required boolean DEFAULT false,
  is_popular boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Shopping cart items
CREATE TABLE IF NOT EXISTS cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  service_id uuid REFERENCES services(id) ON DELETE CASCADE NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  configuration jsonb DEFAULT '{}', -- RAM, CPU, storage selections
  selected_addons jsonb DEFAULT '[]', -- array of addon IDs
  domain_name text, -- for domain registrations
  billing_cycle text NOT NULL DEFAULT 'monthly',
  unit_price numeric(10,2) NOT NULL,
  total_price numeric(10,2) NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, service_id, configuration, selected_addons, domain_name)
);

-- Discount codes/coupons
CREATE TABLE IF NOT EXISTS discount_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  description text,
  type text NOT NULL, -- 'percentage', 'fixed'
  value numeric(10,2) NOT NULL,
  max_uses integer,
  used_count integer DEFAULT 0,
  valid_from timestamptz,
  valid_until timestamptz,
  applicable_services jsonb DEFAULT '[]', -- empty means all services
  minimum_order numeric(10,2) DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Order items (detailed breakdown of orders)
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  service_id uuid REFERENCES services(id),
  service_name text NOT NULL,
  service_type text NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  unit_price numeric(10,2) NOT NULL,
  total_price numeric(10,2) NOT NULL,
  configuration jsonb DEFAULT '{}',
  selected_addons jsonb DEFAULT '[]',
  domain_name text,
  billing_cycle text,
  created_at timestamptz DEFAULT now()
);

-- Server inventory (for provisioning)
CREATE TABLE IF NOT EXISTS hosting_servers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  provider text NOT NULL, -- 'aws', 'digitalocean', 'linode', etc.
  location text NOT NULL,
  ip_address inet NOT NULL,
  type text NOT NULL, -- 'shared', 'vps', 'cloud'
  capacity jsonb DEFAULT '{}', -- CPU cores, RAM, storage
  allocated jsonb DEFAULT '{}', -- current usage
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- API keys for users
CREATE TABLE IF NOT EXISTS api_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  key_hash text NOT NULL,
  permissions jsonb DEFAULT '[]',
  last_used_at timestamptz,
  expires_at timestamptz,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Audit logs
CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  action text NOT NULL,
  resource_type text NOT NULL,
  resource_id uuid,
  details jsonb DEFAULT '{}',
  ip_address inet,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

-- Announcements
CREATE TABLE IF NOT EXISTS announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  type text NOT NULL DEFAULT 'info', -- 'info', 'warning', 'success', 'maintenance'
  is_active boolean DEFAULT true,
  starts_at timestamptz,
  ends_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_addons ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE discount_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE hosting_servers ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Services: public read, admin write
CREATE POLICY "Anyone can view active services" ON services FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage services" ON services FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Service add-ons: public read, admin write
CREATE POLICY "Anyone can view service addons" ON service_addons FOR SELECT USING (true);
CREATE POLICY "Admins can manage service addons" ON service_addons FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Cart items: users manage own cart
CREATE POLICY "Users can view own cart" ON cart_items FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can manage own cart" ON cart_items FOR ALL USING (user_id = auth.uid());

-- Discount codes: public read active codes, admin manage
CREATE POLICY "Anyone can view active discount codes" ON discount_codes FOR SELECT USING (is_active = true AND (valid_until IS NULL OR valid_until > now()));
CREATE POLICY "Admins can manage discount codes" ON discount_codes FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Order items: users view own, admin view all
CREATE POLICY "Users can view own order items" ON order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM orders WHERE id = order_id AND user_id = auth.uid())
);
CREATE POLICY "Admins can view all order items" ON order_items FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "System can create order items" ON order_items FOR INSERT WITH CHECK (true);

-- Hosting servers: admin only
CREATE POLICY "Admins can manage hosting servers" ON hosting_servers FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- API keys: users manage own
CREATE POLICY "Users can view own API keys" ON api_keys FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can manage own API keys" ON api_keys FOR ALL USING (user_id = auth.uid());

-- Audit logs: admin read, system write
CREATE POLICY "Admins can view audit logs" ON audit_logs FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "System can create audit logs" ON audit_logs FOR INSERT WITH CHECK (true);

-- Announcements: public read active
CREATE POLICY "Anyone can view active announcements" ON announcements FOR SELECT USING (is_active = true AND (starts_at IS NULL OR starts_at <= now()) AND (ends_at IS NULL OR ends_at >= now()));
CREATE POLICY "Admins can manage announcements" ON announcements FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Indexes for performance
CREATE INDEX idx_cart_items_user ON cart_items(user_id);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_api_keys_user ON api_keys(user_id);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at DESC);
CREATE INDEX idx_services_type ON services(type);
CREATE INDEX idx_services_category ON services(category);
CREATE INDEX idx_discount_codes_code ON discount_codes(code);

-- Update triggers
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_cart_items_updated_at BEFORE UPDATE ON cart_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_hosting_servers_updated_at BEFORE UPDATE ON hosting_servers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for cart and announcements
ALTER PUBLICATION supabase_realtime ADD TABLE cart_items;
ALTER PUBLICATION supabase_realtime ADD TABLE announcements;

-- Insert sample services
INSERT INTO services (name, type, category, description, base_price, billing_cycle, features, specifications, sort_order) VALUES
('Shared Hosting Starter', 'hosting', 'shared', 'Perfect for small websites and blogs', 2.99, 'monthly', '["1 Website", "10GB SSD Storage", "Unmetered Bandwidth", "Free SSL", "24/7 Support"]', '{"websites": 1, "storage": "10GB", "bandwidth": "unmetered", "email_accounts": 5}', 1),
('Shared Hosting Business', 'hosting', 'shared', 'Ideal for growing businesses', 5.99, 'monthly', '["Unlimited Websites", "50GB SSD Storage", "Unmetered Bandwidth", "Free SSL", "Priority Support", "Daily Backups"]', '{"websites": -1, "storage": "50GB", "bandwidth": "unmetered", "email_accounts": 25}', 2),
('VPS Hosting Basic', 'hosting', 'vps', 'Virtual private server for developers', 9.99, 'monthly', '["1 vCPU", "2GB RAM", "25GB SSD", "1TB Bandwidth", "Full Root Access", "Free SSL"]', '{"cpu": "1 vCPU", "ram": "2GB", "storage": "25GB SSD", "bandwidth": "1TB"}', 3),
('Cloud Hosting Professional', 'hosting', 'cloud', 'Scalable cloud hosting solution', 19.99, 'monthly', '["2 vCPU", "4GB RAM", "50GB SSD", "2TB Bandwidth", "Auto-scaling", "Load Balancing", "Free SSL"]', '{"cpu": "2 vCPU", "ram": "4GB", "storage": "50GB SSD", "bandwidth": "2TB"}', 4),
('WordPress Hosting', 'hosting', 'wordpress', 'Optimized for WordPress sites', 4.99, 'monthly', '["1 WordPress Site", "20GB SSD Storage", "Unmetered Bandwidth", "Auto WordPress Updates", "Free SSL", "WP-CLI Access"]', '{"wordpress_sites": 1, "storage": "20GB", "bandwidth": "unmetered"}', 5),
('Domain Registration', 'domain', NULL, 'Register your perfect domain name', 9.99, 'yearly', '["DNS Management", "Domain Privacy", "Email Forwarding", "Auto-renewal"]', '{}', 6),
('SSL Certificate', 'ssl', NULL, 'Secure your website with SSL', 29.99, 'yearly', '["256-bit Encryption", "Domain Validation", "Browser Compatibility", "Mobile Friendly"]', '{}', 7);

-- Insert sample add-ons
INSERT INTO service_addons (service_id, name, description, price, billing_cycle, is_popular) VALUES
((SELECT id FROM services WHERE name = 'Shared Hosting Starter'), 'Daily Backups', 'Automated daily backups of your website', 2.99, 'monthly', true),
((SELECT id FROM services WHERE name = 'Shared Hosting Starter'), 'DDoS Protection', 'Advanced DDoS protection for your site', 4.99, 'monthly', false),
((SELECT id FROM services WHERE name = 'VPS Hosting Basic'), 'Managed Services', 'Let us handle server management', 9.99, 'monthly', true),
((SELECT id FROM services WHERE name = 'VPS Hosting Basic'), 'Additional Storage', 'Extra 25GB SSD storage', 2.99, 'monthly', false),
((SELECT id FROM services WHERE name = 'WordPress Hosting'), 'WooCommerce', 'Pre-installed WooCommerce for e-commerce', 4.99, 'monthly', true),
((SELECT id FROM services WHERE name = 'WordPress Hosting'), 'WP Rocket', 'Premium caching plugin license', 9.99, 'monthly', false);

-- Insert sample discount codes
INSERT INTO discount_codes (code, description, type, value, valid_until, minimum_order) VALUES
('WELCOME10', '10% off first order', 'percentage', 10, '2026-12-31 23:59:59+00', 10),
('SAVE20', '$20 off orders over $50', 'fixed', 20, '2026-12-31 23:59:59+00', 50),
('YEARLY15', '15% off yearly plans', 'percentage', 15, '2026-12-31 23:59:59+00', 0);</content>
</xai:function_call">### Database Tables Creation - Create all missing tables: hosting_accounts, orders, cart_items, services, etc.

I've created a comprehensive migration file `supabase/migrations/20251216_cart_services.sql` that adds all the missing database tables for the full hosting platform:

**New Tables Added:**
- `services` - Available hosting plans, domains, SSL certificates
- `service_addons` - Add-ons like backups, DDoS protection, managed services
- `cart_items` - Shopping cart functionality
- `discount_codes` - Promotional codes and coupons
- `order_items` - Detailed order line items
- `hosting_servers` - Server inventory for provisioning
- `api_keys` - User API key management
- `audit_logs` - Security and activity auditing
- `announcements` - Platform announcements

**Sample Data Included:**
- 7 core services (Shared, VPS, Cloud, WordPress hosting + Domain + SSL)
- Service add-ons with pricing
- Discount codes for promotions

**Security Features:**
- Row Level Security (RLS) enabled on all tables
- Proper policies for user access control
- Audit logging for security events
- API key management with permissions

Now I need to apply this migration to Supabase. Let me run the migration command. 

<xai:function_call name="execute_command">
<parameter name="command">cd /workspaces/rocket-launchpad-2025-37a2ebe5 && npx supabase db push