<script setup lang="ts">
import Footer from '@/components/Footer.vue'
import Navbar from '@/components/Navbar.vue'
</script>

<template>
  <div>
    <Navbar />
    <div class="px-4 xl:px-0 py-4 bg-tan-50">
      <NuxtPage />
    </div>
    <Footer />
  </div>
</template>
