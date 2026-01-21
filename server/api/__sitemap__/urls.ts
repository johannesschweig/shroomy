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
  // 1. Define your static season pages
  const seasons = ['spring', 'summer', 'autumn', 'winter'];
  const seasonPages = seasons.map(season => ({
    loc: `/season/${season}`,
    lastmod: new Date().toISOString(),
    changefreq: 'monthly',
    priority: 0.8 // Give these a slightly higher priority than individual mushrooms
  }));

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

    // 2. Map the mushroom data
    const mushroomPages = allShrooms.map((shroom) => {
      const displayName = shroom.preferred_common_name || shroom.name
      return {
        loc: `/mushroom/${shroom.id}-${createSlug(displayName)}`,
        lastmod: new Date().toISOString(),
        changefreq: 'weekly',
        priority: 0.5
      }
    })

    // 3. Combine both arrays
    return [...seasonPages, ...mushroomPages]

  } catch (e) {
    console.error('Sitemap Loop Error:', e)
    return [...seasonPages] // Still return the seasons even if the DB fetch fails
  }
})