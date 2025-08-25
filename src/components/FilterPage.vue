<script setup lang="ts">
import { computed, ref } from 'vue'
import { useStore } from '@/stores/store'
import TypeFilter from './TypeFilter.vue'
import ColorFilter from './ColorFilter.vue'
import FilterOptionButton from './FilterOptionButton.vue'

const store = useStore()

// Nested options (unchanged)
const allOptions = {
  edibility: ['excellent', 'good', 'inedible'],
  toxicity: ['toxic', 'deadly'],
  smell: ['anise', 'mushroomy', 'sweet', 'earthy', 'radish', 'marzipan', 'putrid', 'fishy', 'floral'],
  taste: ['mild', 'bitter', 'spicy', 'mushroomy', 'other'],
  cap: {
    color: ['white', 'yellow', 'orange', 'red', 'pink', 'green', 'blue', 'brown', 'black', 'gray'],
    shape: ['round', 'flat', 'funnel', 'conical', 'coral-like', 'other'],
  },
  gills: {
    color: ['white', 'yellow', 'orange', 'red', 'pink', 'green', 'blue', 'brown', 'black', 'gray'],
    attachment: ['free', 'attached', 'decurrent'],
  },
  stem: {
    color: ['white', 'yellow', 'orange', 'red', 'pink', 'green', 'blue', 'brown', 'black', 'gray'],
  },
  flesh: {
    bruising_color: ['yellow', 'red', 'green', 'blue', 'brown', 'gray', 'none'],
    color: ['white', 'yellow', 'orange', 'red', 'pink', 'green', 'blue', 'brown', 'black', 'gray'],
  },
  spore_color: ['white', 'yellow', 'red', 'brown', 'purple', 'black'],
  habitat: ['wood', 'soil', 'meadow'],
  traits: [
    'gilled', 'poroid', 'milky', 'tufted', 'grooved_cap', 'hygrophanous',
    'netted_stem', 'scaly', 'brittle_stem', 'fibrous', 'speckled_stem',
    'spiny', 'rooting_base', 'hollow_stem', 'slimy', 'crowded_gills',
    'sawtooth_gills', 'forked_gills', 'bulbous_base', 'ring',
    'lichenized', 'other_genus'
  ]
} as const


</script>

<template>
  <div class="fixed inset-0 bg-white z-50  max-w-3xl mx-auto">
    <div class="flex justify-between items-center p-4 h-21">
      <div>
        <h1 class="text-xl">Filter</h1>
        <span v-if="store.filteredShrooms.length < 3000" class="text-sm text-stone-500">{{ store.filteredShrooms.length
          }} Ergebisse</span>
      </div>
      <div class="flex gap-4">
        <button v-if="Object.keys(store.filters).length" @click="store.clearFilters()"
          class="btn btn-secondary">Zurücksetzen</button>
        <router-link to="/" class="btn btn-secondary">Schließen</router-link>
      </div>
    </div>
    <!-- {{ store.filters }} -->
    <div class="overflow-y-auto h-8/10">
      <div class="p-4 space-y-6">
        <TypeFilter />
        <ColorFilter type="cap.color" />
        <div>
          <ColorFilter type="gills.color" />
          <div class="text-stone-700 text-sm mt-3 mb-2">Merkmale</div>
          <FilterOptionButton filterKey="traits" optionValue="milky" />
        </div>
        <div>
        <ColorFilter type="stem.color" />
          <div class="text-stone-700 text-sm mt-3 mb-2">Merkmale</div>
          <div class="flex gap-1 flex-row flex-wrap">
            <FilterOptionButton v-for='option in ["ring", "brittle_stem", "bulbous_base", "fibrous", "netted_stem", "scaly", "speckled_stem", "hollow_stem"]' filterKey="traits" :optionValue="option" />
          </div>
        </div>
        <ColorFilter type="flesh.color" />
        <ColorFilter type="flesh.bruising_color" :colors="[...allOptions.flesh.bruising_color]" />
      </div>
    </div>
  </div>
</template>