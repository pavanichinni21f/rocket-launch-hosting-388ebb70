CREATE POLICY "Users can update own ticket comments" ON public.ticket_comments FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can delete own ticket comments" ON public.ticket_comments FOR DELETE USING (user_id = auth.uid());
CREATE POLICY "Admins can update any ticket comment" ON public.ticket_comments FOR UPDATE USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete any ticket comment" ON public.ticket_comments FOR DELETE USING (public.has_role(auth.uid(), 'admin'));