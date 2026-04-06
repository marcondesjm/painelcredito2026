CREATE TABLE public.login_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  user_id uuid,
  ip_address text,
  city text,
  region text,
  country text,
  isp text,
  latitude double precision,
  longitude double precision,
  status text NOT NULL DEFAULT 'unknown',
  failure_reason text,
  user_agent text,
  referer text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.login_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all audit logs"
ON public.login_audit_log
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can insert audit logs"
ON public.login_audit_log
FOR INSERT
TO public
WITH CHECK (true);

CREATE INDEX idx_login_audit_email ON public.login_audit_log(email);
CREATE INDEX idx_login_audit_created ON public.login_audit_log(created_at DESC);
CREATE INDEX idx_login_audit_ip ON public.login_audit_log(ip_address);