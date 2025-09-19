import { defineStore } from 'pinia'
import type Shroom from '@/types/Shroom'
import { supabase } from '@/supabase'

export const useStore = defineStore('store', {
  state: () => ({
    filters: {} as Record<string, string[]>,
    search: '',
    filteredShrooms: [] as Shroom[],
  }),
  getters: {
    totalFilters(state) {
      return Object.values(state.filters).reduce((sum, arr) => sum + arr.length, 0)
    },
    // filteredShrooms(state) {
    //   const q = state.search.trim().toLowerCase()
    //   const { filteredShrooms } = useSearchShrooms(q)
    //   return filteredShrooms.value


      // return state.shrooms.filter((shroom: Shroom) => {
      //   // Search condition
      //   const matchesSearch =
      //     !q ||
      //     (shroom.preferred_common_name?.toLowerCase().includes(q)) ||
      //     (shroom.name?.toLowerCase().includes(q))

      //   // Attribute filters (must match ALL values for a given key)
      //   const matchesFilters = Object.entries(state.filters).every(([key, values]) => {
      //     if (!values.length) return true
      //     const val = getNestedValue(shroom, key)

      //     if (Array.isArray(val)) {
      //       return values.every(v => val.includes(v)) // all selected values must be present
      //     }
      //     return values.every(v => v === val) // must match exactly if scalar
      //   })

      //   return matchesSearch && matchesFilters
      // })
    // },
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
    },
    async getMushroomsOfTheDay() {
      const { data, error } = await supabase
        .from('fungi')
        .select('*')
        .limit(12)

      if (error) {
        console.error('Supabase fetch error:', error)
        return []
      }
      console.log('Fetched mushrooms:', data)

      return data ?? []
    }
  }
})

// Helper for nested keys like "cap.color" or "gills.attachment"
function getNestedValue(obj: any, path: string) {
  return path.split('.').reduce((acc, key) => (acc ? acc[key] : undefined), obj)
}

