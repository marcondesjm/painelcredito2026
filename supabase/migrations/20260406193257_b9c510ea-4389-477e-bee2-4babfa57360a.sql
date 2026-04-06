UPDATE homepage_settings 
SET value = jsonb_set(
  jsonb_set(value::jsonb, '{price_original}', '499.90'),
  '{price_current}', '69.90'
),
updated_at = now()
WHERE key = 'hero';