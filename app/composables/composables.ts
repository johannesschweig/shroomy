import { SEARCH_MUSHROOMS, GET_SHROOM_BY_ID, GET_RANDOM_FUNGI, SEARCH_MUSHROOM_NAMES, GET_LOOK_ALIKE_FUNGI, GET_LETTER_COUNTS, GET_MUSHROOMS_BY_SEASON } from "@/composables/queries"
import { flattenFungi } from "@/composables/utils"
import { computed, ref, onMounted } from "vue"
import type { Ref } from "vue"
import { useStore } from "@/stores/store"
import { supabase } from "~/supabase"
import { GERMAN_ALPHABET } from "@/utils/utils"

export function useMushroomById(id: Ref<number> | number) {
  const idRef = typeof id === 'number' ? computed(() => id) : id
  const variables = computed(() => ({ id: idRef.value }))

  // Correct syntax: query, variables, clientId (optional), options (optional)
  const { data: shroom, pending: loading, error } = useAsyncQuery(
    GET_SHROOM_BY_ID,
    variables
  )

  const flatShroom = computed(() =>
    shroom.value ? flattenFungi(shroom.value.fungiCollection.edges[0]?.node) : null
  )

  return { shroom: flatShroom, loading, error }
}

export function useRandomFungiWithPhoto() {
  const { data, pending: loading, error } = useAsyncQuery(
    GET_RANDOM_FUNGI
  )

  const mushroomsOfTheDay = computed(() =>
    (data.value?.fungiCollection.edges ?? [])
      .map((edge: any) => {
        const fungi = edge.node
        const photoEdges = fungi.photosCollection.edges
        const photos = photoEdges.length > 0 ? [photoEdges[0].node] : null
        if (photos) {
          return {
            id: fungi.id,
            photos
          }
        }
      })
      .filter(Boolean)
      .slice(0, 12)
  )

  return {
    mushroomsOfTheDay,
    loading,
    error
  }
}

export function useSearchMushroomNames(queryRef: Ref<string>) {
  const suggestions = ref<string[]>([])
  const loading = ref(false)
  const error = ref(null)

  // Use useLazyQuery for client-side queries
  const { load, result, onResult, onError } = useLazyQuery(SEARCH_MUSHROOM_NAMES)

  watch(queryRef, async (val) => {
    if (val && val.length > 3) {
      loading.value = true
      try {
        await load(SEARCH_MUSHROOM_NAMES, { search: `%${val}%` })
      } catch (e) {
        console.error('Error searching mushroom names:', e)
        error.value = e as any
      } finally {
        loading.value = false
      }
    } else {
      suggestions.value = []
    }
  })

  onResult((resultData) => {
    if (resultData.data?.fungiCollection?.edges) {
      suggestions.value = resultData.data.fungiCollection.edges
        .map((e: any) => [e.node.name, e.node.preferred_common_name])
        .flat()
        .filter(Boolean)
    }
  })

  onError((e) => {
    error.value = e as any
  })

  return { suggestions, loading, error }
}


export function useSearchShrooms() {
  const store = useStore()
  const searchQuery = computed(() => store.search)

  const variables = computed(() => ({
    search: searchQuery.value ? `%${searchQuery.value}%` : ''
  }))

  const enabled = computed(() => searchQuery.value.length > 0)

  const { data, pending: loading, error, refresh } = useAsyncQuery(
    SEARCH_MUSHROOMS,
    variables
  )

  const filteredShrooms = computed(() => {
    if (!enabled.value || !data.value?.fungiCollection) return []
    return (data.value.fungiCollection.edges ?? []).map((e: any) => {
      const fungi = e.node
      const photoEdges = fungi.photosCollection?.edges || []
      const photos = photoEdges.length > 0 ? [photoEdges[0].node] : null
      return {
        id: fungi.id,
        name: fungi.name,
        preferred_common_name: fungi.preferred_common_name,
        obs_count_ger: fungi.obs_count_ger,
        photos,
      }
    })
  })

  const totalCount = computed(() => data.value?.fungiCollection?.totalCount || 0)

  return { filteredShrooms, loading, error, totalCount, refresh }
}

