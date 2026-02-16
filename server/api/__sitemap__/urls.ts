import { defineSitemapEventHandler } from '#imports'
import { supabase } from '~/supabase'

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
  const now = new Date().toISOString()

  // season pages
  const seasons = ['spring', 'summer', 'autumn', 'winter'];
  const seasonPages = seasons.map(season => ({
    loc: `/season/${season}`,
    lastmod: now,
    changefreq: 'monthly',
    priority: 0.8
  }));

  // top edible pages
  const pages = ['all', 'spring', 'summer', 'autumn', 'winter'];
  const topEdiblePages = pages.map(season => ({
    loc: `/top-edible/${season}`,
    lastmod: now,
    changefreq: 'monthly',
    priority: 0.8
  }));

  // regional pages
  const stateCodes = [
    'de-bw', 'de-by', 'de-be', 'de-bb', 'de-hb', 'de-hh', 'de-he', 'de-mv',
    'de-ni', 'de-nw', 'de-rp', 'de-sl', 'de-sn', 'de-st', 'de-sh', 'de-th'
  ]

  const regionPages = stateCodes.map(code => ({
    loc: `/region/${code}`,
    lastmod: now,
    changefreq: 'monthly',
    priority: 0.9
  }))


  const allShrooms = []
  let from = 0
  const step = 1000
  let hasMore = true

  try {
    while (hasMore) {
      const { data, error } = await supabase
        .from('fungi')
        .select('id, name, preferred_common_name')
        .range(from, from + step - 1)
        .order('id', { ascending: true })

      if (error) {
        console.error('Fetch error:', error)
        break
      }

      if (data && data.length > 0) {
        allShrooms.push(...data)
        from += step
        if (data.length < step) hasMore = false
      } else {
        hasMore = false
      }

      if (from > 15000) hasMore = false
    }

    // Mushroom pages
    const mushroomPages = allShrooms.map((shroom) => {
      const displayName = shroom.preferred_common_name || shroom.name
      return {
        loc: `/mushroom/${shroom.id}-${createSlug(displayName)}`,
        lastmod: now,
        changefreq: 'weekly',
        priority: 0.5
      }
    })

    return [
      ...seasonPages,
      ...topEdiblePages,
      ...mushroomPages,
      ...regionPages
    ]

  } catch (e) {
    console.error('Sitemap Loop Error:', e)
    return [...seasonPages, ...topEdiblePages] // Still return the seasons and top edible pages even if the DB fetch fails
  }
})