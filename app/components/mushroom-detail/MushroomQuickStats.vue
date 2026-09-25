<script setup lang="ts">
import type Shroom from '@/types/Shroom'
import PorodIcon from '@/assets/poroid.svg'
import GillsIcon from '@/assets/gills.svg'
import { getMushroomIcon, getFrequencyLabel } from '@/utils/utils'
import MushroomIcon from '@/assets/mushroom.svg'

const props = defineProps<{ shroom: Shroom }>()

const frequencyText = computed(() => getFrequencyLabel(props.shroom.obs_count_ger))

// toxicity is more relevant than an unknown edibility, so this tile shows whichever
// of the two is actually known, toxicity first — same priority as Card.vue's badge
const statusData = computed(() => getMushroomIcon(props.shroom))
const statusLabel = computed(() => props.shroom.toxicity ? 'Giftigkeit' : 'Speisewert')

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
      <div class="rounded-full p-2" :class="statusData.class || 'bg-tan-100 text-tan-700'">
        <component :is="statusData.icon" v-if="statusData.icon" class="w-6 h-6 text-center" />
      </div>
      <span class="font-bold" :class="shroom.toxicity ? 'text-red-800' : 'text-tan-900'">{{ statusData.text || 'Unbekannt' }}</span>
      <span class="text-xs text-tan-400 uppercase tracking-wide">{{ statusLabel }}</span>
    </div>

    <div v-if="typeIcon"
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