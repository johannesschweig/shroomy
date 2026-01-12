import type Shroom from '@/types/Shroom'

export function flattenFungi(fungi: any): Shroom | null {
  if (!fungi) return null

  const sanitizeArray = (input: any) => {
    if (!input) return []
    
    const arr = typeof input === 'string' ? JSON.parse(input) : input

    if (Array.isArray(arr)) {
      return arr.map(item => typeof item === 'string' ? item.replace(/^"|"$/g, '') : item)
    }
    return []
  }

  const attributes = fungi.attributes ? {
    id_123: fungi.attributes?.id_123 ?? null,
    type: JSON.parse(fungi.attributes?.type) ?? null,
    season_from: fungi.attributes?.season_from ?? null,
    season_to: fungi.attributes?.season_to ?? null,
    size_from: fungi.attributes?.size_from ?? null,
    size_to: fungi.attributes?.size_to ?? null,
    gills_color: JSON.parse(fungi.attributes?.gills_color) ?? null,
    gills_attachment: JSON.parse(fungi.attributes?.gills_attachment) ?? null,
    gills_traits: JSON.parse(fungi.attributes?.gills_traits) ?? null,
    stem_color: JSON.parse(fungi.attributes?.stem_color) ?? null,
    stem_traits: JSON.parse(fungi.attributes?.stem_traits) ?? null,
    cap_color: JSON.parse(fungi.attributes?.cap_color) ?? null,
    cap_shape: JSON.parse(fungi.attributes?.cap_shape) ?? null,
    flesh_color: JSON.parse(fungi.attributes?.flesh_color) ?? null,
    flesh_bruising_color: JSON.parse(fungi.attributes?.flesh_bruising_color) ?? null,
    edibility: fungi.attributes?.edibility ?? null,
    toxicity: fungi.attributes?.toxicity ?? null,
    taste: JSON.parse(fungi.attributes?.taste) ?? null,
    smell: JSON.parse(fungi.attributes?.smell) ?? null,
    spore_color: JSON.parse(fungi.attributes?.spore_color) ?? null,
    habitat: JSON.parse(fungi.attributes?.habitat) ?? null,
    traits: JSON.parse(fungi.attributes?.traits) ?? null,
    look_alikes: JSON.parse(fungi.attributes?.look_alikes) ?? null
  } : {}

  return {
    id: fungi.id,
    name: fungi.name,
    preferred_common_name: fungi.preferred_common_name ?? '',
    alternative_common_names: sanitizeArray(fungi.alternative_common_names),
    english_common_name: fungi.english_common_name ?? '',
    ancestry: fungi.ancestry ?? '',
    obs_count_ger: fungi.obs_count_ger ?? 0,
    photos: fungi.photosCollection?.edges?.map((edge: any) => {
      const photo = edge.node
      return {
        id: photo.id,
        url: photo.url,
        attribution: photo.attribution,
        license_code: photo.license_code
      }
    }) ?? [],
    ...attributes
  }
}