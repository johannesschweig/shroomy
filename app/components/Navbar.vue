<script setup lang="ts">
import Arrow from '@/assets/arrow.svg'
const route = useRoute()
const router = useRouter()

const isHome = computed(() => route.path === '/')

function goBack() {
  if (window.history.state.back) {
    router.back()
  } else {
    router.push('/') // Fallback zur Startseite
  }
}
</script>

<template>
  <div class="bg-white border-b border-tan-300 h-16 py-auto flex items-center">
    <div class="max-w-7xl mx-auto px-4 xl:px-0 flex gap-3 items-center w-full">
      <button v-if="!isHome" @click="goBack" class="flex cursor-pointer p-3 bg-white hover:bg-tan-100 w-fit">
        <Arrow class="w-4 h-4" />
      </button>
      <div v-if="!isHome" class="h-6 w-px bg-tan-300"></div>
      <NuxtLink to="/" class="flex gap-2 items-center">
        <img src="/mushroom.png" alt="Fungio Logo" class="w-8 h-8 inline-block text-tan-100" />
        <div class="text-lg font-bold font-serif text-tan-900">Fungio</div>
      </NuxtLink>
    </div>
  </div>
</template>