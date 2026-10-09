ALTER POLICY reviews_select_authenticated ON public.reviews
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);