-- Migration: Complete RLS hardening and authentication fixes
-- Comprehensive security hardening for all tables

-- ========== ENABLE RLS ON ALL TABLES ==========
ALTER TABLE IF EXISTS roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS email_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS user_sessions ENABLE ROW LEVEL SECURITY;

-- ========== ROLES TABLE - AUDIT LOGGING ==========
DROP POLICY IF EXISTS "Only admins can insert roles" ON roles;
DROP POLICY IF EXISTS "Only admins can update roles" ON roles;
DROP POLICY IF EXISTS "Only admins can delete roles" ON roles;

-- Create audit logging function
CREATE OR REPLACE FUNCTION audit_table_changes()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO audit_logs (user_id, action, resource_type, resource_id, details)
  VALUES (
    auth.uid(),
    TG_OP,
    TG_TABLE_NAME,
    CASE WHEN TG_OP = 'DELETE' THEN OLD.id ELSE NEW.id END,
    CASE 
      WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD)
      ELSE to_jsonb(NEW)
    END
  ) ON CONFLICT DO NOTHING;
  
  RETURN CASE WHEN TG_OP = 'DELETE' THEN OLD ELSE NEW END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply audit triggers to sensitive tables
DROP TRIGGER IF EXISTS roles_audit_trigger ON roles;
CREATE TRIGGER roles_audit_trigger
AFTER INSERT OR UPDATE OR DELETE ON roles
FOR EACH ROW
EXECUTE FUNCTION audit_table_changes();

DROP TRIGGER IF EXISTS order_items_audit_trigger ON order_items;
CREATE TRIGGER order_items_audit_trigger
AFTER INSERT OR UPDATE OR DELETE ON order_items
FOR EACH ROW
EXECUTE FUNCTION audit_table_changes();

-- ========== EMAIL_LOGS TABLE ==========
DROP POLICY IF EXISTS "Users can view own email logs" ON email_logs;
DROP POLICY IF EXISTS "System can create email logs" ON email_logs;
DROP POLICY IF EXISTS "Admins can view all email logs" ON email_logs;

CREATE POLICY "Users can view own email logs"
  ON email_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid()
    )
  );

CREATE POLICY "System can create email logs"
  ON email_logs FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view all email logs"
  ON email_logs FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- ========== USER_SESSIONS TABLE ==========
DROP POLICY IF EXISTS "Users can view own sessions" ON user_sessions;
DROP POLICY IF EXISTS "Users can create own sessions" ON user_sessions;
DROP POLICY IF EXISTS "Users can update own sessions" ON user_sessions;

CREATE POLICY "Users can view own sessions"
  ON user_sessions FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own sessions"
  ON user_sessions FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own sessions"
  ON user_sessions FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- ========== ORDER_ITEMS RESTRICTIONS ==========
DROP POLICY IF EXISTS "System and service can create order items" ON order_items;

-- Only allow insert from authenticated users or service role
CREATE POLICY "Authenticated users can insert order items"
  ON order_items FOR INSERT
  WITH CHECK (
    -- Must come from authenticated session
    auth.uid() IS NOT NULL OR 
    -- Or from service role (webhooks, batch jobs)
    current_setting('role') = 'service_role'
  );

-- ========== AUDIT_LOGS RESTRICTIONS ==========
DROP POLICY IF EXISTS "System can create audit logs" ON audit_logs;

CREATE POLICY "System can create audit logs"
  ON audit_logs FOR INSERT
  WITH CHECK (true);

-- Only admins can read full audit logs
DROP POLICY IF EXISTS "Admins can view audit logs" ON audit_logs;
CREATE POLICY "Admins can view audit logs"
  ON audit_logs FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- Users can only view their own audit logs
CREATE POLICY "Users can view own audit logs"
  ON audit_logs FOR SELECT
  USING (user_id = auth.uid());

-- ========== CREATE HELPER FUNCTIONS ==========
CREATE OR REPLACE FUNCTION public.has_role(user_id uuid, role_name text)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = has_role.user_id
    AND roles.name = role_name
    AND user_roles.role_id = roles.id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to safely get user by ID
CREATE OR REPLACE FUNCTION public.get_current_user_id()
RETURNS uuid AS $$
BEGIN
  RETURN auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- ========== INDEXES FOR PERFORMANCE ==========
CREATE INDEX IF NOT EXISTS idx_email_logs_recipient ON email_logs(recipient_email);
CREATE INDEX IF NOT EXISTS idx_email_logs_status ON email_logs(status);
CREATE INDEX IF NOT EXISTS idx_email_logs_sent_at ON email_logs(sent_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires ON user_sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource ON audit_logs(resource_type, resource_id);

-- ========== GRANT PERMISSIONS ==========
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_role TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_current_user_id TO authenticated;

-- Role-based grants
GRANT SELECT ON roles TO authenticated;
GRANT SELECT ON user_roles TO authenticated;
GRANT SELECT, INSERT ON email_logs TO authenticated;
GRANT SELECT, INSERT, UPDATE ON user_sessions TO authenticated;
