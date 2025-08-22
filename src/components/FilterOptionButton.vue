<script setup lang="ts">
import { computed } from 'vue'
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
    'px-3 py-1 text-sm rounded-full border cursor-pointer flex items-center gap-1 capitalize',
    isFiltered
      ? 'bg-amber-600 text-white border-amber-600'
      : 'text-stone-600 border-stone-300',
    matchesCount === 0
      ? 'opacity-50 cursor-not-allowed'
      : ''
  ]">
    {{ t(optionValue) }}
  </button>
</template>
