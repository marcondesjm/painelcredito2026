CREATE TABLE public.whitelisted_ips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address text NOT NULL UNIQUE,
  label text,
  created_at timestamptz DEFAULT now(),
  is_active boolean DEFAULT true
);

ALTER TABLE public.whitelisted_ips ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage whitelisted IPs"
ON public.whitelisted_ips
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can read whitelisted IPs for login check"
ON public.whitelisted_ips
FOR SELECT
TO anon
USING (true);