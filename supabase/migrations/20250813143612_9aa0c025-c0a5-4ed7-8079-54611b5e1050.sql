-- Lock down public read access while preserving public inserts

-- Ensure RLS is enabled (idempotent)
ALTER TABLE public.rsvp_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registry_purchases ENABLE ROW LEVEL SECURITY;

-- Remove public SELECT access from rsvp_submissions
DROP POLICY IF EXISTS "RSVPs are viewable by everyone" ON public.rsvp_submissions;

-- Note: We intentionally do NOT create any SELECT policies on these tables,
-- so no one (anon/authenticated) can read them via the client. Service role bypasses RLS.

-- Preserve existing INSERT policies (already permissive for public). If they didn't exist,
-- uncomment the blocks below to allow public inserts explicitly.
-- CREATE POLICY "Allow public insert RSVPs"
-- ON public.rsvp_submissions
-- FOR INSERT
-- TO anon, authenticated
-- WITH CHECK (true);

-- CREATE POLICY "Allow public insert registry purchases"
-- ON public.registry_purchases
-- FOR INSERT
-- TO anon, authenticated
-- WITH CHECK (true);
