<script setup lang="ts">
import { ref } from 'vue'
import type Shroom from '@/types/Shroom'
import type { PropType } from 'vue'
import { getInaturalistImageUrl } from '@/utils'

const props = defineProps({
  shroom: {
    type: Object as PropType<Shroom>,
    required: true
  },
  index: {
    type: Number,
    default: 0
  }
})
const showAttribution = ref(false)
const photo = props.shroom.photos ? props.shroom.photos[props.index] : { 'url': '', 'attribution': '' }
</script>

<template>
  <div class="relative w-full h-full rounded-lg shadow-md md:aspect-[3/2] overflow-hidden">
    <!-- Mushroom image -->
    <img
      :src="getInaturalistImageUrl(photo.url, 'medium')"
      :alt="shroom.preferred_common_name"
      class="w-full h-full object-cover"
    />
    <!-- CC icon button bottom-right -->
    <button
      v-if="!showAttribution"
      @click="showAttribution = true"
      class="absolute bottom-2 right-2 bg-white opacity-70 rounded-full p-1 hover:opacity-100 transition text-xs cursor-pointer z-10"
      title="Show attribution"
      aria-label="Toggle attribution"
    >
      CC
    </button>
    <!-- Attribution small bottom bar -->
    <transition name="fade">
      <div
        v-if="showAttribution && photo.attribution"
        @click="showAttribution = false"
        class="absolute bottom-0 left-0 bg-[rgba(0,0,0,0.7)]  text-white min-h-8 min-w-full flex flex-wrap items-center px-2 py-2 text-xs cursor-pointer z-20"
      >
        {{ photo.attribution }}
      </div>
    </transition>
  </div>
</template>