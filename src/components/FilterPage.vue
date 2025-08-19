<script setup lang="ts">
import { computed, ref } from 'vue'
import { useStore } from '@/stores/store'
import { capitalize } from '@/utils'

const store = useStore()

// Nested options (unchanged)
const allOptions = {
  edibility: ['excellent', 'good', 'inedible'],
  toxicity: ['toxic', 'deadly'],
  smell: ['anise', 'mushroomy', 'sweet', 'earthy', 'radish', 'marzipan', 'putrid', 'fishy', 'floral'],
  taste: ['mild', 'bitter', 'spicy', 'mushroomy', 'other'],
  cap: {
    color: ['white', 'yellow', 'orange', 'red', 'pink', 'brown', 'black', 'gray', 'green'],
    shape: ['round', 'flat', 'funnel', 'conical', 'coral-like', 'other'],
  },
  flesh: {
    bruising_color: ['blue', 'brown', 'yellow', 'gray', 'green', 'red', 'none'],
    color: ['white', 'yellow', 'orange', 'red', 'pink', 'brown', 'black', 'gray', 'green'],
  },
  gills: {
    color: ['white', 'yellow', 'orange', 'red', 'pink', 'brown', 'black', 'gray', 'green'],
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

// Month slider state
const monthRange = ref([store.monthFrom ?? 1, store.monthTo ?? 12])
function updateMonthRange([from, to]: [number, number]) {
  monthRange.value = [from, to]
  store.setMonthFilter(from, to)
}

const selectedSize = ref(store.sizeCm ?? 0)
function updateSize(val: number) {
  selectedSize.value = val
  store.setSizeCm(val)
}
</script>

<template>
  <div class="fixed inset-0 bg-white z-50 overflow-y-auto max-w-3xl mx-auto">
    <div class="flex justify-between items-center p-4">
      <h1 class="text-xl">Filter</h1>
      <div class="flex gap-4">
        <button v-if="Object.keys(store.filters).length" @click="store.clearFilters()"
          class="btn btn-secondary">Zurücksetzen</button>
        <button @click="store.setFilterVisible(false)" class="btn btn-secondary">Schließen</button>
      </div>
    </div>

    <div class="p-4 space-y-6">
      <!-- ...existing filter buttons... -->
      <div v-for="(options, key) in flatOptions" :key="key">
        <h2 class="text-stone-700 mb-2 capitalize">{{ $t(key) }}</h2>
        <div class="flex flex-wrap gap-2">
          <button v-for="option in options" :key="`${key}:${option}`" @click="toggleFilter(key, option)" :class="[
            'px-3 py-1 text-sm rounded-full border cursor-pointer',
            getFilter(key).includes(option)
              ? 'bg-amber-600 text-white border-amber-600'
              : 'text-stone-600 border-stone-300'
          ]">
            {{ capitalize($t(option)) }}
          </button>
        </div>
      </div>

      <!-- Month slider -->
      <div>
        <h2 class="text-stone-700 mb-2">Monat</h2>
        <div class="flex items-center gap-2">
          <span>{{ monthRange[0] }}</span>
          <input type="range" min="1" max="12" :value="monthRange[0]"
            @input="updateMonthRange([($event.target as HTMLInputElement)?.valueAsNumber || 1, monthRange[1]])" />
          <span>-</span>
          <input type="range" min="1" max="12" :value="monthRange[1]"
            @input="updateMonthRange([monthRange[0], ($event.target && ($event.target as HTMLInputElement).valueAsNumber) || 1])" />
          <span>{{ monthRange[1] }}</span>
        </div>
      </div>

      <!-- Size input -->
      <div>
        <h2 class="text-stone-700 mb-2">Größe (cm)</h2>
        <div class="flex items-center gap-2">
          <input type="number" min="0" max="100" :value="selectedSize" @input="updateSize(($event.target && ($event.target as HTMLInputElement).valueAsNumber) || 1)"
            class="border rounded px-2 py-1 w-24" placeholder="cm" />
          <span class="text-stone-500 text-sm">0 = beliebig</span>
        </div>
      </div>
    </div>
  </div>
</template>
