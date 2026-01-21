<script setup lang="ts">
const props = defineProps({
  activeSeason: {
    type: String,
    default: 'all'
  },
  // Use /top-edible or /season
  basePath: {
    type: String,
    default: '/season'
  }
})

// slugs are English for routing, labels are German for the user
const seasons = computed(() => {
  const labels = [
    { label: 'Alle anzeigen', slug: 'all' },
    { label: 'Frühling', slug: 'spring' },
    { label: 'Sommer', slug: 'summer' },
    { label: 'Herbst', slug: 'autumn' },
    { label: 'Winter', slug: 'winter' }
  ]
  return props.basePath === '/season'
    ? labels.slice(1)
    : labels
})


const getRoute = (slug: string) => {
  if (slug === 'all') {
    return props.basePath;
  }
  // Construct the URL like /season/spring or /top-edible/summer
  return `${props.basePath}/${slug}`;
}
</script>

<template>
  <div class="bg-white border border-tan-200 rounded-2xl p-2 inline-flex flex-wrap gap-1 shadow-sm">
    <NuxtLink v-for="season in seasons" :key="season.slug" :to="getRoute(season.slug)"
      class="px-5 py-2 rounded-xl transition-all duration-200 font-sans text-sm font-medium" :class="[
        activeSeason === season.slug
          ? 'bg-tan-900 text-white shadow-sm'
          : 'bg-transparent text-tan-700 hover:bg-tan-50'
      ]">
      {{ season.label }}
    </NuxtLink>
  </div>
</template>
