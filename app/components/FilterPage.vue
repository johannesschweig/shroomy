<script setup lang="ts">
import { useStore } from '@/stores/store'
import TypeFilter from './TypeFilter.vue'
import ColorFilter from './ColorFilter.vue'
import FilterOptionButton from './FilterOptionButton.vue'
import { colors, stem_traits, bruising_colors, gills_traits } from '@/types/Shroom'

const store = useStore()

</script>

<template>
  <div class="fixed inset-0 bg-white z-50  max-w-3xl mx-auto">
    <div class="flex justify-between items-center p-4 h-21">
      <div>
        <h1 class="text-xl">Filter</h1>
        <span v-if="store.filteredShrooms.length < 3000" class="text-sm text-stone-500">{{ store.filteredShrooms.length
        }} Ergebisse</span>
      </div>
      <div class="flex gap-4">
        <button v-if="store.filtersActive" @click="store.clearFilters()"
          class="btn btn-secondary">Zurücksetzen</button>
        <NuxtLink to="/" class="btn btn-secondary">Schließen</NuxtLink>
      </div>
    </div>
    <!-- {{ store.filters }} -->
    <div class="overflow-y-auto h-8/10">
      <div class="p-4 space-y-6">
        <TypeFilter />
        <ColorFilter type="cap.color" :colors="[...colors]" />
        <div>
          <ColorFilter type="gills.color" :colors="[...colors]" />
          <div class="text-stone-700 text-sm mt-3 mb-2">Merkmale</div>
          <div class="flex gap-1 flex-row flex-wrap">
            <FilterOptionButton v-for='option in [...gills_traits]' filterKey="gills.traits" :optionValue="option" />
          </div>
        </div>
        <div>
          <ColorFilter type="stem.color" :colors="[...colors]" />
          <div class="text-stone-700 text-sm mt-3 mb-2">Merkmale</div>
          <div class="flex gap-1 flex-row flex-wrap">
            <FilterOptionButton v-for='option in [...stem_traits]' filterKey="stem.traits" :optionValue="option" />
          </div>
        </div>
        <ColorFilter type="flesh.color" :colors="[...colors]" />
        <ColorFilter type="flesh.bruising_color" :colors="[...bruising_colors]" />
      </div>
    </div>
  </div>
</template>