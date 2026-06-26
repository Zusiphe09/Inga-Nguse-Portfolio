DO $$
DECLARE
  policy_record record;
BEGIN
  FOR policy_record IN
    SELECT policyname
    FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', policy_record.policyname);
  END LOOP;
END $$;

CREATE POLICY "admin-upload"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (auth.email() = 'inganguse09@gmail.com');

CREATE POLICY "public-read"
ON storage.objects
FOR SELECT
TO public
USING (true);