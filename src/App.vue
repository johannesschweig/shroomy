<script setup lang="ts">
import { ref, computed } from 'vue'
import { capitalize } from './utils'

const shrooms = ref<any[]>([])
fetch('/data/shrooms.json')
  .then(res => res.json())
  .then(data => shrooms.value = data)

const search = ref('')

const filteredShrooms = computed(() => {
  if (!search.value.trim()) return shrooms.value
  const q = search.value.trim().toLowerCase()
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

    <input v-model="search" placeholder="Suche nach Namen oder lateinischem Namen..."
      class="w-full px-4 py-2 border rounded-md mb-4 focus:outline-none focus:ring focus:ring-blue-200" />

    <div v-if="filteredShrooms.length === 0" class="text-gray-500">
      Keine Pilze gefunden.
    </div>

    <div class="flex flex-col gap-2">
      <a v-for="shroom in filteredShrooms" :href="shroom.url" target="_blank" :key="shroom.url"
        class="flex items-center hover:bg-gray-100 rounded-lg">
        <!-- Uncomment if you want to use images -->
        <!-- :src="`https://www.123pilzsuche.de/${shroom.image}`" -->
        <img :src="shroom.photo_url" alt="mushroom" loading="lazy"
          class="w-20 h-20 object-cover mr-4 rounded-lg" v-if="shroom.image" />

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
