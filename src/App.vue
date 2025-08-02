<script setup lang="ts">
import { ref, computed } from 'vue'

// Load the JSON (adjust path if needed)
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
  <h1 class="text-3xl">🍄‍ Shroomy</h1>
  <h2 class="text-xl">Schnelle und einfache Pilzsuche</h2>
  <input v-model="search" placeholder="Search by name or latin name..." style="width: 100%; margin-bottom: 1em;" />
  <div v-if="filteredShrooms.length === 0">No mushrooms found.</div>
  <div v-for="shroom in filteredShrooms" :key="shroom.url" style="margin-bottom: 1.5em; display: flex; align-items: center;">
    <img
      :src="`https://www.123pilzsuche.de/${shroom.image}`"
      alt="mushroom"
      style="width: 80px; height: 80px; object-fit: cover; margin-right: 1em;"
      v-if="shroom.image"
    />
    <div>
      <a :href="shroom.url" target="_blank" style="font-weight: bold;">
        {{ shroom.name_de?.[0] || 'No Name' }}
      </a>
      <div style="font-style: italic; color: #666;">{{ shroom.name_lat?.[0] }}</div>
    </div>
  </div>
</template>

<style scoped>
input {
  padding: 0.5em;
  font-size: 1em;
}
</style>
