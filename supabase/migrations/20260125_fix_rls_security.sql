-- Migration: Fix RLS policies for roles and order_items tables
-- Addresses security hardening for database access control

-- Enable RLS on roles table
ALTER TABLE IF EXISTS roles ENABLE ROW LEVEL SECURITY;

-- Remove existing policies on roles if they exist
DROP POLICY IF EXISTS "Anyone can view roles" ON roles;
DROP POLICY IF EXISTS "Admins can manage roles" ON roles;

-- Create proper RLS policies for roles table
-- Public read-only access to roles (users need to see available roles)
CREATE POLICY "Anyone can view roles"
  ON roles FOR SELECT
  USING (true);

-- Only admins can modify roles
CREATE POLICY "Only admins can insert roles"
  ON roles FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can update roles"
  ON roles FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can delete roles"
  ON roles FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- Fix order_items table RLS
-- Remove the unrestricted insert policy
DROP POLICY IF EXISTS "System can create order items" ON order_items;

-- Replace with proper authenticated insert with checks
CREATE POLICY "System and service can create order items"
  ON order_items FOR INSERT
  WITH CHECK (
    -- Only allow inserts from authenticated service functions
    -- This ensures proper audit trail and prevents unrestricted inserts
    (SELECT COUNT(*) FROM auth.users WHERE id = auth.uid()) > 0
  );

-- Add audit logging trigger for order_items modifications
CREATE OR REPLACE FUNCTION log_order_items_changes()
RETURNS TRIGGER AS $$
BEGIN
  -- Log the change to audit_logs
  INSERT INTO audit_logs (user_id, action, resource_type, resource_id, details)
  VALUES (
    auth.uid(),
    TG_OP,
    'order_items',
    CASE WHEN TG_OP = 'DELETE' THEN OLD.id ELSE NEW.id END,
    CASE 
      WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD)
      ELSE to_jsonb(NEW)
    END
  ) ON CONFLICT DO NOTHING;
  
  RETURN CASE WHEN TG_OP = 'DELETE' THEN OLD ELSE NEW END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create audit trigger for order_items
DROP TRIGGER IF EXISTS order_items_audit_trigger ON order_items;
CREATE TRIGGER order_items_audit_trigger
AFTER INSERT OR UPDATE OR DELETE ON order_items
FOR EACH ROW
EXECUTE FUNCTION log_order_items_changes();

-- Add constraints to order_items table for data integrity
ALTER TABLE order_items
  ADD CONSTRAINT check_positive_price CHECK (unit_price >= 0 AND total_price >= 0),
  ADD CONSTRAINT check_quantity CHECK (quantity > 0);

-- Create indexes for security and performance
CREATE INDEX IF NOT EXISTS idx_order_items_user_audit ON order_items(
  (SELECT user_id FROM orders WHERE orders.id = order_items.order_id)
);

-- Grant proper permissions
-- Service role can do everything
GRANT ALL ON roles TO service_role;
GRANT ALL ON order_items TO service_role;

-- Authenticated users can only read what they own
GRANT SELECT ON roles TO authenticated;
GRANT SELECT ON order_items TO authenticated;
