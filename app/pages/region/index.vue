<script setup lang="ts">
import { stateNames } from '@/utils/utils'

defineOptions({
  name: 'RegionView'
})

// In your component or a middleware
const autoNavigateRegion = async () => {
  try {
    // Using a free service like ipapi.co or ip-api.com
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();

    // ipapi returns region_code like "BY" for Bavaria
    if (data.country_code === 'DE' && data.region_code) {
      const isoCode = `DE-${data.region_code}`; // Converts "BY" to "DE-BY"

      // Navigate if we have data for that state
      if (stateNames[isoCode]) {
        await navigateTo(`/region/${isoCode.toLowerCase()}`);
      }
    }
  } catch (error) {
    console.error("Geo-navigation failed", error);
  }
}

autoNavigateRegion()
</script>

<template>
  <div class="min-h-screen bg-stone-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    </div>
  </div>
</template>
