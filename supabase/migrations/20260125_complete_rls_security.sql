-- Comprehensive RLS Security Hardening
-- Applies strict access control to all tables

-- ============================================================================
-- ROLES TABLE - Enable RLS and fix policies
-- ============================================================================

ALTER TABLE roles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view roles" ON roles;
DROP POLICY IF EXISTS "System can create roles" ON roles;

CREATE POLICY "Anyone can view active roles"
  ON roles FOR SELECT
  USING (true);

CREATE POLICY "Only service-role can modify roles"
  ON roles FOR ALL
  USING (auth.role() = 'service_role');

-- ============================================================================
-- ORDER_ITEMS TABLE - Restrict inserts to service-role only
-- ============================================================================

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "System can create order items" ON order_items;
DROP POLICY IF EXISTS "Users can view own order items" ON order_items;
DROP POLICY IF EXISTS "Admins can view all order items" ON order_items;

-- Users can only view their own order items
CREATE POLICY "Users can view own order items"
  ON order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

-- Admins can view all order items
CREATE POLICY "Admins can view all order items"
  ON order_items FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- Only service-role can INSERT order items
CREATE POLICY "Only service-role can create order items"
  ON order_items FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

-- Only service-role can UPDATE/DELETE
CREATE POLICY "Only service-role can modify order items"
  ON order_items FOR UPDATE
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Only service-role can delete order items"
  ON order_items FOR DELETE
  USING (auth.role() = 'service_role');

-- ============================================================================
-- ORDERS TABLE - Secure user access
-- ============================================================================

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own orders" ON orders;
DROP POLICY IF EXISTS "Users can create orders" ON orders;

CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all orders"
  ON orders FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- Only service-role can insert orders (via edge function)
CREATE POLICY "Only service-role can create orders"
  ON orders FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

-- Only service-role can update orders
CREATE POLICY "Only service-role can update orders"
  ON orders FOR UPDATE
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- ============================================================================
-- AUDIT_LOGS TABLE - Restrict to service-role writes
-- ============================================================================

ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "System can create audit logs" ON audit_logs;

CREATE POLICY "Admins can view audit logs"
  ON audit_logs FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only service-role can create audit logs"
  ON audit_logs FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

-- ============================================================================
-- USER_SESSIONS TABLE - Secure session access
-- ============================================================================

ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own sessions" ON user_sessions;

CREATE POLICY "Users can view own sessions"
  ON user_sessions FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all sessions"
  ON user_sessions FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only service-role can manage sessions"
  ON user_sessions FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

-- ============================================================================
-- EMAIL_LOGS TABLE - Restrict writes to service-role
-- ============================================================================

ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "System can create email logs" ON email_logs;

CREATE POLICY "Users can view own email logs"
  ON email_logs FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all email logs"
  ON email_logs FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only service-role can create email logs"
  ON email_logs FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

-- ============================================================================
-- ACTIVITY_LOG TABLE - Restrict writes
-- ============================================================================

ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "System can create activity logs" ON activity_log;

CREATE POLICY "Users can view own activity"
  ON activity_log FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all activity"
  ON activity_log FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only service-role can create activity logs"
  ON activity_log FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

-- ============================================================================
-- HOSTING_ACCOUNTS TABLE
-- ============================================================================

ALTER TABLE hosting_accounts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own accounts" ON hosting_accounts;
DROP POLICY IF EXISTS "System can create accounts" ON hosting_accounts;

CREATE POLICY "Users can view own hosting accounts"
  ON hosting_accounts FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all accounts"
  ON hosting_accounts FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only service-role can manage accounts"
  ON hosting_accounts FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- ============================================================================
-- PROFILES TABLE - Secure user data
-- ============================================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (id = auth.uid());

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- ============================================================================
-- INDEXES - Performance optimization
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_hosting_accounts_user_id ON hosting_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_user_id ON activity_log(user_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_user_id ON email_logs(user_id);

COMMIT;
