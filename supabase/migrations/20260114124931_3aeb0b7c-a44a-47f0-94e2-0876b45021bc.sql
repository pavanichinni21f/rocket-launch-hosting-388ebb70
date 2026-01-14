-- Fix the email_logs INSERT policy - restrict to service role / admin only
DROP POLICY IF EXISTS "System can insert email logs" ON public.email_logs;

-- Only allow inserts from authenticated users for their own logs or via service role
-- The edge function uses service_role_key which bypasses RLS, so this is safe
CREATE POLICY "Users can insert own email logs" 
ON public.email_logs 
FOR INSERT 
WITH CHECK (
  auth.uid() IS NOT NULL AND (
    user_id = auth.uid() 
    OR has_role(auth.uid(), 'admin'::app_role)
  )
);