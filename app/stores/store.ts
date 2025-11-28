import { defineStore } from 'pinia'
import type Shroom from '@/types/Shroom'

export const useStore = defineStore('store', {
  state: () => ({
    filters: {} as Record<string, string[]>,
    search: '',
    redirected: false,
    filteredShrooms: [] as Shroom[],
  }),
  getters: {
    totalFilters(state) {
      return Object.values(state.filters).reduce((sum, arr) => sum + arr.length, 0)
    },
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
    },
    setSearch(query: string) {
      this.search = query
      this.redirected = false
    },
  }
})

// Helper for nested keys like "cap.color" or "gills.attachment"
function getNestedValue(obj: any, path: string) {
  return path.split('.').reduce((acc, key) => (acc ? acc[key] : undefined), obj)
}

