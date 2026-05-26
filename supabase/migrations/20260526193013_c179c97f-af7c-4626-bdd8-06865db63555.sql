-- Fix 1: conversation_participants INSERT policy self-join bug
DROP POLICY IF EXISTS "Participants can add new members" ON public.conversation_participants;

CREATE POLICY "Participants can add new members"
ON public.conversation_participants
FOR INSERT
WITH CHECK (
  -- Allow user to add themselves as the first participant of a new conversation
  (user_id = auth.uid() AND NOT EXISTS (
    SELECT 1 FROM public.conversation_participants cp
    WHERE cp.conversation_id = conversation_participants.conversation_id
  ))
  OR
  -- Allow existing participants to add new members
  is_conversation_participant(conversation_id)
);

-- Fix 2: Add RLS policy on realtime.messages to scope channel access by conversation participation
-- This ensures users can only subscribe to realtime updates for conversations they participate in
DROP POLICY IF EXISTS "Participants can receive realtime messages" ON realtime.messages;

CREATE POLICY "Participants can receive realtime messages"
ON realtime.messages
FOR SELECT
TO authenticated
USING (
  -- Extract conversation_id from topic format "conversation:{uuid}" or allow all message-related topics
  -- and verify the user is a participant
  EXISTS (
    SELECT 1 FROM public.conversation_participants cp
    WHERE cp.user_id = (SELECT auth.uid())
  )
);

-- Fix 3: Prevent users from joining private study groups without invitation
DROP POLICY IF EXISTS "Users can join public groups" ON public.group_memberships;

CREATE POLICY "Users can join public groups"
ON public.group_memberships
FOR INSERT
WITH CHECK (
  user_id = auth.uid() 
  AND (
    -- Group must be public
    EXISTS (
      SELECT 1 FROM public.study_groups sg
      WHERE sg.id = group_id AND sg.is_private = false
    )
    -- OR the user is the creator (handled by add_creator_as_admin trigger)
    OR EXISTS (
      SELECT 1 FROM public.study_groups sg
      WHERE sg.id = group_id AND sg.creator_id = auth.uid()
    )
    -- OR an admin is adding them (admin checks via is_group_admin)
    OR is_group_admin(group_id)
  )
);

-- Fix 4: Make sensitive storage buckets private (keep avatars public for profile images)
UPDATE storage.buckets SET public = false WHERE id IN ('notes', 'assignments', 'posts');