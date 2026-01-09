<script setup lang="ts">
import { GERMAN_MONTHS } from '@/utils/utils'

const props = defineProps<{ 
  from?: number, 
  to?: number 
}>()

const activeMonths = computed(() => {
  if (!props.from || !props.to) return []
  if (props.from <= props.to) {
    return Array.from({ length: props.to - props.from + 1 }, (_, i) => props.from! + i)
  }
  return [
    ...Array.from({ length: 12 - props.from + 1 }, (_, i) => props.from! + i),
    ...Array.from({ length: props.to }, (_, i) => i + 1)
  ]
})
</script>

<template>
  <div class="">
    <h3 class="font-serif font-bold text-xl text-tan-900 mb-6">Saison & Fundzeit</h3>
    
    <div class="grid grid-cols-12 mb-2 text-xs  uppercase text-center">
      <div v-for="(m, i) in GERMAN_MONTHS" :key="m" :class="activeMonths.includes(i+1) ? 'text-amber-700' : 'text-tan-400'">{{ m.slice(0,3) }}</div>
    </div>

    <div class="h-8 w-full bg-tan-100 rounded-full relative overflow-hidden flex">
      <div v-for="i in 12" :key="i" class="flex-1 h-full border-r border-white/50 last:border-0 relative">
        <div v-if="activeMonths.includes(i)" 
             class="absolute inset-0 bg-linear-to-b from-amber-300 to-amber-400 opacity-90">
        </div>
      </div>
    </div>
  </div>
</template>