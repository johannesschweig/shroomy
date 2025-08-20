import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useStore = defineStore('store', {
  state: () => ({
    filterVisible: false,
    filters: {} as Record<string, string[]>,
    search: '' as string,
    shrooms: [] as any[],
    monthFrom: 1,
    monthTo: 12,
    sizeCm: 0 // 0 means "not set"
  }),
  getters: {
    totalFilters(state) {
      return Object.values(state.filters).reduce((sum, arr) => sum + arr.length, 0)
    },
    filteredShrooms(state) {
      const q = state.search.trim().toLowerCase()

      return state.shrooms.filter(shroom => {
        // Search condition
        const matchesSearch =
          !q ||
          (shroom.name.de.join(' ').toLowerCase().includes(q)) ||
          (shroom.taxon_name.toLowerCase().includes(q))

        // Attribute filters
        const matchesFilters = Object.entries(state.filters).every(([key, values]) => {
          if (!values.length) return true
          const val = getNestedValue(shroom, key)
          if (Array.isArray(val)) {
            return values.some(v => val.includes(v))
          }
          return values.includes(val)
        })

        // Month filter
        const season = shroom.season || { from: 1, to: 12 }
        const matchesMonth =
          season.from <= state.monthTo && season.to >= state.monthFrom

        // Size filter
        const size = shroom.size || { min_diameter_cm: 1, max_diameter_cm: 100 }
        let matchesSize = true
        if (state.sizeCm > 0) {
          matchesSize =
            state.sizeCm >= size.min_diameter_cm &&
            state.sizeCm <= size.max_diameter_cm
        }

        return matchesSearch && matchesFilters && matchesMonth && matchesSize
      })
    },
    getMatches: (state) => (attributePath: string, value?: string) => {
      const keys = attributePath.split('.')

      return state.filteredShrooms.filter((shroom: any) => {
        let current = shroom
        for (const key of keys) {
          if (current && typeof current === 'object') {
            current = current[key]
          } else {
            return false
          }
        }

        if (Array.isArray(current)) {
          return value ? current.includes(value) : current.length > 0
        }

        return value ? current === value : current != null
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
      this.monthFrom = 1
      this.monthTo = 12
      this.sizeCm = 0
    },
    setFilterVisible(visible: boolean) {
      this.filterVisible = visible
    },
    setSearch(query: string) {
      this.search = query
    },
    setShrooms(data: any[]) {
      this.shrooms = data.filter(shroom => shroom.taxon_name)
    },
    setMonthFilter(from: number, to: number) {
      this.monthFrom = from
      this.monthTo = to
    },
    setSizeCm(val: number) {
      this.sizeCm = val
    }
  }
})

// Helper for nested keys like "cap.color" or "gills.attachment"
function getNestedValue(obj: any, path: string) {
  return path.split('.').reduce((acc, key) => (acc ? acc[key] : undefined), obj)
}

