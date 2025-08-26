<script setup lang="ts">
import MushroomIcon from '@/assets/mushroom.svg'
import type Shroom from '@/types/Shroom'
import { computed } from 'vue';
import { getMushroomIcon } from '@/utils';

const props = defineProps<{
  shroom: Shroom
}>()

const iconData = computed(() => getMushroomIcon(props.shroom))

</script>

<template>
  <router-link :to="`/mushroom/${shroom.taxon_id}`" :key="shroom.url"
    class="grid grid-cols-[80px_1fr_auto] gap-2 md:gap-3 items-center hover:bg-stone-100 rounded-lg">
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
        {{ shroom.taxon_name || 'No Latin Name' }}
      </div>
    </div>

    <!-- Edibility & Toxicity icons -->
    <div class="hidden md:block mx-4 w-8 h-8">
      <component v-if="iconData.icon" :is="iconData.icon" :class="iconData.class" />
    </div>
  </router-link>
</template>