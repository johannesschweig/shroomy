<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { capitalize } from './utils'
import MushroomIcon from './assets/mushroom.svg'

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
  }, 2000) // adjust delay as needed (ms)
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
    (s.name_de?.join(' ').toLowerCase().includes(q) || '') ||
    (s.name_lat?.join(' ').toLowerCase().includes(q) || '')
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

      <button @click="applySearch"
        class="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors cursor-pointer">
        Suchen
      </button>
    </div>
    <div v-if="!search.trim()" class="text-stone-400">
      Gib einen Suchbegriff ein.
    </div>
    <div v-else-if="filteredShrooms.length === 0" class="text-stone-500">
      Keine Pilze gefunden.
    </div>

    <div v-if="filteredShrooms.length > 0" class="flex flex-col gap-2">
      <div class="text-sm text-stone-500">{{ filteredShrooms.length }} Treffer</div>
      <a v-for="shroom in filteredShrooms" :href="shroom.url" target="_blank" :key="shroom.url"
        class="flex items-center hover:bg-stone-100 rounded-lg">
        <img :src="shroom.photo_url" alt="mushroom" loading="lazy" class="w-20 h-20 object-cover mr-4 rounded-lg"
          v-if="shroom.photo_url" />
        <div v-else class="w-20 h-20 bg-stone-200 mr-4 rounded-lg flex items-center justify-center">
          <MushroomIcon class="w-12 h-12 text-stone-400" />
        </div>

        <div>
          <div class="text-lg text-slate-900 font-semibold">
            {{ shroom.name_de?.[0] || 'No Name' }}
          </div>
          <div class="italic text-stone-500">
            {{ capitalize(shroom.name_lat?.[0].split(' ').slice(0, 2).join(' ')) || 'No Latin Name' }}
          </div>
        </div>
      </a>
    </div>
  </div>
</template>
