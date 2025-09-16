<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { Combobox, ComboboxInput, ComboboxOptions, ComboboxOption } from '@headlessui/vue'
import DeleteIcon from '@/assets/delete.svg'
import FilterIcon from '@/assets/filter.svg'
import { useStore } from '@/stores/store'

const store = useStore()
const query = ref('')
const selected = ref('')

const UNIQUE_NAMES = computed(() => {
  return Array.from(new Set(store.shrooms
    .flatMap(shroom => {
      const nameParts = shroom.name ? shroom.name.split(' ') : []
      return [...nameParts, shroom.preferred_common_name].filter(Boolean)
    })
    .map(n => n.toLowerCase())
  ))
})

const suggestions = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return []

  const uniqueNames = UNIQUE_NAMES.value.filter(n => n.includes(q))

  // Assign scoring function: exact match highest, then startsWith, then includes
  function score(name: string): number {
    if (name === q) return 3
    if (name.startsWith(q)) return 2
    if (name.includes(q)) return 1
    return 0
  }

  // Sort by score descending, then alphabetically
  const sorted = uniqueNames.sort((a, b) => {
    const diff = score(b) - score(a)
    return diff !== 0 ? diff : a.localeCompare(b)
  })

  // Limit to 8 suggestions
  return sorted.slice(0, 8)
})



// When selected changes, update search
watch(selected, (val) => {
  if (val) {
    store.setSearch(val)
    query.value = val
  }
})

function applySearch(val?: string) {
  const searchVal = val ?? query.value
  store.setSearch(searchVal)
  selected.value = searchVal
  query.value = searchVal
}

function clearSearch() {
  query.value = ''
  selected.value = ''
  store.setSearch('')
}

// Change search if genus search from detail page
watch(() => store.search, (newSearch) => {
  if (newSearch !== query.value) {
    query.value = newSearch
  }
})
</script>

<template>
  <!-- Search Bar -->
  <div class="flex items-center gap-2 mb-2 relative">
    <div class="w-full relative">
      <Combobox v-model="selected" nullable>
        <ComboboxInput :displayValue="(val) => typeof val === 'string' ? val : ''" :value="query"
          @input="query = $event.target.value" placeholder="Suche nach Namen (de, lat.)"
          class="w-full px-4 py-2 border border-stone-300 rounded-lg bg-stone-50 text-stone-800 placeholder-stone-400 focus:outline-none focus:ring focus:ring-amber-400"
          @keyup.enter="applySearch()" />
        <button v-if="query" @click="clearSearch"
          class="cursor-pointer absolute right-2 top-1/2 transform -translate-y-1/2 text-stone-400 hover:text-stone-600"
          aria-label="Clear search" type="button">
          ✕
        </button>
        <ComboboxOptions
          class="absolute left-0 right-0 mt-1 bg-white border border-stone-300 rounded-lg shadow z-10 max-h-48 overflow-y-auto">
          <ComboboxOption v-for="option in suggestions" :key="option" :value="option"
            v-slot="{ active, selected, disabled }">
            <span :class="[
              'block px-4 py-2 cursor-pointer',
              active ? 'bg-amber-100 text-amber-700 font-semibold' : '',
              selected ? 'font-bold' : ''
            ]">{{ option }}</span>
          </ComboboxOption>
        </ComboboxOptions>
      </Combobox>
    </div>
    <button @click="applySearch()" class="btn btn-primary">
      Suchen
    </button>
  </div>
  <!-- Filter Button -->
  <div class="flex items-center mb-4">
    <router-link to="/filter" class="self-start w-fit btn btn-secondary h-11"
      :class="{ '!rounded-r-none': store.filtersActive }">
      <FilterIcon class="w-5 h-5" />
      Filter
      <div v-if="store.totalFilters > 0"
        class="w-4 h-4 leading-4 text-xs font-bold rounded-full bg-amber-600 text-white text-center">
        {{ store.totalFilters }}
      </div>
    </router-link>
    <button v-if="store.filtersActive" class="h-11 btn btn-secondary"
      :class="{ '!rounded-l-none !border-l-0': store.filtersActive }" @click="store.clearFilters()" type="button">
      <DeleteIcon class="w-5 h-5 text-amber-600" />
    </button>
  </div>
</template>
