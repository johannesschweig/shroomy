<script setup lang="ts">
import type Shroom from '@/types/Shroom'

defineProps<{ shroom: Shroom }>()
</script>

<template>
  <div class="space-y-4">
    <h2 class="text-xl font-serif font-bold text-tan-900">Sensorik & Sporen</h2>
    <p class="text-tan-700 leading-relaxed">
      <span v-if="shroom.smell" >
        Er hat einen {{shroom.smell?.map(s => $t(s)).join(', ')}}en Geruch.
      </span>
      <span v-if="shroom.taste">
        Er hat einen {{shroom.taste?.map(t => $t(t)).join(', ')}}en Geschmack.
      </span>
      <span v-if="shroom.spore_color">
        Das Sporenpulver ist {{shroom.spore_color.map(s => $t(s)).join(', ')}}.
      </span>
    </p>
  </div>
</template>