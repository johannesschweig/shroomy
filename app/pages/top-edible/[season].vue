<script setup lang="ts">
import SeasonFilter from '@/components/SeasonFilter.vue'
import Card from '@/components/Card.vue'


const route = useRoute()

const activeSeason = computed(() => {
  const param = String(route.params.season).toLowerCase()
  return ['all', 'spring', 'summer', 'autumn', 'winter'].includes(param) ? param : 'all'
})

const { mushrooms } = useTopEdibleMushrooms(activeSeason)
</script>
<template>
  <div class="bg-tan-50 min-h-screen pb-20">
    <div class="max-w-7xl mx-auto px-4 xl:px-0">

      <header class="pt-16 pb-12 max-w-2xl">
        <h1 class="font-serif text-5xl text-tan-900 leading-tight">
          Die 10 besten Speisepilze
        </h1>
        <p class="mt-6 font-sans text-tan-700 leading-relaxed">
          Entdecken Sie die geschmackvollsten Pilze unserer heimischen Wälder.
          Von nussigen Steinpilzen bis zu delikaten Pfifferlingen – ein Guide für Sammler und Gourmets.
        </p>

        <div class="mt-10 flex justify-start">
          <SeasonFilter :active-season="activeSeason" :base-path="'/top-edible'" />
        </div>
      </header>

      <div class="bg-amber-50 border-l-4 border-amber-500 p-6 mb-10 rounded-r-xl">
        <div class="flex items-start gap-3">
          <span class="text-amber-600 font-bold text-xl">⚠️</span>
          <div>
            <h4 class="font-sans font-bold text-amber-900 text-sm uppercase tracking-wider">
              Wichtiger Sicherheitshinweis
            </h4>
            <p class="mt-1 font-sans text-amber-800 text-sm leading-relaxed">
              Essen Sie niemals Pilze, die Sie nicht zu 100% sicher bestimmt haben. Diese Liste dient nur zur
              Information und ersetzt keine professionelle Pilzberatung. Im Zweifel: Stehen lassen!
            </p>
          </div>
        </div>
      </div>

      <main class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mt-12">
        <div v-for="(mushroom, index) in mushrooms" :key="mushroom.id" class="relative group">
          <div
            class="absolute top-0 left-0 z-10 bg-white/90 border border-tan-200 px-2 py-1 rounded-lg font-serif text-tan-900 font-bold text-sm">
            #{{ index + 1 }}
          </div>

          <Card :key="mushroom.id" :shroom="mushroom" />
        </div>
      </main>

    </div>
  </div>
</template>
