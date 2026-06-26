
CREATE POLICY "Public can view certificate files" ON storage.objects FOR SELECT
  USING (bucket_id = 'certificates');
CREATE POLICY "Admins upload certificate files" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'certificates' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update certificate files" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'certificates' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete certificate files" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'certificates' AND public.has_role(auth.uid(), 'admin'));
