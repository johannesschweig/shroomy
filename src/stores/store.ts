import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useStore = defineStore('store', {
  state: () => ({
    filterVisible: false,
    filters: {} as Record<string, string[]>,
    search: '' as string,
    shrooms: [] as any[] // replace `any[]` with your Mushroom type if available
  }),
  getters: {
    totalFilters(state) {
      return Object.values(state.filters).reduce((sum, arr) => sum + arr.length, 0)
    },
    filteredShrooms(state) {
      const q = state.search.trim().toLowerCase()

      return state.shrooms.filter(shroom => {
        // ✅ Search condition
        const matchesSearch =
          !q ||
          (shroom.name.de.join(' ').toLowerCase().includes(q)) ||
          (shroom.name.lat.join(' ').toLowerCase().includes(q))

        // ✅ Filter condition
        const matchesFilters = Object.entries(state.filters).every(([key, values]) => {
          if (!values.length) return true // skip empty
          const val = getNestedValue(shroom, key)
          if (Array.isArray(val)) {
            return values.some(v => val.includes(v))
          }
          return values.includes(val)
        })

        return matchesSearch && matchesFilters
      })
    }
  },
  actions: {
    toggleFilter(key: string, value: string) {
      if (!this.filters[key]) this.filters[key] = []
      const idx = this.filters[key].indexOf(value)
      if (idx >= 0) {
        this.filters[key].splice(idx, 1)
      } else {
        this.filters[key].push(value)
      }
    },
    clearFilters() {
      this.filters = {}
    },
    setFilterVisible(visible: boolean) {
      this.filterVisible = visible
    },
    setSearch(query: string) {
      this.search = query
    },
    setShrooms(data: any[]) {
      this.shrooms = data
    }
  }
})

// ✅ Helper for nested keys like "cap.color" or "gills.attachment"
function getNestedValue(obj: any, path: string) {
  return path.split('.').reduce((acc, key) => (acc ? acc[key] : undefined), obj)
}

