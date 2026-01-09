<script setup lang="ts">
import type Shroom from '@/types/Shroom'

defineProps<{ shroom: Shroom }>()
</script>

<template>
  <div class="flex gap-3 mt-2">
    <a :href="`https://www.inaturalist.org/taxa/${shroom.id}`" target="_blank"
      class="flex items-center justify-center py-2 px-4 rounded-lg bg-white border border-tan-200 text-tan-700 text-sm font-medium hover:bg-tan-50 hover:text-tan-900 transition-colors">
      iNaturalist
    </a>
    <a v-if="shroom.id_123" :href="`https://www.123pilzsuche.de/daten/details/${shroom.id_123}`" target="_blank"
      class="flex items-center justify-center py-2 px-4 rounded-lg bg-white border border-tan-200 text-tan-700 text-sm font-medium hover:bg-tan-50 hover:text-tan-900 transition-colors">
      123Pilze
    </a>
  </div>
</template>