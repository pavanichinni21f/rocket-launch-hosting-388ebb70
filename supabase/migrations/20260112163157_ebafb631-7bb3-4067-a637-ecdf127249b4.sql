-- Fix: invitations table SELECT policy allowing anyone to view all invitations
-- This is the critical security issue (USING true)
DROP POLICY IF EXISTS "Users can view invitations to their email" ON public.invitations;

-- Create proper policy: users can only see invitations sent to their email
-- Since we can't access auth.users directly, we need to match against the current user's email from profiles
CREATE POLICY "Users can view invitations to their email" 
ON public.invitations 
FOR SELECT 
USING (
  email = (SELECT email FROM public.profiles WHERE id = auth.uid())
  OR EXISTS (
    SELECT 1 FROM public.hosting_accounts 
    WHERE hosting_accounts.id = invitations.hosting_account_id 
    AND hosting_accounts.owner_id = auth.uid()
  )
);

-- Fix: notifications INSERT policy allowing any INSERT (WITH CHECK true)
-- This should only allow system/authenticated inserts with proper user_id
DROP POLICY IF EXISTS "System can create notifications" ON public.notifications;

-- Allow authenticated users to create notifications for themselves or admins for anyone
CREATE POLICY "Users can create own notifications" 
ON public.notifications 
FOR INSERT 
WITH CHECK (
  user_id = auth.uid() 
  OR has_role(auth.uid(), 'admin'::app_role)
);

-- Add explicit auth.uid() IS NOT NULL checks to critical policies for extra security
-- Profiles: ensure only authenticated users can view their profile
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() IS NOT NULL AND auth.uid() = id);

-- Profiles: ensure only authenticated users can update their profile
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() IS NOT NULL AND auth.uid() = id);

-- Profiles: ensure only authenticated users can insert their profile
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = id);

-- Orders: strengthen the select policy
DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
CREATE POLICY "Users can view own orders" 
ON public.orders 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL 
  AND (user_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role))
);

-- Orders: strengthen the insert policy  
DROP POLICY IF EXISTS "Users can create orders" ON public.orders;
CREATE POLICY "Users can create orders" 
ON public.orders 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());

-- Ticket comments: add filtering for internal comments
DROP POLICY IF EXISTS "Users can view ticket comments" ON public.ticket_comments;
CREATE POLICY "Users can view ticket comments" 
ON public.ticket_comments 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL
  AND (
    -- Non-internal comments visible to ticket owner
    (NOT COALESCE(is_internal, false) AND EXISTS (
      SELECT 1 FROM public.support_tickets 
      WHERE support_tickets.id = ticket_comments.ticket_id 
      AND support_tickets.user_id = auth.uid()
    ))
    -- All comments visible to admins
    OR has_role(auth.uid(), 'admin'::app_role)
  )
);

-- User roles: strengthen admin check for viewing
DROP POLICY IF EXISTS "Users can view own role" ON public.user_roles;
CREATE POLICY "Users can view own role" 
ON public.user_roles 
FOR SELECT 
USING (auth.uid() IS NOT NULL AND (user_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role)));

-- User roles: ensure only admins can manage roles (not just has_role check)
DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;
CREATE POLICY "Admins can manage roles" 
ON public.user_roles 
FOR ALL 
USING (auth.uid() IS NOT NULL AND has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (auth.uid() IS NOT NULL AND has_role(auth.uid(), 'admin'::app_role));