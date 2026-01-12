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
  name: string // latin name
  preferred_common_name?: string
  alternative_common_names?: string[]
  english_common_name?: string
  ancestry: string
  obs_count_ger?: number
  photos?: {
    url: string
    attribution: string
    license_code: string
  }[]
  id_123?: string
  type?: ('gilled' | 'poroid' | 'lichenized' | 'spiny' | 'round' | 'coral-like' | 'gelatinous' | 'other_genus')[]
  season_from?: number // months as numbers (1-12)
  season_to?: number 
  size_from?: number // diameter in cm
  size_to?: number
  gills_color?: Color[]
  gills_attachment?:('free' | 'attached' | 'decurrent')[]
  gills_traits?: GillTrait[]
  stem_color?: Color[]
  stem_traits?: StemTrait[]
  cap_color?: Color[]
  cap_shape?: ('round' | 'flat' | 'funnel' | 'conical' | 'coral-like' | 'grooved_cap' | 'other')[]
  flesh_color?: Color[]
  flesh_bruising_color?: BruisingColor[]
  edibility?: 'excellent' | 'good' | 'inedible'
  toxicity?: 'toxic' | 'deadly'
  taste?: ('mild' | 'bitter' | 'spicy' | 'mushroomy' | 'other')[]
  smell?: ('anise' | 'mushroomy' | 'sweet' | 'earthy' | 'radish' | 'marzipan' | 'putrid' | 'fishy' | 'floral')[]
  spore_color?: ('white' | 'yellow' | 'red' | 'brown' | 'purple' | 'black')[]
  habitat?: ('wood' | 'soil' | 'meadow')[]
  traits?: ('tufted' | 'hygrophanous' | 'slimy' | 'hard')[]
  look_alikes?: number[]
}