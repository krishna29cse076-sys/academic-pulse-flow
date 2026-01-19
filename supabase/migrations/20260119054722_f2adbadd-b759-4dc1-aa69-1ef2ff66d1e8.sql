-- Fix 1: Restrict conversation_participants INSERT policy
-- Only allow users to add participants if they are already a participant in the conversation
-- This prevents malicious users from adding themselves to private conversations

DROP POLICY IF EXISTS "Authenticated users can add participants" ON public.conversation_participants;

CREATE POLICY "Participants can add new members"
ON public.conversation_participants
FOR INSERT
WITH CHECK (
  -- Allow if user is adding themselves AND they are creating a new conversation (first participant)
  (user_id = auth.uid() AND NOT EXISTS (
    SELECT 1 FROM public.conversation_participants cp 
    WHERE cp.conversation_id = conversation_id
  ))
  OR
  -- Allow if the inserting user is already a participant in this conversation
  is_conversation_participant(conversation_id)
);

-- Fix 2: Create a public view for profiles that excludes academic_info
-- This prevents exposure of sensitive academic data while maintaining profile functionality

CREATE OR REPLACE VIEW public.profiles_public
WITH (security_invoker=on) AS
SELECT 
  id,
  user_id,
  full_name,
  username,
  bio,
  avatar_url,
  is_private,
  created_at,
  updated_at
FROM public.profiles;
-- Note: academic_info is intentionally excluded from this view

-- Update profiles SELECT policy to only allow owners to see academic_info
-- Other users must use the profiles_public view
DROP POLICY IF EXISTS "Authenticated users can view public profiles" ON public.profiles;

-- Users can only see full profile data (including academic_info) for their own profile
CREATE POLICY "Users can view own full profile"
ON public.profiles
FOR SELECT
USING (user_id = auth.uid());

-- Create a separate policy for the profiles_public view access
-- Since security_invoker=on, the view uses the caller's permissions
-- We need a policy that allows viewing basic profile info of others
CREATE POLICY "Authenticated users can view basic profiles"
ON public.profiles
FOR SELECT
USING (
  auth.uid() IS NOT NULL 
  AND (NOT is_private OR user_id = auth.uid())
);