<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from '@/stores/store'

const store = useStore()

// Nested options (unchanged)
const allOptions = {
  edibility: ['excellent', 'good', 'inedible'],
  toxicity: ['toxic', 'deadly'],
  smell: ['anise', 'mushroomy', 'sweet', 'earthy', 'radish', 'marzipan', 'putrid', 'fishy', 'floral'],
  taste: ['mild', 'bitter', 'spicy', 'mushroomy', 'other'],
  cap: {
    color: ['white', 'yellow', 'orange', 'red', 'pink', 'brown', 'black', 'gray', 'amber', 'green'],
    shape: ['round', 'flat', 'funnel', 'conical', 'coral-like', 'other'],
  },
  flesh: {
    bruising_color: ['amber', 'brown', 'yellow', 'gray', 'green', 'red', 'none'],
    color: ['white', 'yellow', 'orange', 'red', 'pink', 'brown', 'black', 'gray', 'amber', 'green'],
  },
  gills: {
    color: ['white', 'yellow', 'orange', 'red', 'pink', 'brown', 'black', 'gray', 'amber', 'green'],
    attachment: ['free', 'attached', 'decurrent'],
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

type FlatOptions = Record<string, readonly string[]>

function flattenOptions(
  obj: Record<string, any>,
  prefix = ''
): FlatOptions {
  const out: Record<string, readonly string[]> = {}
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k
    if (Array.isArray(v)) {
      out[key] = v
    } else if (v && typeof v === 'object') {
      Object.assign(out, flattenOptions(v, key))
    }
  }
  return out
}

const flatOptions = computed<FlatOptions>(() => flattenOptions(allOptions))

const getFilter = (key: string) => store.filters[key] || []

const toggleFilter = (key: string, value: string) => {
  store.toggleFilter(key, value)
}

const labelFor = (key: string) =>
  key.replace(/\./g, ' · ').replace(/_/g, ' ')
</script>

<template>
  <div class="fixed inset-0 bg-white z-50 overflow-y-auto max-w-3xl mx-auto">
    <div class="flex justify-between items-center p-4">
      <h1 class="text-xl">Filter</h1>
      <div class="flex gap-4">
        <button v-if="Object.keys(store.filters).length" @click="store.clearFilters()" class="btn btn-secondary">Zurücksetzen</button>
        <button @click="store.setFilterVisible(false)" class="btn btn-secondary">Schließen</button>
      </div>
    </div>

    <div class="p-4 space-y-6">
      <div v-for="(options, key) in flatOptions" :key="key">
        <h2 class="text-stone-700 mb-2 capitalize">{{ labelFor(key) }}</h2>
        <div class="flex flex-wrap gap-2">
          <button v-for="option in options" :key="`${key}:${option}`" @click="toggleFilter(key, option)" :class="[
            'px-3 py-1 text-sm rounded-full border',
            getFilter(key).includes(option)
              ? 'bg-amber-600 text-white border-amber-600'
              : 'text-stone-600 border-stone-300'
          ]">
            {{ option }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
