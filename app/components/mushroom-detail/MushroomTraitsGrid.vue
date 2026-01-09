<script setup lang="ts">
import type Shroom from '@/types/Shroom'

defineProps<{ shroom: Shroom }>()
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 lg:grid-rows-3 gap-4">

    <div v-if="shroom.size_from && shroom.size_to"
      class="bg-tan-50 rounded-xl p-5 border border-tan-200 flex items-start gap-4">
      <div>
        <h4 class="text-sm uppercase tracking-wider text-tan-500 font-semibold mb-1">Größe (Hut)</h4>
        <div class="text-xl font-bold text-tan-900">
          {{ shroom.size_from }} – {{ shroom.size_to }} <span class="text-base font-normal text-tan-600">cm</span>
        </div>
      </div>
    </div>

    <div v-if="shroom.habitat" class="bg-tan-50 rounded-xl p-5 border border-tan-200">
      <h4 class="text-sm uppercase tracking-wider text-tan-500 font-semibold mb-3">Lebensraum</h4>
      <div class="flex flex-wrap gap-2">
        <span v-for="h in shroom.habitat" :key="h"
          class="px-3 py-1 bg-white text-tan-800 rounded-md text-sm font-medium border border-tan-100">
          {{ $t(h) }}
        </span>
      </div>
    </div>

    <div v-if="shroom.traits && shroom.traits.length" class="bg-tan-50 rounded-xl p-5 border border-tan-200">
      <h4 class="text-sm uppercase tracking-wider text-tan-500 font-semibold mb-3">Besonderheiten</h4>
      <ul class="space-y-2">
        <li v-for="trait in shroom.traits" :key="trait" class="flex items-center gap-2 text-tan-800">
          <span class="w-1.5 h-1.5 rounded-full bg-tan-400"></span>
          <span class="capitalize">{{ $t(trait) }}</span>
        </li>
      </ul>
    </div>

  </div>
</template>
