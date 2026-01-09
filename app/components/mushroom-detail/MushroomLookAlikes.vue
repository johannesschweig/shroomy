<script setup lang="ts">
import { computed } from 'vue'
import Card from '@/components/Card.vue'
import type Shroom from '@/types/Shroom'

const props = defineProps<{
  lookAlikes: Shroom[] 
}>()

const sortedLookAlikes = computed(() => {
  return [...props.lookAlikes].sort((a, b) => (b.obs_count_ger || 0) - (a.obs_count_ger || 0))
})
</script>

<template>
  <div v-if="lookAlikes.length" class="space-y-6 pt-10">
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-serif font-bold text-tan-900">Verwechslungsgefahr</h2>
      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-tan-100 text-tan-800">
        {{ lookAlikes.length }} Arten
      </span>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card 
        v-for="lookalike in sortedLookAlikes" 
        :key="lookalike.id" 
        :shroom="lookalike"
      />
    </div>
  </div>
</template>