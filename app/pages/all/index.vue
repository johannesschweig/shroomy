<script setup lang="ts">
import { useLetterCounts } from '@/composables/composables'
import { GERMAN_ALPHABET } from '@/utils/utils'

const { letterStats, totalCount } = useLetterCounts()


const title = 'Alle Pilze - Fungio'
const description = () => `Vollständige Übersicht aller ${totalCount.value} Pilzarten in der Fungio-Datenbank. Nach Alphabet sortiert.`
const image = 'https://fungio.de/mushroom.png'
const url = 'https://fungio.de/all'

useSeoMeta({
  title,
  ogTitle: title,
  description,
  ogDescription: description,
  ogUrl: url,
  ogImage: image,
  ogType: 'article'
})

const alphabet = GERMAN_ALPHABET.split('')
</script>

<template>
  <div class="max-w-7xl mx-auto">
    <h1 class="text-2xl font-bold mb-2">Alle Pilze auf Fungio</h1>
    <p class="text-stone-600 mb-6">{{ totalCount }} Pilzarten nach Alphabet sortiert</p>
    
    <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
      <NuxtLink
        v-for="letter in alphabet"
        :key="letter"
        :to="`/all/${letter.toLowerCase()}`"
        class="block p-4 border-2 border-stone-200 rounded-lg hover:border-amber-500 hover:bg-amber-50 transition-all"
      >
        <div class="text-3xl font-bold text-amber-600">{{ letter }}</div>
        <div class="text-sm text-stone-600">
          {{ letterStats?.[letter] || 0 }} Arten
        </div>
      </NuxtLink>
    </div>
  </div>
</template>