export function useMushroomLookAlikes(lookAlikeIds: Ref<number[]>) {
  const variables = computed(() => ({
    ids: lookAlikeIds.value.length > 0 ? lookAlikeIds.value : [0] // Provide default to avoid empty query
  }))

  const { data, pending: loading, error, refresh } = useAsyncQuery(
    GET_LOOK_ALIKE_FUNGI,
    variables
  )

  const lookAlikes = computed(() => {
    // Return empty if no valid IDs
    if (!lookAlikeIds.value.length || !data.value?.attributesCollection?.edges) return []

    return data.value.attributesCollection.edges
      .map((e: any) => flattenFungi(e.node?.fungi))
      .filter(Boolean)
  })

  return { lookAlikes, loading, error, refetch: refresh }
}


export function useLetterCounts() {
  const { data, pending: loading, error } = useAsyncData('letter-counts', async () => {
    const { data: counts } = await supabase.rpc('get_letter_counts')

    // Fill missing letters with 0
    const stats: Record<string, number> = {}
    GERMAN_ALPHABET.split('').forEach(l => {
      stats[l] = 0
    })

    counts.forEach((row: any) => {
      stats[row.letter] = row.count
    })

    return {
      counts: stats,
      total: counts.reduce((sum: number, row: any) => sum + row.count, 0)
    }
  })

  return {
    letterStats: computed(() => data.value?.counts || {}),
    totalCount: computed(() => data.value?.total || 0),
    loading,
    error
  }
}

export function useMushroomsByLetter(letter: Ref<string> | string) {
  const effectiveLetter = typeof letter === 'string' ? ref(letter) : letter

  const { data, pending: loading, error } = useAsyncData(
    `mushrooms-${effectiveLetter.value}`,
    async () => {
      const { data: mushrooms } = await supabase.rpc('get_mushrooms_by_letter', {
        p_letter: effectiveLetter.value
      })

      return mushrooms || []
    }
  )

  return {
    mushrooms: computed(() => data.value || []),
    loading,
    error
  }
}

export function useMushroomsBySeason(monthFrom: Ref<number> | number, monthTo: Ref<number> | number) {
  const monthFromRef = isRef(monthFrom) ? monthFrom : computed(() => monthFrom)
  const monthToRef = isRef(monthTo) ? monthTo : computed(() => monthTo)

  const variables = computed(() => ({
    seasonStart: monthFromRef.value,
    seasonEnd: monthToRef.value
  }))

  const { data, pending: loading, error } = useAsyncQuery(
    GET_MUSHROOMS_BY_SEASON,
    variables
  )

  const seasonalMushrooms = computed(() => {
    const res = data.value as any
    if (!res?.fungi_seasonalCollection?.edges) return []

    return res.fungi_seasonalCollection.edges.map((edge: any) => {
      const node = edge.node

      return {
        id: node.id,
        name: node.name,
        preferred_common_name: node.preferred_common_name,
        obs_count_ger: node.obs_count_ger,
        // Mapping the flat URL back to the expected photo object structure
        photos: node.photo_url ? [{ url: node.photo_url }] : null,
      }
    })
  })

  return { seasonalMushrooms, loading, error }
}

export function useTopEdibleMushrooms(seasonSlug: Ref<string> | string = 'all') {
  const seasonMap: Record<string, { start: number; end: number }> = {
    all: { start: 1, end: 12 },
    spring: { start: 3, end: 5 },
    summer: { start: 6, end: 8 },
    autumn: { start: 9, end: 11 },
    winter: { start: 12, end: 2 }
  }

  const queryVariables = computed(() => {
    const s = unref(seasonSlug)
    const months = seasonMap[s] || seasonMap.all
    return {
      seasonStart: months.start,
      seasonEnd: months.end
    }
  })

  const { data, pending, error, refresh } = useAsyncQuery(
    GET_TOP_EDIBLE_MUSHROOMS,
    queryVariables.value
  )

  const mushrooms = computed(() => {
    return data.value?.fungi_seasonalCollection?.edges.map((edge: any) => ({
      ...edge.node,
      photos: edge.node.photo_url ? [{ url: edge.node.photo_url }] : []
    })) || []
  })

  watch(queryVariables, () => {
    refresh()
  })

  return {
    mushrooms,
    loading: pending,
    error
  }
}