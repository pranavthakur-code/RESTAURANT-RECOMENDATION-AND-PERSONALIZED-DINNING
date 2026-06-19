import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

const GATEWAY = 'https://connector-gateway.lovable.dev/google_maps';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
  const GOOGLE_MAPS_API_KEY = Deno.env.get('GOOGLE_MAPS_API_KEY');
  if (!LOVABLE_API_KEY || !GOOGLE_MAPS_API_KEY) {
    return new Response(JSON.stringify({ error: 'maps_not_configured' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const headers = {
    Authorization: `Bearer ${LOVABLE_API_KEY}`,
    'X-Connection-Api-Key': GOOGLE_MAPS_API_KEY,
  } as Record<string, string>;

  try {
    const body = await req.json().catch(() => ({}));
    const action = String(body?.action || '');

    if (action === 'reverse') {
      const lat = Number(body.lat);
      const lng = Number(body.lng);
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
        return new Response(JSON.stringify({ error: 'invalid_coords' }), {
          status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      const r = await fetch(`${GATEWAY}/maps/api/geocode/json?latlng=${lat},${lng}`, { headers });
      const j = await r.json();
      const first = j.results?.[0];
      const formatted = first?.formatted_address || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
      const comp = (type: string) =>
        first?.address_components?.find((c: any) => c.types?.includes(type))?.long_name || '';
      return new Response(JSON.stringify({
        formatted,
        locality: comp('sublocality') || comp('locality'),
        city: comp('locality') || comp('administrative_area_level_2'),
        state: comp('administrative_area_level_1'),
        pincode: comp('postal_code'),
      }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    if (action === 'place_details') {
      const placeId = String(body.placeId || '');
      if (!placeId) {
        return new Response(JSON.stringify({ error: 'missing_place_id' }), {
          status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      const r = await fetch(`${GATEWAY}/places/v1/places/${encodeURIComponent(placeId)}`, {
        headers: { ...headers, 'X-Goog-FieldMask': 'id,displayName,formattedAddress,location' },
      });
      const j = await r.json();
      return new Response(JSON.stringify({
        formatted: j.formattedAddress || j.displayName?.text || '',
        lat: j.location?.latitude,
        lng: j.location?.longitude,
      }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    return new Response(JSON.stringify({ error: 'unknown_action' }), {
      status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String((e as Error).message || e) }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});