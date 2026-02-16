<script setup lang="ts">
import { stateNames } from '@/utils/utils'

const props = defineProps({
  activeState: {
    type: String,
    default: 'DE-BY'
  }
})

// Convert the record into a sorted list for the UI
const regions = computed(() => {
  return Object.entries(stateNames)
    .map(([code, name]) => ({
      code: code.toLowerCase(),
      name: name,
      iso: code
    }))
    .sort((a, b) => a.name.localeCompare(b.name)) // Alphabetical sorting
})

const isOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

// Close dropdown when clicking outside
if (import.meta.client) {
  onClickOutside(dropdownRef, () => (isOpen.value = false))
}

const currentLabel = computed(() => stateNames[props.activeState] || 'Region wählen')
</script>

<template>
  <div class="relative inline-block text-left" ref="dropdownRef">
    <button
      @click="isOpen = !isOpen"
      type="button"
      class="inline-flex items-center justify-between w-64 px-5 py-3 bg-white border border-tan-200 rounded-2xl shadow-sm text-sm font-medium text-tan-900 hover:bg-tan-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-tan-500"
    >
      <span class="flex items-center gap-2">
        <span class="text-lg">📍</span>
        {{ currentLabel }}
      </span>
      <span class="transition-transform duration-200" :class="{ 'rotate-180': isOpen }">
        ▼
      </span>
    </button>

    <Transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div
        v-if="isOpen"
        class="absolute left-0 mt-2 w-72 rounded-2xl shadow-xl bg-white border border-tan-100 z-50 overflow-hidden"
      >
        <div class="max-h-80 overflow-y-auto py-2 custom-scrollbar">
          <NuxtLink
            v-for="region in regions"
            :key="region.code"
            :to="`/region/${region.code}`"
            @click="isOpen = false"
            class="block px-4 py-3 text-sm transition-colors duration-150"
            :class="[
              activeState === region.iso
                ? 'bg-tan-900 text-white font-bold'
                : 'text-tan-700 hover:bg-tan-50'
            ]"
          >
            <div class="flex justify-between items-center">
              <span>{{ region.name }}</span>
              <span v-if="activeState === region.iso" class="text-xs">Aktuell</span>
            </div>
          </NuxtLink>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #e5e7eb; /* Gray-200 */
  border-radius: 20px;
}
</style>