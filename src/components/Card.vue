<script setup lang="ts">
import { capitalize } from '@/utils'
import MushroomIcon from '@/assets/mushroom.svg'
import ToxicIcon from '@/assets/toxic.svg'
import DeadlyIcon from '@/assets/deadly.svg'
import EdibleGoodIcon from '@/assets/edible-good.svg'
import EdibleExcellentIcon from '@/assets/edible-excellent.svg'
import InedibleIcon from '@/assets/inedible.svg'

defineProps<{
  shroom: {
    url: string
    photo_url?: string
    name: {
      de: string[]
      lat: string[]
    },
    toxicity: 'toxic' | 'deadly' | null,
    edibility: 'inedible' | 'good' | 'excellent' | null
  }
}>()
</script>

<template>
  <a :href="shroom.url" target="_blank" :key="shroom.url"
    class="grid grid-cols-[80px_1fr_auto] gap-2 items-center hover:bg-stone-100 rounded-lg">
    <img :src="shroom.photo_url.replace('square', 'small')" alt="mushroom" loading="lazy"
      class="w-20 h-20 object-cover mr-4 rounded-lg" v-if="shroom.photo_url" />
    <div v-else class="w-20 h-20 bg-stone-200 mr-4 rounded-lg flex items-center justify-center">
      <MushroomIcon class="w-12 h-12 text-stone-400" />
    </div>

    <div>
      <div class="text-lg text-stone-900 font-semibold">
        {{ shroom.name.de?.[0] || 'No Name' }}
      </div>
      <div class="text-sm md:text-base italic text-stone-500 max-w-[25ch] truncate">
        {{ capitalize(shroom.name.lat[0] || 'No Latin Name' )}}
      </div>
    </div>

    <!-- Edibility & Toxicity icons -->
    <div class="hidden md:block mx-4 w-8 h-8">
      <ToxicIcon class="text-amber-700" v-if="shroom.toxicity === 'toxic'" />
      <DeadlyIcon class="text-red-700" v-if="shroom.toxicity === 'deadly'" />
      <InedibleIcon class="text-stone-700" v-if="shroom.edibility === 'inedible'"/>
      <EdibleGoodIcon class="text-emerald-700" v-if="shroom.edibility === 'good'"/>
      <EdibleExcellentIcon class="text-emerald-800" v-if="shroom.edibility === 'excellent'"/>
    </div>
  </a>
</template>