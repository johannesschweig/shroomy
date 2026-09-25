<script setup lang="ts">
import type Shroom from '@/types/Shroom'

defineProps<{ shroom: Shroom }>()
</script>

<template>
  <div v-if="shroom.description" class="space-y-6">
    <h2 class="text-xl font-serif font-bold text-tan-900 flex items-center gap-2">
      <span>Bestimmungsmerkmale</span>
    </h2>
    <p class="text-tan-600 leading-relaxed whitespace-pre-line">{{ shroom.description }}</p>
  </div>
</template>
