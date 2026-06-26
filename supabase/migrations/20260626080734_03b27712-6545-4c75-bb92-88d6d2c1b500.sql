
DROP POLICY IF EXISTS "Admins delete certificate files" ON storage.objects;
DROP POLICY IF EXISTS "Admins update certificate files" ON storage.objects;
DROP POLICY IF EXISTS "Admins upload certificate files" ON storage.objects;
DROP POLICY IF EXISTS "Public can view certificate files" ON storage.objects;
DROP POLICY IF EXISTS "Admin upload" ON storage.objects;
DROP POLICY IF EXISTS "Admin update" ON storage.objects;
DROP POLICY IF EXISTS "Admin delete" ON storage.objects;
DROP POLICY IF EXISTS "Public view" ON storage.objects;

CREATE POLICY "Public view"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'certificates');

CREATE POLICY "Admin upload"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'certificates' AND auth.email() = 'inganguse09@gmail.com');

CREATE POLICY "Admin update"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'certificates' AND auth.email() = 'inganguse09@gmail.com')
WITH CHECK (bucket_id = 'certificates' AND auth.email() = 'inganguse09@gmail.com');

CREATE POLICY "Admin delete"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'certificates' AND auth.email() = 'inganguse09@gmail.com');
