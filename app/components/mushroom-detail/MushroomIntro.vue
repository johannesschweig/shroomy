<script setup lang="ts">
import { computed } from 'vue'
import { GERMAN_MONTHS } from '@/utils/utils'
import type Shroom from '@/types/Shroom'
import { capitalizeFirstLetter } from '@/utils/utils';

const props = defineProps<{ shroom: Shroom }>()


const introText = computed(() => {
  const s = props.shroom
  const name = s.preferred_common_name || s.name
  const edibility = s.edibility ? `mit dem Speisewert ${s.edibility}` : '' 
  const toxicity = s.toxicity ? ` (${s.toxicity})` : ''
  
  let seasonText = ''
  if (s.season_from && s.season_to) {
    const from = GERMAN_MONTHS[s.season_from - 1]
    const to = GERMAN_MONTHS[s.season_to - 1]
    seasonText = `Die Hauptsaison erstreckt sich von ${from} bis ${to}.`
  }

  return { name, edibility, toxicity, seasonText }
})
</script>

<template>
  <div class="max-w-none">
    <p class="text-tan-900 leading-relaxed text-lg">
      Der <strong>{{ introText.name }}</strong> (<em>{{ capitalizeFirstLetter(shroom.name) }}</em>) ist ein Pilz 
      <span v-if="shroom.edibility">mit dem Speisewert <strong>{{ $t(shroom.edibility) }}</strong></span>
      <span v-if="shroom.toxicity" class="text-red-800 font-medium"> und gilt als {{ $t(shroom.toxicity) }}</span>.
      
      {{ introText.seasonText }}
      
      <span v-if="shroom.habitat">
        Er wächst bevorzugt auf <strong>{{ shroom.habitat.map(h => $t(h)).join(', ') }}</strong>.
      </span>
      
      <span v-if="shroom.traits?.includes('hygrophanous')">
        Ein charakteristisches Merkmal ist seine Hygrophanität (Änderung der Hutfarbe bei Nässe).
      </span>
    </p>
  </div>
</template>