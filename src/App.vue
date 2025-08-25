<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <router-view v-slot="{ Component, route }">
    <keep-alive>
      <component v-if="route.name === 'home'" :is="Component" />
      <component v-else :is="Component" />
    </keep-alive>
  </router-view>
</template>
