<script setup lang="ts">
import { computed } from 'vue'
import { capitalize } from '@/utils'
import { useStore } from '@/stores/store'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  filterKey: {
    type: String,
    required: true
  },
  optionValue: {
    type: String,
    required: true
  }
})

const store = useStore()
const { t } = useI18n()

const isFiltered = computed(() => {
  return store.filters[props.filterKey]?.includes(props.optionValue) || false
})

const matchesCount = computed(() => {
  return store.getMatches(props.filterKey, props.optionValue).length
})

const toggleFilter = () => {
  store.toggleFilter(props.filterKey, props.optionValue)
}
</script>

<template>
  <button @click="toggleFilter" :class="[
    'px-3 py-1 text-sm rounded-full border cursor-pointer flex items-center gap-1',
    isFiltered
      ? 'bg-amber-600 text-white border-amber-600'
      : 'text-stone-600 border-stone-300',
    matchesCount === 0
      ? 'opacity-50 cursor-not-allowed'
      : ''
  ]" :disabled="matchesCount === 0">
    {{ capitalize(t(optionValue)) }}
    <!-- <div v-if="!isFiltered" class="w-6 h-6 bg-gray-200 text-stone-700 rounded-full flex items-center justify-center text-xs">
      {{ matchesCount > 99 ? '99' : matchesCount }}
    </div> -->
  </button>
</template>
