import { defineStore } from 'pinia'

export const useStore = defineStore('store', {
  state: () => ({
    filterVisible: false,
    filters: {} as Record<string, string[]>
  }),
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
    }
  }
})

