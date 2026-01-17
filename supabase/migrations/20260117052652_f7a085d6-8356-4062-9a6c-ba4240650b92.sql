-- Fix 1: Profiles - Require authentication to view profiles
DROP POLICY IF EXISTS "Anyone can view public profiles" ON public.profiles;
CREATE POLICY "Authenticated users can view public profiles"
  ON public.profiles FOR SELECT
  USING (auth.uid() IS NOT NULL AND (NOT is_private OR user_id = auth.uid()));

-- Fix 2: Posts - Require authentication to view posts
DROP POLICY IF EXISTS "Anyone can view posts" ON public.posts;
CREATE POLICY "Authenticated users can view posts"
  ON public.posts FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Fix 3: Post Comments - Require authentication to view comments
DROP POLICY IF EXISTS "Anyone can view comments" ON public.post_comments;
CREATE POLICY "Authenticated users can view comments"
  ON public.post_comments FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Fix 4: Post Likes - Require authentication to view likes
DROP POLICY IF EXISTS "Anyone can view likes" ON public.post_likes;
CREATE POLICY "Authenticated users can view likes"
  ON public.post_likes FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Fix 5: Assignments - Require authentication to view public assignments
DROP POLICY IF EXISTS "Anyone can view public assignments" ON public.assignments;
CREATE POLICY "Authenticated users can view public assignments"
  ON public.assignments FOR SELECT
  USING (auth.uid() IS NOT NULL AND (is_public OR user_id = auth.uid()));

-- Fix 6: Notes - Require authentication to view public notes (consistency)
DROP POLICY IF EXISTS "Anyone can view public notes" ON public.notes;
CREATE POLICY "Authenticated users can view public notes"
  ON public.notes FOR SELECT
  USING (auth.uid() IS NOT NULL AND (is_public OR user_id = auth.uid()));

-- Fix 7: Input Validation - Add database constraints
-- Posts content length
ALTER TABLE public.posts 
  ADD CONSTRAINT posts_content_length CHECK (length(content) <= 5000);

-- Profiles constraints  
ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_bio_length CHECK (bio IS NULL OR length(bio) <= 500),
  ADD CONSTRAINT profiles_full_name_length CHECK (full_name IS NULL OR length(full_name) <= 100),
  ADD CONSTRAINT profiles_username_format CHECK (username IS NULL OR username ~ '^[a-zA-Z0-9_]{3,30}$');

-- Messages content length
ALTER TABLE public.messages
  ADD CONSTRAINT messages_content_length CHECK (length(content) <= 2000);

-- Post comments content length
ALTER TABLE public.post_comments
  ADD CONSTRAINT post_comments_content_length CHECK (length(content) <= 2000);

-- Notes constraints
ALTER TABLE public.notes
  ADD CONSTRAINT notes_title_length CHECK (length(title) <= 200),
  ADD CONSTRAINT notes_description_length CHECK (description IS NULL OR length(description) <= 1000);

-- Assignments constraints
ALTER TABLE public.assignments
  ADD CONSTRAINT assignments_title_length CHECK (length(title) <= 200),
  ADD CONSTRAINT assignments_description_length CHECK (description IS NULL OR length(description) <= 1000);

-- Study groups constraints
ALTER TABLE public.study_groups
  ADD CONSTRAINT study_groups_name_length CHECK (length(name) <= 100),
  ADD CONSTRAINT study_groups_description_length CHECK (description IS NULL OR length(description) <= 500);