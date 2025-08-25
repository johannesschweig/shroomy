<script setup lang="ts">
import { RouterView } from 'vue-router'
import { onMounted } from 'vue'
import { useStore } from '@/stores/store'

const store = useStore()

onMounted(() => {
  // Load shrooms data into store
  fetch('/data/shrooms.json')
    .then(res => res.json())
    .then(data => store.setShrooms(data))
})

</script>

<template>
  <router-view v-slot="{ Component }">
    <keep-alive include="HomeView">
      <component :is="Component" />
    </keep-alive>
  </router-view>
</template>
