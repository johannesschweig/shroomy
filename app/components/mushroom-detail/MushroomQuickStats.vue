<script setup lang="ts">
import type Shroom from '@/types/Shroom'
import EdibleExcellentIcon from '@/assets/edible-excellent.svg'
import EdibleGoodIcon from '@/assets/edible-good.svg'
import EdibleInedibleIcon from '@/assets/inedible.svg'
import PorodIcon from '@/assets/poroid.svg'
import GillsIcon from '@/assets/gills.svg'
import { capitalizeFirstLetter } from '@/utils/utils'
import MushroomIcon from '@/assets/mushroom.svg'

const props = defineProps<{ shroom: Shroom }>()

const frequencyText = computed(() => {
  const count = props.shroom.obs_count_ger || 0
  if (count < 10) return 'Sehr selten'
  if (count < 30) return 'Selten'
  if (count < 70) return 'Häufig'
  return 'Sehr häufig'
})

const edibleIcon = computed(() => {
  switch (props.shroom.edibility) {
    case 'excellent':
      return EdibleExcellentIcon
    case 'good':
      return EdibleGoodIcon
    case 'inedible':
      return EdibleInedibleIcon
    default:
      return null
  }
})

const typeIcon = computed(() => {
  if (props.shroom.type?.includes('poroid')) {
    return PorodIcon
  } else if (props.shroom.type?.includes('gilled')) {
    return GillsIcon
  } else {
    return null
  }
})
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
    <div
      class="bg-white border border-tan-100 shadow-sm rounded-xl p-6 flex flex-col items-center justify-center text-center gap-2">
      <div class="bg-tan-100 rounded-full p-2">
        <component :is="edibleIcon" v-if="edibleIcon" class="w-6 h-6 text-center text-tan-700" />
      </div>
      <span class="font-bold text-tan-900">{{ capitalizeFirstLetter($t(shroom.edibility || 'unknown')) }}</span>
      <span class="text-xs text-tan-400 uppercase tracking-wide">Speisewert</span>
    </div>
    <div
      class="bg-white border border-tan-100 shadow-sm rounded-xl p-6 flex flex-col items-center justify-center text-center gap-2">
      <div class="bg-tan-100 rounded-full p-2">
        <component :is="typeIcon" v-if="typeIcon" class="w-6 h-6 text-tan-700" />
      </div>
      <span class="font-bold text-tan-900">
        {{ capitalizeFirstLetter($t(shroom.type[0] || 'unknown')) }}
      </span>
      <span class="text-xs text-tan-400 uppercase tracking-wide">Typ</span>
    </div>

    <div
      class="bg-white border border-tan-100 shadow-sm rounded-xl p-6 flex flex-col items-center justify-center text-center gap-2">
      <div class="bg-tan-100 rounded-full p-2">
        <MushroomIcon class="w-6 h-6 text-tan-700" />
      </div>
      <span class="font-bold text-tan-900">{{ frequencyText }}</span>
      <span class="text-xs text-tan-400 uppercase tracking-wide">Vorkommen</span>
    </div>
  </div>
</template>