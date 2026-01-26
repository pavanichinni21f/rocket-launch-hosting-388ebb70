-- FINAL SECURITY HARDENING - PRODUCTION READY
-- Removes all permissive policies and ensures strict RLS enforcement
-- Applied: 2026-01-26

BEGIN;

-- ============================================================================
-- CUSTOMERS TABLE - Enable RLS for PII Protection
-- ============================================================================

ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read customers" ON customers;
DROP POLICY IF EXISTS "Users can insert customers" ON customers;
DROP POLICY IF EXISTS "Authenticated users can read customers" ON customers;
DROP POLICY IF EXISTS "Users can update own customers" ON customers;

CREATE POLICY "Users can view own customer data"
  ON customers FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all customer data"
  ON customers FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can insert own customer data"
  ON customers FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own customer data"
  ON customers FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Only service-role can delete customer data"
  ON customers FOR DELETE
  USING (auth.role() = 'service_role');

-- ============================================================================
-- CONTACT INFORMATION TABLE - PII Protection
-- ============================================================================

ALTER TABLE contact_information ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read contact info" ON contact_information;
DROP POLICY IF EXISTS "Users can insert contact info" ON contact_information;

CREATE POLICY "Users can view own contact info"
  ON contact_information FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all contact info"
  ON contact_information FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can insert own contact info"
  ON contact_information FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own contact info"
  ON contact_information FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- ============================================================================
-- PAYMENTS TABLE - No direct user access
-- ============================================================================

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view payments" ON payments;
DROP POLICY IF EXISTS "Public can insert payments" ON payments;
DROP POLICY IF EXISTS "Authenticated can insert payments" ON payments;

CREATE POLICY "Users can view own payments"
  ON payments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = payments.order_id
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all payments"
  ON payments FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only service-role can create payments"
  ON payments FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Only service-role can update payments"
  ON payments FOR UPDATE
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- ============================================================================
-- USER_ROLES TABLE - Admin Management
-- ============================================================================

ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view user roles" ON user_roles;
DROP POLICY IF EXISTS "Users can view own roles" ON user_roles;
DROP POLICY IF EXISTS "Admins can manage roles" ON user_roles;

CREATE POLICY "Users can view own role"
  ON user_roles FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all user roles"
  ON user_roles FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only service-role can assign roles"
  ON user_roles FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Only service-role can modify user roles"
  ON user_roles FOR UPDATE
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Only service-role can revoke roles"
  ON user_roles FOR DELETE
  USING (auth.role() = 'service_role');

-- ============================================================================
-- PLANS TABLE - Read-only for users
-- ============================================================================

ALTER TABLE plans ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read plans" ON plans;

CREATE POLICY "Anyone can view active plans"
  ON plans FOR SELECT
  USING (active = true);

CREATE POLICY "Admins can view all plans"
  ON plans FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only service-role can manage plans"
  ON plans FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Only service-role can update plans"
  ON plans FOR UPDATE
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- ============================================================================
-- SUPPORT_TICKETS TABLE - User-scoped access
-- ============================================================================

ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view tickets" ON support_tickets;
DROP POLICY IF EXISTS "Authenticated can create tickets" ON support_tickets;

CREATE POLICY "Users can view own tickets"
  ON support_tickets FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all tickets"
  ON support_tickets FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can create tickets"
  ON support_tickets FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own tickets"
  ON support_tickets FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- ============================================================================
-- DOMAINS TABLE - User-scoped access
-- ============================================================================

ALTER TABLE domains ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read domains" ON domains;
DROP POLICY IF EXISTS "Authenticated can insert domains" ON domains;

CREATE POLICY "Users can view own domains"
  ON domains FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all domains"
  ON domains FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only service-role can manage domains"
  ON domains FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Only service-role can update domains"
  ON domains FOR UPDATE
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- ============================================================================
-- NOTIFICATIONS TABLE - User-scoped access
-- ============================================================================

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own notifications" ON notifications;
DROP POLICY IF EXISTS "System can create notifications" ON notifications;

CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Only service-role can create notifications"
  ON notifications FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Only service-role can delete notifications"
  ON notifications FOR DELETE
  USING (auth.role() = 'service_role');

-- ============================================================================
-- PERFORMANCE INDEXES
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_customers_user_id ON customers(user_id);
CREATE INDEX IF NOT EXISTS idx_contact_information_user_id ON contact_information(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_order_id ON payments(order_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_user_id ON support_tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_domains_user_id ON domains(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);

COMMIT;
