<script setup lang="ts">
import { useTaxonById, useTaxonPage } from '@/composables/composables'
import { createSlug, getRankLabelKey, getRankLabelPluralKey } from '@/utils/utils'
import MushroomBreadcrumb from '@/components/mushroom-detail/MushroomBreadcrumb.vue'
import TaxonChildCard from '@/components/taxa/TaxonChildCard.vue'

defineOptions({ name: 'TaxonDetail' })

const route = useRoute()
const id = computed(() => {
  const param = String(route.params.id)
  return param.includes('-') ? Number(param.split('-')[0]) : Number(param)
})

const { taxon, loading: taxonLoading } = useTaxonById(id)
const { representativeAncestry, childEntries, childRankLevel, childrenAreSpecies, loading: childrenLoading } = useTaxonPage(taxon)

const loading = computed(() => taxonLoading.value || childrenLoading.value)

// URL & SEO logic — redirect to canonical slug once loaded, same pattern as /mushroom/[id].vue
watch(taxon, (newTaxon) => {
  if (newTaxon && route.params.id) {
    const currentParam = String(route.params.id)
    const slug = createSlug(newTaxon.preferred_common_name || newTaxon.name)
    const newParam = `${newTaxon.id}-${slug}`
    if (currentParam !== newParam) navigateTo(`/taxa/${newParam}`, { replace: true })
  }
}, { immediate: true })

const rankLabel = computed(() => taxon.value ? $t(getRankLabelKey(taxon.value.rank_level)) : '')
const childRankLabel = computed(() => childRankLevel.value !== null ? $t(getRankLabelKey(childRankLevel.value)) : '')
const childRankLabelPlural = computed(() => childRankLevel.value !== null ? $t(getRankLabelPluralKey(childRankLevel.value)) : '')

const fullUrl = computed(() => {
  if (!taxon.value) return `https://fungio.de/taxa/${id.value}`
  const slug = createSlug(taxon.value.preferred_common_name || taxon.value.name)
  return `https://fungio.de/taxa/${taxon.value.id}-${slug}`
})

const title = computed(() => {
  if (!taxon.value) return 'Taxon wird geladen... | Fungio'
  const name = taxon.value.preferred_common_name || taxon.value.name
  return `${name} (${rankLabel.value}) - Pilztaxonomie | Fungio`
})

const description = computed(() => {
  if (!taxon.value) return 'Lade Taxonomie-Informationen...'
  const name = taxon.value.preferred_common_name || taxon.value.name
  return `${name} (${taxon.value.name}): ${rankLabel.value} mit ${childEntries.value.length} ${childRankLabelPlural.value}. Übersicht und beliebte Beispielpilze.`
})

useSchemaOrg([
  () => ({
    '@type': 'Taxon',
    '@id': `${fullUrl.value}#taxon`,
    name: taxon.value?.preferred_common_name,
    scientificName: taxon.value?.name,
    taxonRank: rankLabel.value,
    description: description.value,
    url: fullUrl.value,
    mainEntityOfPage: { '@id': `${fullUrl.value}#webpage` }
  })
])

useSeoMeta({
  title,
  ogTitle: title,
  description,
  ogDescription: description,
  ogUrl: fullUrl.value,
  ogType: 'website'
})

useHead({
  link: [
    { rel: 'canonical', href: fullUrl }
  ]
})
</script>

<template>
  <div v-if="taxon" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
    <MushroomBreadcrumb :ancestry="representativeAncestry" :current-rank-level="taxon.rank_level" />

    <div>
      <span class="text-xs font-bold uppercase tracking-wider text-tan-500">{{ rankLabel }}</span>
      <h1 class="font-serif text-4xl md:text-5xl text-tan-900 leading-tight">
        {{ taxon.preferred_common_name || taxon.name }}
      </h1>
      <p class="mt-2 text-lg text-tan-500 italic font-serif">{{ taxon.name }}</p>
    </div>

    <div v-if="childrenLoading" class="flex justify-center py-20">
      <div class="animate-pulse text-tan-400">Lade {{ childRankLabelPlural }}...</div>
    </div>

    <div v-else-if="childEntries.length > 0" class="space-y-4">
      <h2 class="font-serif text-2xl text-tan-900">{{ childRankLabelPlural }} in dieser {{ rankLabel }}</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <TaxonChildCard v-for="entry in childEntries" :key="entry.id" :entry="entry" />
      </div>
    </div>

    <div v-else class="h-40 flex items-center justify-center text-tan-400">
      Keine {{ childRankLabelPlural }} gefunden.
    </div>
  </div>

  <div v-else-if="loading" class="h-96 flex items-center justify-center text-tan-400">
    Daten werden geladen...
  </div>
  <div v-else class="h-96 flex items-center justify-center text-tan-400">
    Taxon nicht gefunden.
  </div>
</template>
