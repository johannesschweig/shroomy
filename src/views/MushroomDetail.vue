<script setup lang="ts">
import { onMounted, watch, ref, computed } from 'vue'
import { useRoute, onBeforeRouteLeave } from 'vue-router'
import { useStore } from '@/stores/store'
import type Shroom from '@/types/Shroom'
import { getMushroomIcon } from '@/utils'

const route = useRoute()
const store = useStore()

const shroom = ref<Shroom | null>(null)

onMounted(() => {
  setTimeout(() => {
    shroom.value = store.shrooms.find(s => s['taxon_id'] === Number(route.params.id)) || null
  }, 500)
})

onBeforeRouteLeave(async (_to, _from) => {
  shroom.value = null
})

watch(() => route.params.id, () => {
  if (route.params.id) {
    setTimeout(() => {
      shroom.value = store.shrooms.find(s => s['taxon_id'] === Number(route.params.id)) || null
    }, 500)
  }
})

const seasonText = computed(() => {
  if (!shroom.value) return ''
  return `von ${shroom.value.season.from} bis ${shroom.value.season.to}`
})

const sizeText = computed(() => {
  if (!shroom.value) return ''
  return `${shroom.value.size.min_diameter_cm}–${shroom.value.size.max_diameter_cm} cm`
})

function joinAttr(attr: string[] | null | undefined) {
  return attr?.join(', ') || '-'
}

const iconData = computed(() => shroom.value ? getMushroomIcon(shroom.value) : { icon: null, class: '', text: '' })
</script>

<template>
  <div v-if="shroom" class="max-w-xl mx-auto p-4 flex flex-col gap-4">
    <router-link to="/" class="btn btn-secondary w-fit">
      Zurück
    </router-link>
    <h1 class="text-3xl font-bold">{{ shroom.name.de[0] }}</h1>
    <h2 class="text-lg text-stone-600 italic">{{ shroom.taxon_name }}</h2>

    <img :src="shroom.photo_url.replace('square', 'medium') || shroom.image" alt=""
      class="w-full rounded-lg shadow-md" />

    <!-- edibility/toxicity -->
    <div class="p-3 rounded-lg bg-stone-200 flex w-fit gap-2 items-center">
      <component v-if="iconData.icon" :is="iconData.icon" :class="iconData.class" class="w-8 h-8" />
      {{ iconData.text }}
    </div>

    <!-- rest of attributes -->
    <div class="grid grid-cols-2 gap-4 mt-4 text-sm text-stone-700">
      <div><strong>Season:</strong> {{ seasonText }}</div>
      <div><strong>Size:</strong> {{ sizeText }}</div>
      <div><strong>Taste:</strong> {{ joinAttr(shroom.taste) }}</div>
      <div><strong>Smell:</strong> {{ joinAttr(shroom.smell) }}</div>
      <div><strong>Spore Color:</strong> {{ joinAttr(shroom.spore_color) }}</div>
      <div><strong>Habitat:</strong> {{ joinAttr(shroom.habitat) }}</div>
      <div><strong>Cap Color:</strong> {{ joinAttr(shroom.cap.color) }}</div>
      <div><strong>Cap Shape:</strong> {{ joinAttr(shroom.cap.shape) }}</div>
      <div><strong>Stem Color:</strong> {{ joinAttr(shroom.stem?.color) }}</div>
      <div><strong>Flesh Color:</strong> {{ joinAttr(shroom.flesh.color) }}</div>
      <div><strong>Bruising Color:</strong> {{ joinAttr(shroom.flesh.bruising_color) }}</div>
      <div><strong>Gills Color:</strong> {{ joinAttr(shroom.gills.color) }}</div>
      <div><strong>Gills Attachment:</strong> {{ joinAttr(shroom.gills.attachment) }}</div>
      <div><strong>Traits:</strong> {{ joinAttr(shroom.traits) }}</div>
    </div>

    <a :href="shroom.url" target="_blank" class="mt-4 text-amber-600 underline">
      Mehr Details auf 123Pilzsuche
    </a>
  </div>

  <div v-else class="text-center p-8 text-stone-500">
    Pilz nicht gefunden
  </div>
</template>

<!--
  traits: gilled/poroid, millky, //'lichenized', 'other_genus', coral-like, spiny
  cap: {
    color: ['white', 'yellow', 'orange', 'red', 'pink', 'green', 'blue', 'brown', 'black', 'gray'],
    shape: ['round', 'flat', 'funnel', 'conical', 'other'],
  },
  traits: grooved_cap
  gills: {
    color: ['white', 'yellow', 'orange', 'red', 'pink', 'green', 'blue', 'brown', 'black', 'gray'],
    attachment: ['free', 'attached', 'decurrent'],
  },
'crowded_gills', 'sawtooth_gills', 'forked_gills', 
  stem: {
    color: ['white', 'yellow', 'orange', 'red', 'pink', 'green', 'blue', 'brown', 'black', 'gray'],
  },
  traits ["ring", "brittle_stem", "bulbous_base", "fibrous", "netted_stem", "scaly", "speckled_stem", "hollow_stem"]'
  flesh: {
    bruising_color: ['yellow', 'red', 'green', 'blue', 'brown', 'gray', 'none'],
    color: ['white', 'yellow', 'orange', 'red', 'pink', 'green', 'blue', 'brown', 'black', 'gray'],
  },
  smell: ['anise', 'mushroomy', 'sweet', 'earthy', 'radish', 'marzipan', 'putrid', 'fishy', 'floral'],
  taste: ['mild', 'bitter', 'spicy', 'mushroomy', 'other'],
  spore_color: ['white', 'yellow', 'red', 'brown', 'purple', 'black'],
  habitat: ['wood', 'soil', 'meadow'],
  traits: [
    'tufted', 'hygrophanous', 'rooting_base', 'slimy', 
  ] -->