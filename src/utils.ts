import type Shroom from '@/types/Shroom'

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

function seededRandom(seed: number) {
  let value = seed
  return function () {
    value = (value * 1664525 + 1013904223) % 4294967296
    return value / 4294967296
  }
}

export function getRandomSeededSample(arr: Array<Shroom>, sampleSize: number) {
  // seed
  const now = new Date()
  const dayFrom1980 = Math.floor(now.getTime() / (1000 * 60 * 60 * 24))

  const random = seededRandom(dayFrom1980);
  const shuffled = [...arr].sort(() => random() - 0.5);
  return shuffled.slice(0, sampleSize);
}