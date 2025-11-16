import { SEARCH_MUSHROOMS, GET_SHROOM_BY_ID, GET_RANDOM_FUNGI, SEARCH_MUSHROOM_NAMES, GET_LOOK_ALIKE_FUNGI } from "@/composables/queries"
import { flattenFungi } from "@/composables/utils"
import { computed, ref } from "vue"
import type { Ref } from "vue"
import { useStore } from "@/stores/store"

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
