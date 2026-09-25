<script setup lang="ts">
import type Shroom from '@/types/Shroom'

defineProps<{ shroom: Shroom }>()
</script>

<template>
  <div class="space-y-4">
    <h2 class="text-xl font-serif font-bold text-tan-900">Vorkommen</h2>
    <p class="text-tan-600 leading-relaxed whitespace-pre-line">{{ shroom.occurrence_text }}</p>
    <div v-if="shroom.occurrence_trees && shroom.occurrence_trees.length" class="flex flex-wrap gap-2">
      <span v-for="tree in shroom.occurrence_trees" :key="tree"
        class="px-3 py-1 bg-white text-tan-800 rounded-md text-sm font-medium border border-tan-100">
        {{ tree }}
      </span>
    </div>
  </div>
</template>
