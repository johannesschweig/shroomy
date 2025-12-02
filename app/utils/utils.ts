import type Shroom from '@/types/Shroom'
import ToxicIcon from '@/assets/toxic.svg'
import DeadlyIcon from '@/assets/deadly.svg'
import InedibleIcon from '@/assets/inedible.svg'
import EdibleGoodIcon from '@/assets/edible-good.svg'
import EdibleExcellentIcon from '@/assets/edible-excellent.svg'

export const GERMAN_MONTHS = [
  'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
  'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
];

const TW_COLOR_MAP: Record<string, string> = {
  none: 'bg-white',
  white: 'bg-white',
  black: 'bg-black',
  yellow: 'bg-yellow-400',
  orange: 'bg-orange-500',
  red: 'bg-red-500',
  pink: 'bg-pink-500',
  blue: 'bg-blue-600',
  green: 'bg-green-600',
  grey: 'bg-gray-600',
  gray: 'bg-gray-600',
  brown: 'bg-[#8B4513]',
};

const HEX_COLOR_MAP: Record<string, string> = {
  none: '#FFFFFF',
  white: '#FFFFFF',
  black: '#000000',
  yellow: '#FBBF24',
  orange: '#F97316',
  red: '#EF4444',
  pink: '#EC4899',
  blue: '#2563EB',
  green: '#16A34A',
  grey: '#4B5563',
  gray: '#4B5563',
  brown: '#8B4513',
};

export function toTwColorClass(
  color: string
): string {
  return TW_COLOR_MAP[color]
}

export function toHexColor(
  color: string
): string {
  return HEX_COLOR_MAP[color] || '#78716c'
}

// random number from 0-1 with seed
function seededRandom(seed: number) {
  let value = seed
  return function () {
    value = (value * 1664525 + 1013904223) % 4294967296
    return value / 4294967296
  }
}

export function seedToday(max: number) {
  // seed
  const now = new Date()
  const dayFrom1980 = Math.floor(now.getTime() / (1000 * 60 * 60 * 24))

  const random = seededRandom(dayFrom1980);
  return Math.floor(random() * max)
}

export type MushroomIconData = {
  icon: any | null
  class: string
  text: string
}

export function getMushroomIcon(shroom: Shroom): MushroomIconData {
  if (!shroom) return { icon: null, class: '', text: '' }

  if (shroom.toxicity === 'deadly') return { icon: DeadlyIcon, class: 'text-red-700', text: 'Tödlich giftig' }
  if (shroom.toxicity === 'toxic') return { icon: ToxicIcon, class: 'text-amber-700', text: 'Giftig' }

  switch (shroom.edibility) {
    case 'excellent':
      return { icon: EdibleExcellentIcon, class: 'text-emerald-800', text: 'Ausgezeichnet' }
    case 'good':
      return { icon: EdibleGoodIcon, class: 'text-emerald-700', text: 'Gut' }
    case 'inedible':
      return { icon: InedibleIcon, class: 'text-stone-700', text: 'Ungenießbar' }
    default:
      return { icon: null, class: '', text: '' }
  }
}

// from dot notation to object
export function getNested(obj: any, path: string) {
  return path.split('.').reduce((acc, key) => acc?.[key], obj)
}

export function getInaturalistImageUrl(photo: string, size: "square" | "small" | "medium" | "large") {
  return photo.replace("square", size)
}

export function capitalizeFirstLetter(str: string): string {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

// Create slug from name
export function createSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}