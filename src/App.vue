<script setup lang="ts">
import { ref } from 'vue'
import Card from './components/Card.vue'
import FilterIcon from '@/assets/filter.svg'
import FilterPage from './components/FilterPage.vue'
import { useStore } from '@/stores/store'

const store = useStore()

// Load shrooms data into store
fetch('/data/shrooms.json')
  .then(res => res.json())
  .then(data => store.setShrooms(data))

// Search input with debounce
const searchInput = ref('')

function onInput(e: Event) {
  const value = (e.target as HTMLInputElement).value
  searchInput.value = value
}

function applySearch() {
  store.setSearch(searchInput.value)
}

function clearSearch() {
  searchInput.value = ''
  store.setSearch('')
}
</script>

<template>
  <FilterPage v-if="store.filterVisible" />

  <div class="max-w-xl md:mx-auto text-stone-900 flex flex-col h-screen">
    <div class="mb-4 flex gap-2 flex-col">
      <h1 class="text-2xl md:text-3xl font-bold">🍄‍ Shroomy</h1>
      <h2 class="hidden md:block text-xl text-stone-600">Schnelle und einfache Pilzsuche</h2>
    </div>

    <!-- Search Bar -->
    <div class="flex items-center gap-2 mb-2 relative">
      <input :value="searchInput" @input="onInput" @keyup.enter="applySearch" placeholder="Suche nach Namen (de, lat.)"
        class="w-full px-4 py-2 border border-stone-300 rounded-lg bg-stone-50 text-stone-800 placeholder-stone-400 focus:outline-none focus:ring focus:ring-amber-400" />
      <button v-if="searchInput" @click="clearSearch"
        class="cursor-pointer absolute right-28 top-1/2 transform -translate-y-1/2 text-stone-400 hover:text-stone-600"
        aria-label="Clear search">
        ✕
      </button>
      <button @click="applySearch" class="btn btn-primary">
        Suchen
      </button>
    </div>

    <!-- Filter Button -->
    <button @click="store.setFilterVisible(true)"
      class="btn btn-secondary mb-4 flex items-center gap-2 self-start w-fit">
      <FilterIcon class="w-5 h-5" />
      Filter
      <div v-if="store.totalFilters > 0"
        class="w-4 h-4 leading-4 text-xs font-bold inline-block rounded-full bg-amber-600 text-white">
        {{ store.totalFilters }}
      </div>
    </button>

    <!-- Results Wrapper -->
    <div class="flex-1 overflow-y-auto">
      <div v-if="store.filteredShrooms.length > 0 && store.filteredShrooms.length < 3000">
        <div class="text-sm text-stone-500 mb-2">
          {{ store.filteredShrooms.length }} Treffer
        </div>
        <div class="flex flex-col gap-2">
          <Card v-for="shroom in store.filteredShrooms" :key="shroom.url" :shroom="shroom" />
        </div>
      </div>
      <div v-else-if="!store.search.trim()" class="text-stone-400">
        Gib einen Suchbegriff ein.
      </div>
      <div v-else-if="store.filteredShrooms.length === 0" class="text-stone-500">
        Keine Pilze gefunden.
      </div>
    </div>
  </div>

</template>
