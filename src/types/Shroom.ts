export default interface Shroom {
  name: {
    de: string[]
    lat: string[]
  }
  url: string
  image: string
  photo_url: string
  taxon_id: number
  taxon_name: string
  season: {
    from: number
    to: number
  }
  size: {
    min_diameter_cm: number
    max_diameter_cm: number
  }
  cap: {
    color: string[]
    shape: string[]
  }
  flesh: {
    color: string[]
    bruising_color: string[] | null
  }
  gills: {
    color: string[]
    attachment: string[] | null
  }
  stem: {
    color: string[]
  },
  smell: string[]
  taste: string[] | null
  spore_color: string[]
  habitat: string[]
  toxicity: 'toxic' | 'deadly' | null,
  edibility: 'inedible' | 'good' | 'excellent' | null
  traits: string[]
}