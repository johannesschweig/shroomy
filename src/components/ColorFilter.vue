<script setup lang="ts">
import { useStore } from '@/stores/store'
import { toTwColorClass } from '@/utils'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const store = useStore()

const props = defineProps({
  type: {
    type: String,
    required: true
  },
  colors: {
    type: Array<string>
  }
})

const DEFAULT_COLORS: string[] = ['white', 'yellow', 'orange', 'red', 'pink', 'blue', 'green', 'brown', 'grey', 'black']

const toggleColor = (color: string) => {
  store.toggleFilter(props.type, color)
}

const isSelected = (color: string) => {
  return store.filters[props.type]?.includes(color)
}

const subtitle = () => {
  var filters = store.filters[props.type] || []
  if (filters.length === 0) {
    return ''
  } else {
    return filters.map(col => t(col)).join(', ')
  }
}

const colors: string[] = props.colors ? props.colors : DEFAULT_COLORS
</script>

<template>
  <div>
    <h2 class="text-stone-700 mb-2">{{ t(props.type) }}
      <span class="text-sm text-stone-500 italic inline-block">{{ subtitle() }}</span>
    </h2>
    <div class="flex flex-wrap gap-2 items-center h-8">
      <button v-for="color in colors" :key="color" @click="toggleColor(color)"
        class="rounded-full flex items-center justify-center cursor-pointer" :class="[
          'w-6 h-6',
          toTwColorClass(color),
          { 'w-8 h-8': isSelected(color) },
          (color === 'white' || color === 'none') ? 'border border-stone-300' : ''
        ]">
        <div v-if="isSelected(color) && color !== 'none'" class="w-2 h-2 rounded-full"
          :class="color === 'white' ? 'bg-stone-400' : 'bg-white'"></div>
        <div v-if="color === 'none'" class="h-full w-px bg-stone-300 rotate-45"></div>
      </button>
    </div>
  </div>
</template>