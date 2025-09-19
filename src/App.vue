<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useStore } from './stores/store';

const store = useStore()
</script>

<template>
  <router-view v-slot="{ Component }">
    <keep-alive include="HomeView">
      <component :is="Component" />
    </keep-alive>
  </router-view>
  <div class="max-w-xl mx-auto mt-4 py-2 border-t-1 border-gray-300">
    <router-link to="/disclaimer" class="link text-sm">Haftungsauschluss</router-link>
  </div>
</template>
