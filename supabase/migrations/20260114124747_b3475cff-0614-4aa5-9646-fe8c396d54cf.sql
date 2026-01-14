-- ========================================
-- PRODUCTION SECURITY FIXES MIGRATION
-- ========================================

-- 1. Create email_logs table for tracking sent emails
CREATE TABLE IF NOT EXISTS public.email_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  recipient_email text NOT NULL,
  template_name text NOT NULL,
  subject text,
  status text DEFAULT 'pending',
  error_message text,
  sent_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on email_logs
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;

-- Users can only view their own email logs
CREATE POLICY "Users can view own email logs" 
ON public.email_logs 
FOR SELECT 
USING (auth.uid() IS NOT NULL AND user_id = auth.uid());

-- System/admins can insert email logs
CREATE POLICY "System can insert email logs" 
ON public.email_logs 
FOR INSERT 
WITH CHECK (true);

-- Admins can view all email logs
CREATE POLICY "Admins can view all email logs" 
ON public.email_logs 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- 2. Fix user_sessions table if exists (secure INSERT policy)
DO $$ 
BEGIN
  -- Check if user_sessions table exists
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'user_sessions') THEN
    -- Drop the insecure policy if it exists
    DROP POLICY IF EXISTS "Users can insert own sessions" ON public.user_sessions;
    
    -- Create secure policy
    CREATE POLICY "Users can insert own sessions" 
    ON public.user_sessions 
    FOR INSERT 
    WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);
    
    -- Fix UPDATE policy too
    DROP POLICY IF EXISTS "Users can update own sessions" ON public.user_sessions;
    CREATE POLICY "Users can update own sessions" 
    ON public.user_sessions 
    FOR UPDATE 
    USING (auth.uid() IS NOT NULL AND auth.uid() = user_id);
  END IF;
END $$;

-- 3. Add index for email_logs queries
CREATE INDEX IF NOT EXISTS idx_email_logs_user_id ON public.email_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_recipient ON public.email_logs(recipient_email);
CREATE INDEX IF NOT EXISTS idx_email_logs_created_at ON public.email_logs(created_at DESC);