CREATE SCHEMA IF NOT EXISTS private;

-- Recreate helpers in private schema
CREATE OR REPLACE FUNCTION private.is_conversation_participant(conv_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.conversation_participants
    WHERE conversation_id = conv_id AND user_id = auth.uid()
  )
$$;

CREATE OR REPLACE FUNCTION private.is_group_admin(grp_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.group_memberships
    WHERE group_id = grp_id AND user_id = auth.uid() AND role = 'admin'
  )
$$;

CREATE OR REPLACE FUNCTION private.is_group_member(grp_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.group_memberships
    WHERE group_id = grp_id AND user_id = auth.uid()
  )
$$;

REVOKE ALL ON FUNCTION private.is_conversation_participant(uuid) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION private.is_group_admin(uuid) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION private.is_group_member(uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION private.is_conversation_participant(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION private.is_group_admin(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION private.is_group_member(uuid) TO authenticated;
GRANT USAGE ON SCHEMA private TO authenticated, service_role;

-- Recreate RLS policies to use private.* helpers
-- conversation_participants
DROP POLICY IF EXISTS "Participants can add new members" ON public.conversation_participants;
DROP POLICY IF EXISTS "Participants can view participants" ON public.conversation_participants;
CREATE POLICY "Participants can add new members"
ON public.conversation_participants FOR INSERT TO authenticated
WITH CHECK (
  ((user_id = auth.uid()) AND (NOT EXISTS (
    SELECT 1 FROM public.conversation_participants cp
    WHERE cp.conversation_id = conversation_participants.conversation_id
  ))) OR private.is_conversation_participant(conversation_id)
);
CREATE POLICY "Participants can view participants"
ON public.conversation_participants FOR SELECT TO authenticated
USING (private.is_conversation_participant(conversation_id) OR user_id = auth.uid());

-- conversations
DROP POLICY IF EXISTS "Participants can view conversations" ON public.conversations;
CREATE POLICY "Participants can view conversations"
ON public.conversations FOR SELECT TO authenticated
USING (private.is_conversation_participant(id));

-- messages
DROP POLICY IF EXISTS "Participants can send messages" ON public.messages;
DROP POLICY IF EXISTS "Participants can view messages" ON public.messages;
CREATE POLICY "Participants can send messages"
ON public.messages FOR INSERT TO authenticated
WITH CHECK (sender_id = auth.uid() AND private.is_conversation_participant(conversation_id));
CREATE POLICY "Participants can view messages"
ON public.messages FOR SELECT TO authenticated
USING (private.is_conversation_participant(conversation_id));

-- group_memberships
DROP POLICY IF EXISTS "Admins can manage memberships" ON public.group_memberships;
DROP POLICY IF EXISTS "Members can view group memberships" ON public.group_memberships;
DROP POLICY IF EXISTS "Users can join public groups" ON public.group_memberships;
DROP POLICY IF EXISTS "Users can leave groups" ON public.group_memberships;
CREATE POLICY "Admins can manage memberships"
ON public.group_memberships FOR UPDATE TO authenticated
USING (private.is_group_admin(group_id));
CREATE POLICY "Members can view group memberships"
ON public.group_memberships FOR SELECT TO authenticated
USING (private.is_group_member(group_id) OR user_id = auth.uid());
CREATE POLICY "Users can join public groups"
ON public.group_memberships FOR INSERT TO authenticated
WITH CHECK (
  (user_id = auth.uid()) AND (
    EXISTS (SELECT 1 FROM public.study_groups sg WHERE sg.id = group_memberships.group_id AND sg.is_private = false)
    OR EXISTS (SELECT 1 FROM public.study_groups sg WHERE sg.id = group_memberships.group_id AND sg.creator_id = auth.uid())
    OR private.is_group_admin(group_id)
  )
);
CREATE POLICY "Users can leave groups"
ON public.group_memberships FOR DELETE TO authenticated
USING (user_id = auth.uid() OR private.is_group_admin(group_id));

-- study_groups
DROP POLICY IF EXISTS "Anyone can view public groups" ON public.study_groups;
DROP POLICY IF EXISTS "Group admins can update groups" ON public.study_groups;
CREATE POLICY "Anyone can view public groups"
ON public.study_groups FOR SELECT TO authenticated
USING (NOT is_private OR private.is_group_member(id) OR creator_id = auth.uid());
CREATE POLICY "Group admins can update groups"
ON public.study_groups FOR UPDATE TO authenticated
USING (creator_id = auth.uid() OR private.is_group_admin(id));

-- Drop the now-unused public helpers
DROP FUNCTION IF EXISTS public.is_conversation_participant(uuid);
DROP FUNCTION IF EXISTS public.is_group_admin(uuid);
DROP FUNCTION IF EXISTS public.is_group_member(uuid);