<script setup lang="ts">
import type Shroom from '@/types/Shroom'
import { capitalizeFirstLetter } from '@/utils/utils';

defineProps<{ shroom: Shroom }>()
</script>

<template>
  <div class="space-y-2">
    <div class="flex flex-col gap-4">
      <h1 class="text-4xl md:text-5xl font-serif font-bold text-tan-900">
        {{ shroom.preferred_common_name || shroom.name }}
      </h1>

      <div class="flex gap-3 items-center">
        <span class="text-lg md:text-xl text-tan-500 italic mb-1.5 font-serif">
          {{ capitalizeFirstLetter(shroom.name) }}
        </span>
        <div v-if="shroom.edibility === 'excellent' || shroom.edibility === 'good'"
          class="mb-2 px-3  py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-tan-200 text-tan-800">
          Essbar
        </div>
      </div>
    </div>
  </div>
</template>