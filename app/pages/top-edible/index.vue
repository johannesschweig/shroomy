<script setup lang="ts">

defineOptions({
  name: 'TopEdibleView'
})

// Get current season based on current month
function getCurrentSeason() {
  const month = new Date().getMonth() + 1 // 1-12
  if (month >= 3 && month <= 5) return 'spring'
  if (month >= 6 && month <= 8) return 'summer'
  if (month >= 9 && month <= 11) return 'autumn'
  return 'winter'
}

// Redirect to current season
navigateTo(`/top-edible/all`, { replace: true })
</script>

<template>
  <div class="min-h-screen bg-stone-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    </div>
  </div>
</template>
