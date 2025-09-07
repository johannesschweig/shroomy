export const colors = ['white', 'yellow', 'orange', 'red', 'pink', 'green', 'blue', 'brown', 'black', 'gray'] as const
export const bruising_colors = ['yellow', 'red', 'green', 'blue', 'brown', 'gray', 'none'] as const
export const stem_traits = ['hollow_stem', 'speckled_stem', 'scaly', 'netted_stem', 'fibrous', 'bulbous_base', 'ring', 'rooting_base'] as const
export const gills_traits = ['milky', 'crowded_gills', 'sawtooth_gills', 'forked_gills'] as const

type Color = (typeof colors)[number];
type BruisingColor = (typeof bruising_colors)[number];
type StemTrait = (typeof stem_traits)[number];
type GillTrait = (typeof gills_traits)[number];

export default interface Shroom {
  id: number
  rank_level?: number
  name: string
  preferred_common_name: string
  english_common_name: string
  type?: ('gilled' | 'poroid' | 'lichenized' | 'spiny' | 'round' | 'coral-like' | 'gelatinous' | 'other_genus')[]
  photos?: {
    url: string
    attribution: string
    license_code: string
  }[]
  id_123?: string
  season?: [number, number] // months as numbers (1-12)
  size?: [number, number] // diameter in cm
  gills?: {
    color: Color[]
    attachment: ('free' | 'attached' | 'decurrent')[]
    traits: GillTrait[]
  }
  stem?: {
    color: Color[]
    traits: StemTrait[]
  }
  cap?: {
    color: Color[]
    shape: ('round' | 'flat' | 'funnel' | 'conical' | 'coral-like' | 'grooved_cap' | 'other')[]
  }
  flesh?: {
    color: Color[]
    bruising_color: BruisingColor[]
  }
  edibility?: 'excellent' | 'good' | 'inedible'
  toxicity?: 'toxic' | 'deadly'
  taste?: ('mild' | 'bitter' | 'spicy' | 'mushroomy' | 'other')[]
  smell?: ('anise' | 'mushroomy' | 'sweet' | 'earthy' | 'radish' | 'marzipan' | 'putrid' | 'fishy' | 'floral')[]
  spore_color?: ('white' | 'yellow' | 'red' | 'brown' | 'purple' | 'black')[]
  habitat?: ('wood' | 'soil' | 'meadow')[]
  traits?: ('tufted' | 'hygrophanous' | 'slimy' | 'hard')[]
  frequency?: string
  ancestry: string
  observations_count: number
  look_alikes?: number[]
}