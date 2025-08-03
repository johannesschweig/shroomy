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
  <div class="max-w-xl mx-auto p-4">
    <h1 class="text-3xl font-bold mb-2">🍄‍ Shroomy</h1>
    <h2 class="text-xl text-gray-600 mb-4">Schnelle und einfache Pilzsuche</h2>

    <div class="flex items-center gap-2 mb-4">
        <input :value="searchInput" @input="onInput" @keyup.enter="applySearch"
         placeholder="Suche nach Namen oder lateinischem Namen..."
         class="w-full px-4 py-2 border rounded-md" />
       <button @click="applySearch"
         class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors cursor-pointer">
        Suchen
      </button>
    </div>
    <div v-if="!search.trim()" class="text-gray-400">
      Gib einen Suchbegriff ein.
    </div>
    <div v-else-if="filteredShrooms.length === 0" class="text-gray-500">
      Keine Pilze gefunden.
    </div>

    <div v-if="filteredShrooms.length > 0" class="flex flex-col gap-2">
      <div class="text-sm text-gray-500">{{ filteredShrooms.length }} Treffer</div>
      <a v-for="shroom in filteredShrooms" :href="shroom.url" target="_blank" :key="shroom.url"
        class="flex items-center hover:bg-gray-100 rounded-lg">
        <img :src="shroom.photo_url" alt="mushroom" loading="lazy" class="w-20 h-20 object-cover mr-4 rounded-lg"
          v-if="shroom.photo_url" />
        <div v-else class="w-20 h-20 bg-gray-200 mr-4 rounded-lg flex items-center justify-center">
          <MushroomIcon class="w-12 h-12 text-gray-400" />
        </div>

        <div>
          <div class="text-lg text-slate-900 font-semibold">
            {{ shroom.name_de?.[0] || 'No Name' }}
          </div>
          <div class="italic text-gray-500">
            {{ capitalize(shroom.name_lat?.[0].split(' ').slice(0, 2).join(' ')) || 'No Latin Name' }}
          </div>
        </div>
      </a>
    </div>
  </div>
</template>
