-- Flag for the photo pipeline: set by the website when a fungus has no photos
-- or none of its photos have a quality_score yet, cleared by the pipeline once processed.
ALTER TABLE public.fungi
  ADD COLUMN IF NOT EXISTS needs_photo_review boolean NOT NULL DEFAULT false;

-- Partial index so the pipeline's "which fungi are flagged" query stays cheap
-- even as the table grows.
CREATE INDEX IF NOT EXISTS fungi_needs_photo_review_idx
  ON public.fungi (id)
  WHERE needs_photo_review = true;

-- Make PostgREST/pg_graphql pick up the new column immediately.
NOTIFY pgrst, 'reload schema';

-- The website talks to Supabase with the sb_publishable_... key, which authenticates as
-- the `anon` role and is subject to RLS — same as the old anon key, just renamed. It has
-- no business writing to `fungi` in general, but it does need to be able to flag a fungus
-- for the photo pipeline. Rather than handing it broader write access, grant exactly this:
-- flip needs_photo_review from false to true, nothing else, on any row.
ALTER TABLE public.fungi ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon can flag fungi for photo review" ON public.fungi;
CREATE POLICY "anon can flag fungi for photo review"
  ON public.fungi
  FOR UPDATE
  TO anon
  USING (needs_photo_review = false)
  WITH CHECK (needs_photo_review = true);

-- Column-level privilege: even for rows the policy above allows, anon may only ever
-- touch this one column. An UPDATE that also sets any other column is rejected outright,
-- regardless of what the policy would otherwise permit.
REVOKE UPDATE ON public.fungi FROM anon;
GRANT UPDATE (needs_photo_review) ON public.fungi TO anon;
