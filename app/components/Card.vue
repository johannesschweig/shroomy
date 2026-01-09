<script setup lang="ts">
import MushroomIcon from '@/assets/mushroom.svg'
import type Shroom from '@/types/Shroom'
import { computed } from 'vue';
import { useStore } from '@/stores/store'
import { getMushroomUrl } from '@/utils/utils'

const props = defineProps<{
  shroom: Shroom,
  highlight?: Boolean
}>()

const store = useStore()

const iconData = computed(() => getMushroomIcon(props.shroom))

function highlightMatch(text: string) {
  text = capitalizeFirstLetter(text)
  if (!props.highlight) return text
  const query = store.search
  if (!query) return text
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  const parts = text.split(regex)
  return parts.map((part, _idx) => {
    if (part.toLowerCase() === query.toLowerCase()) {
      return `<span class="bg-amber-100 text-stone-950 rounded-lg py-1">${part}</span>`
    } else {
      return part
    }
  }).join('')
}

</script>

<template>
  <NuxtLink :to="getMushroomUrl(shroom)" :key="shroom.name"
    class="grid grid-cols-[80px_1fr_auto] gap-2 md:gap-3 items-center hover:bg-white rounded-lg">
    <img v-if="shroom.photos && shroom.photos.length && shroom.photos?.[0].url" :src="getInaturalistImageUrl(shroom.photos?.[0].url, 'small')" alt="mushroom" loading="lazy"
      class="w-20 h-20 object-cover mr-4 rounded-lg" />
    <div v-else class="w-20 h-20 bg-stone-200 mr-4 rounded-lg flex items-center justify-center">
      <MushroomIcon class="w-12 h-12 text-stone-400" />
    </div>

    <div>
      <div v-if="shroom.preferred_common_name" class="text-lg text-stone-900 font-semibold" v-html="highlightMatch(shroom.preferred_common_name)"></div>
      <div class="text-sm md:text-base italic text-stone-500 max-w-[25ch] truncate" v-html="highlightMatch(shroom.name)"></div>
    </div>

    <!-- Edibility & Toxicity icons -->
    <div class="mx-2 w-6 h-6 md:mx-4 md:w-8 md:h-8">
      <component v-if="iconData.icon" :is="iconData.icon" :class="iconData.class" />
    </div>
  </NuxtLink>
</template>