<script setup lang="ts">
import { useAllOrders } from '@/composables/composables'
import { getTaxonUrl, capitalizeFirstLetter } from '@/utils/utils'

defineOptions({ name: 'TaxaOverview' })

const { orders, loading } = useAllOrders()

const title = 'Pilz-Taxonomie: Alle Ordnungen | Fungio'
const description = 'Entdecke alle Pilz-Ordnungen und ihre Familien, Gattungen und Arten im Überblick.'

useSeoMeta({
  title,
  ogTitle: title,
  description,
  ogDescription: description,
  ogUrl: 'https://fungio.de/taxa',
  ogType: 'website'
})
</script>

<template>
  <div class="bg-tan-50 min-h-screen pb-20">
    <div class="max-w-7xl mx-auto px-4 xl:px-0">
      <header class="pt-16 pb-12 max-w-3xl">
        <nav class="mb-4">
          <NuxtLink to="/" class="text-tan-500 hover:text-tan-700 text-sm font-medium">← Zurück zur Übersicht</NuxtLink>
        </nav>
        <h1 class="font-serif text-5xl text-tan-900 leading-tight">
          Pilz-<span class="text-emerald-800">Taxonomie</span>
        </h1>
        <p class="mt-6 font-sans text-tan-700 leading-relaxed text-base">
          Alle Ordnungen im Überblick. Klicke dich von der Ordnung über die Familie bis zur Gattung durch.
        </p>
      </header>

      <div v-if="loading" class="flex justify-center py-20">
        <div class="animate-pulse text-tan-400">Lade Ordnungen...</div>
      </div>

      <main v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-16">
        <NuxtLink v-for="order in orders" :key="order.id" :to="getTaxonUrl(order)"
          class="bg-white rounded-2xl border border-tan-200 shadow-sm hover:shadow-md transition-shadow p-6">
          <h2 class="text-lg text-stone-900 font-bold font-serif">
            {{ order.preferred_common_name || capitalizeFirstLetter(order.name) }}
          </h2>
          <p v-if="order.preferred_common_name" class="text-sm italic text-stone-500 mt-1">{{ capitalizeFirstLetter(order.name) }}</p>
        </NuxtLink>
      </main>
    </div>
  </div>
</template>
