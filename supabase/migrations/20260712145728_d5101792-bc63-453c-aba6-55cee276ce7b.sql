-- Fix 1: Restrict profiles SELECT to authenticated users (was public)
DROP POLICY IF EXISTS profiles_select_all ON public.profiles;
CREATE POLICY profiles_select_authenticated
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

-- Fix 2: Restrict reviews SELECT to authenticated users (was public)
DROP POLICY IF EXISTS reviews_select_all ON public.reviews;
CREATE POLICY reviews_select_authenticated
  ON public.reviews FOR SELECT
  TO authenticated
  USING (true);

-- Fix 3: Add owner-scoped UPDATE and DELETE policies for reports
CREATE POLICY reports_update_own
  ON public.reports FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY reports_delete_own
  ON public.reports FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);