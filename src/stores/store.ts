import { defineStore } from 'pinia'
import type Shroom from '@/types/Shroom'

export const useStore = defineStore('store', {
  state: () => ({
    isLoading: false,
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

      return state.shrooms.filter((shroom: Shroom) => {
        // Search condition
        const matchesSearch =
          !q ||
          (shroom.preferred_common_name?.toLowerCase().includes(q)) ||
          (shroom.name?.toLowerCase().includes(q))

        // Attribute filters (must match ALL values for a given key)
        const matchesFilters = Object.entries(state.filters).every(([key, values]) => {
          if (!values.length) return true
          const val = getNestedValue(shroom, key)

          if (Array.isArray(val)) {
            return values.every(v => val.includes(v)) // all selected values must be present
          }
          return values.every(v => v === val) // must match exactly if scalar
        })

        // Month filter
        const matchesMonth =
          Array.isArray(shroom.season) &&
          shroom.season[0] <= state.monthTo &&
          shroom.season[1] >= state.monthFrom

        // Size filter
        const size = shroom.size || { min_diameter_cm: 1, max_diameter_cm: 100 }
        let matchesSize = true
        if (state.sizeCm > 0) {
          matchesSize =
            Array.isArray(size) &&
            state.sizeCm >= size[0] &&
            state.sizeCm <= size[1]
        }

        return matchesSearch && matchesFilters && matchesMonth && matchesSize
      })
    }
    ,
    getMatches() {
      return (attributePath: string, value?: string) => {
        const keys = attributePath.split('.')

        return this.filteredShrooms.filter((shroom: any) => {
          let current: any = shroom
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
    filtersActive(state) {
      return Object.keys(state.filters).length
    }
  },
  actions: {
    toggleFilter(key: string, value: string) {
      if (!this.filters[key]) this.filters[key] = []
      const idx = this.filters[key].indexOf(value)
      if (idx >= 0) {
        this.filters[key].splice(idx, 1)
        // if last filter for this key was removed, delete the key
        if (this.filters[key].length === 0) {
          delete this.filters[key]
        }
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
    setSearch(query: string) {
      this.search = query
    },
    setShrooms(data: any[]) {
    },
    setMonthFilter(from: number, to: number) {
      this.monthFrom = from
      this.monthTo = to
    },
    setSizeCm(val: number) {
      this.sizeCm = val
    },
    async loadShrooms() {
      this.isLoading = true
      try {
        // Load shrooms data into store
        fetch('/data/shrooms.json')
          .then(res => res.json())
          .then(data => {
            this.shrooms = data
            console.log(`Loaded ${this.shrooms.length} shrooms`)
          })
      } finally {
        this.isLoading = false
      }
    }
  }
})

// Helper for nested keys like "cap.color" or "gills.attachment"
function getNestedValue(obj: any, path: string) {
  return path.split('.').reduce((acc, key) => (acc ? acc[key] : undefined), obj)
}

