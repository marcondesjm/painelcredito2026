import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { email, user_id, status, failure_reason, user_agent, referer } = await req.json()

    if (!email) {
      return new Response(JSON.stringify({ error: 'Email required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Get client IP from headers
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
               req.headers.get('cf-connecting-ip') ||
               req.headers.get('x-real-ip') ||
               'unknown'

    // Fetch geolocation
    let geo = { city: null, region: null, country: null, isp: null, lat: null, lon: null }
    
    if (ip && ip !== 'unknown' && ip !== '127.0.0.1') {
      try {
        const geoResp = await fetch(
          `http://ip-api.com/json/${ip}?fields=status,country,regionName,city,lat,lon,isp`
        )
        const geoData = await geoResp.json()
        if (geoData.status === 'success') {
          geo = {
            city: geoData.city,
            region: geoData.regionName,
            country: geoData.country,
            isp: geoData.isp,
            lat: geoData.lat,
            lon: geoData.lon,
          }
        }
      } catch (e) {
        console.error('Geo lookup failed:', e)
      }
    }

    // Insert audit log
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    const { error } = await supabase.from('login_audit_log').insert({
      email,
      user_id: user_id || null,
      ip_address: ip,
      city: geo.city,
      region: geo.region,
      country: geo.country,
      isp: geo.isp,
      latitude: geo.lat,
      longitude: geo.lon,
      status: status || 'unknown',
      failure_reason: failure_reason || null,
      user_agent: user_agent || null,
      referer: referer || null,
    })

    if (error) {
      console.error('Insert error:', error)
      return new Response(JSON.stringify({ error: 'Failed to log' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ success: true, ip, geo }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Audit log error:', error)
    return new Response(JSON.stringify({ error: 'Internal error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
