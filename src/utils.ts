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