import { defineSitemapEventHandler } from '#imports'
import { supabase } from '~/supabase' 
// import { createSlug } from '~/utils/utils'

function createSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export default defineSitemapEventHandler(async () => {
  const allShrooms = []
  let from = 0
  const step = 1000 // Wir holen immer 1000er Pakete
  let hasMore = true

  try {
    while (hasMore) {
      const { data, error } = await supabase
        .from('fungi')
        .select('id, name, preferred_common_name')
        .range(from, from + step - 1) // Holt z.B. 0-999, dann 1000-1999
        .order('id', { ascending: true }) // Wichtig für konsistente Ergebnisse

      if (error) {
        console.error('Fetch error:', error)
        break
      }

      if (data && data.length > 0) {
        allShrooms.push(...data)
        from += step
        // Wenn wir weniger als 'step' zurückbekommen, sind wir am Ende
        if (data.length < step) hasMore = false
      } else {
        hasMore = false
      }

      // Sicherheitsstopp, damit die Schleife nicht endlos läuft (max 15k)
      if (from > 15000) hasMore = false
    }

    return allShrooms.map((shroom) => {
      const displayName = shroom.preferred_common_name || shroom.name
      return {
        loc: `/mushroom/${shroom.id}-${createSlug(displayName)}`,
        lastmod: new Date().toISOString(),
        changefreq: 'weekly'
      }
    })
  } catch (e) {
    console.error('Sitemap Loop Error:', e)
    return []
  }
})