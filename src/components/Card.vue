<script setup lang="ts">
import { capitalize } from '@/utils'
import MushroomIcon from '@/assets/mushroom.svg'

defineProps<{
  shroom: {
    url: string
    photo_url?: string
    name: {
      de: string[]
      lat: string[]
    }
  }
}>()
</script>

<template>
  <a :href="shroom.url" target="_blank" :key="shroom.url"
    class="flex items-center hover:bg-stone-100 rounded-lg">
    <img :src="shroom.photo_url.replace('square', 'small')" alt="mushroom" loading="lazy"
      class="w-20 h-20 object-cover mr-4 rounded-lg" v-if="shroom.photo_url" />
    <div v-else class="w-20 h-20 bg-stone-200 mr-4 rounded-lg flex items-center justify-center">
      <MushroomIcon class="w-12 h-12 text-stone-400" />
    </div>

    <div>
      <div class="text-lg text-slate-900 font-semibold">
        {{ shroom.name.de?.[0] || 'No Name' }}
      </div>
      <div class="italic text-stone-500">
        {{ capitalize(shroom.name.lat[0] || 'No Latin Name' )}}
      </div>
    </div>
  </a>
</template>