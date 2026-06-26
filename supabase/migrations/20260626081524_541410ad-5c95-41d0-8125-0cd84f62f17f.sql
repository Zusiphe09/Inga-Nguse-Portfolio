DROP POLICY IF EXISTS "Admins manage certificates" ON public.certificates;
DROP POLICY IF EXISTS "Admins delete messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Admins read messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Admins update messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Admins write settings" ON public.site_settings;

CREATE POLICY "Admin email manages certificates"
ON public.certificates
FOR ALL
TO authenticated
USING (auth.email() = 'inganguse09@gmail.com')
WITH CHECK (auth.email() = 'inganguse09@gmail.com');

CREATE POLICY "Admin email reads messages"
ON public.contact_messages
FOR SELECT
TO authenticated
USING (auth.email() = 'inganguse09@gmail.com');

CREATE POLICY "Admin email updates messages"
ON public.contact_messages
FOR UPDATE
TO authenticated
USING (auth.email() = 'inganguse09@gmail.com')
WITH CHECK (auth.email() = 'inganguse09@gmail.com');

CREATE POLICY "Admin email deletes messages"
ON public.contact_messages
FOR DELETE
TO authenticated
USING (auth.email() = 'inganguse09@gmail.com');

CREATE POLICY "Admin email writes settings"
ON public.site_settings
FOR ALL
TO authenticated
USING (auth.email() = 'inganguse09@gmail.com')
WITH CHECK (auth.email() = 'inganguse09@gmail.com');