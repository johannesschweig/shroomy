<script setup lang="ts">
import { ref, computed } from 'vue'
import { useStore } from '@/stores/store'

const store = useStore()

const allOptions = {
  edibility: ['excellent', 'good', 'inedible'],
  toxicity: ['toxic', 'deadly'],
  smell: ['anise', 'mushroomy', 'sweet', 'earthy', 'radish', 'marzipan', 'putrid', 'fishy', 'floral'],
  taste: ['mild', 'bitter', 'spicy', 'mushroomy', 'other'],
  'cap.color': ['white', 'yellow', 'orange', 'red', 'pink', 'brown', 'black', 'gray', 'amber', 'green'],
  'cap.shape': ['round', 'flat', 'funnel', 'conical', 'coral-like', 'other'],
  'flesh.bruising_color': ['amber', 'brown', 'yellow', 'gray', 'green', 'red', 'none'],
  'flesh.color': ['white', 'yellow', 'orange', 'red', 'pink', 'brown', 'black', 'gray', 'amber', 'green'],
  'gills.color': ['white', 'yellow', 'orange', 'red', 'pink', 'brown', 'black', 'gray', 'amber', 'green'],
  'gills.attachment': ['free', 'attached', 'decurrent'],
  spore_color: ['white', 'yellow', 'red', 'brown', 'purple', 'black'],
  habitat: ['wood', 'soil', 'meadow'],
  traits: [
    'gilled', 'poroid', 'milky', 'tufted', 'grooved_cap', 'hygrophanous',
    'netted_stem', 'scaly', 'brittle_stem', 'fibrous', 'speckled_stem',
    'spiny', 'rooting_base', 'hollow_stem', 'slimy', 'crowded_gills',
    'sawtooth_gills', 'forked_gills', 'bulbous_base', 'ring',
    'lichenized', 'other_genus'
  ]
}

const getFilter = (key: string) => store.filters[key] || []

const toggleFilter = (key: string, value: string) => {
  store.toggleFilter(key, value)
}
</script>

<template>
  <div class="fixed inset-0 bg-white z-50 overflow-y-auto max-w-3xl mx-auto">
    <div class="flex justify-between items-center p-4">
      <h1 class="text-xl">Filter</h1>
      <button @click="store.setFilterVisible(false)" class="btn btn-secondary">Schließen</button>
    </div>

    <div class="p-4 space-y-6">
      <div v-for="(options, key) in allOptions" :key="key">
        <h2 class="text-stone-700 mb-2 capitalize">
          {{ key.replace('.', ' ').replace('_', ' ') }}
        </h2>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="option in options"
            :key="option"
            @click="toggleFilter(key, option)"
            :class="[
              'px-3 py-1 text-sm rounded-full border',
              getFilter(key).includes(option)
                ? 'bg-amber-600 text-white border-amber-600'
                : 'text-stone-600 border-stone-300'
            ]"
          >
            {{ option }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
