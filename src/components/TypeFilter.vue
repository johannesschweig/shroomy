<script setup lang="ts">
import { ref } from 'vue'
import { useStore } from '@/stores/store'
import { computed } from 'vue'

const store = useStore()

const POROID = "poroid"
const GILLED = "gilled"

const selectType = (type: string) => {
  // remove only
  if (selectedType.value === type) {
    store.toggleFilter("traits", type)
  } else {
    if (selectedType.value) {
      // toggle from existing
      store.toggleFilter("traits", selectedType.value)
      store.toggleFilter("traits", type)
    } else {
      // empty -> add
      store.toggleFilter("traits", type)
    }

  }
}

const selectedType = computed(() => store.filters["traits"]?.includes(POROID) ? POROID : store.filters["traits"]?.includes(GILLED) ? GILLED : null)
</script>

<template>
  <div>
    <h2 class="text-stone-700 mb-2">Typ</h2>
    <div class="flex flex-wrap">
      <button @click="selectType(GILLED)" :class="[
        'px-3 py-1 text-sm rounded-l-full border border-r-0 cursor-pointer flex items-center gap-1',
        selectedType === GILLED
          ? 'bg-amber-600 text-white border-amber-600'
          : 'text-stone-600 border-stone-300',
      ]">
        Lamellen
      </button>
      <button @click="selectType(POROID)" :class="[
        'px-3 py-1 text-sm rounded-r-full border cursor-pointer flex items-center gap-1',
        selectedType === POROID
          ? 'bg-amber-600 text-white border-amber-600'
          : 'text-stone-600 border-stone-300',
      ]">
        Röhren
      </button>
    </div>
  </div>
</template>