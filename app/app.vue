<script setup lang="ts">
import Footer from '@/components/Footer.vue'
import Navbar from '@/components/Navbar.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <Navbar />
    <div class="px-4 xl:px-0 py-4 bg-tan-50 grow">
      <NuxtPage />
    </div>
    <Footer />
  </div>
</template>
