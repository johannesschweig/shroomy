<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import Card from './components/Card.vue'

const shrooms = ref<any[]>([])
fetch('/data/shrooms.json')
  .then(res => res.json())
  .then(data => shrooms.value = data)

const searchInput = ref('')
const search = ref('')
let debounceTimer: any = null

function onInput(e: Event) {
  const value = (e.target as HTMLInputElement).value
  searchInput.value = value
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    search.value = value
  }, 1000) // adjust delay as needed (ms)
}

function applySearch() {
  clearTimeout(debounceTimer)
  search.value = searchInput.value
}

const filteredShrooms = computed(() => {
  const q = search.value.trim().toLowerCase()
  if (!q) return []
  console.log('Filtering shrooms with search:', search.value)
  return shrooms.value.filter(s =>
    (s.name.de.join(' ').toLowerCase().includes(q) || '') ||
    (s.name.lat.join(' ').toLowerCase().includes(q) || '')
  )
})
</script>


<template>
  <div class="max-w-xl mx-auto p-1 md:p-4 text-stone-900">
    <h1 class="text-3xl font-bold mb-2">🍄‍ Shroomy</h1>
    <h2 class="text-xl text-stone-600 mb-4">Schnelle und einfache Pilzsuche</h2>

    <div class="flex items-center gap-2 mb-4 relative">
      <input :value="searchInput" @input="onInput" @keyup.enter="applySearch"
        placeholder="Suche nach Namen oder lateinischem Namen..."
        class="w-full px-4 py-2 border border-stone-300 rounded-lg bg-stone-50 text-stone-800 placeholder-stone-400 focus:outline-none focus:ring focus:ring-amber-400">
      </input>
      <button v-if="searchInput" @click="() => { searchInput = ''; search = '' }"
        class="curor-pointer absolute right-28 top-1/2 transform -translate-y-1/2 text-stone-400 hover:text-stone-600"
        aria-label="Clear search">
        ✕
      </button>

      <button @click="applySearch" class="btn btn-primary">
        Suchen
      </button>
    </div>
    <button @click="" class="btn btn-secondary">
      Filter
    </button>
    <div v-if="!search.trim()" class="text-stone-400">
      Gib einen Suchbegriff ein.
    </div>
    <div v-else-if="filteredShrooms.length === 0" class="text-stone-500">
      Keine Pilze gefunden.
    </div>

    <div v-if="filteredShrooms.length > 0" class="flex flex-col gap-2">
      <div class="text-sm text-stone-500">{{ filteredShrooms.length }} Treffer</div>
      <Card v-for="shroom in filteredShrooms" :shroom="shroom" />
    </div>
  </div>
</template>
