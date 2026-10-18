CREATE TABLE public.enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind text NOT NULL DEFAULT 'enquiry',
  parent_name text NOT NULL,
  phone text NOT NULL,
  email text,
  child_grade text,
  message text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.enquiries TO anon, authenticated;
GRANT ALL ON public.enquiries TO service_role;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit an enquiry" ON public.enquiries FOR INSERT TO anon, authenticated
WITH CHECK (char_length(parent_name) BETWEEN 1 AND 100 AND char_length(phone) BETWEEN 7 AND 20 AND kind IN ('enquiry','visit','guide') AND (message IS NULL OR char_length(message) <= 1000));