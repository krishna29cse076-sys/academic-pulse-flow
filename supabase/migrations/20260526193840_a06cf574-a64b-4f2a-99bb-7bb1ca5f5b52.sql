DROP POLICY IF EXISTS "Avatar images are publicly accessible" ON storage.objects;
CREATE POLICY "Authenticated users can read avatars"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'avatars');