import { useQuery } from "@vue/apollo-composable"
import { SEARCH_MUSHROOMS, GET_SHROOM_BY_ID, GET_RANDOM_FUNGI, SEARCH_MUSHROOM_NAMES } from "@/graphql/queries"
import { flattenFungi } from "@/graphql/utils"
import { computed, watch, ref } from "vue"
import type { Ref } from "vue"
import { useStore } from "@/stores/store"

export function useMushroomById(id: Ref<number> | number) {
  // Make id reactive if passed as a number
  const idRef = typeof id === 'number' ? computed(() => id) : id

  const variables = computed(() => ({ id: idRef.value }))

  const { result, loading, error } = useQuery(GET_SHROOM_BY_ID, variables)

  // computed reactive flattened result
  const shroom = computed(() => {
    return flattenFungi(result.value?.fungiCollection.edges[0]?.node)
  })

  return { shroom, loading, error }
}


export function useRandomFungiWithPhoto() {
  const { result, loading, error } = useQuery(GET_RANDOM_FUNGI)

  const mushroomsOfTheDay = computed(() =>
    (result.value?.fungiCollection.edges ?? [])
      .map(edge => {
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

// auto updates the suggestions as the query changes
export function useSearchMushroomNames(queryRef: Ref<string>) { // pass ref, not string
  const variables = ref({ search: '' })

  watch(queryRef, (val) => {
    if (val && val.length > 3) {
      variables.value = { search: `%${val}%` }
    } else {
      return
    }
  }, { immediate: true })

  const { result, loading, error } = useQuery(SEARCH_MUSHROOM_NAMES, variables)

  const suggestions = computed(() => {
    if (!variables.value.search || !result.value) return []
    return result.value.fungiCollection.edges
      .map(e => [e.node.name, e.node.preferred_common_name])
      .flat()
      .filter(Boolean)
  })

  return { suggestions, loading, error }
}


export function useSearchShrooms() {
  const store = useStore()
  const variables = ref({ search: '' })

  watch(
    () => store.search,
    (val) => {
      if (val && val.length > 0) {
        variables.value = { search: `%${val}%` }
      } else {
        return
      }
    },
    { immediate: true }
  )

  const { result, loading, error } = useQuery(SEARCH_MUSHROOMS, variables)

  const filteredShrooms = computed(() => {
    if (!result.value || !result.value.fungiCollection) return []

    return (result.value.fungiCollection.edges ?? []).map(e => {
      const fungi = e.node
      const photoEdges = fungi.photosCollection?.edges || []
      const photos = photoEdges.length > 0 ? [photoEdges[0].node] : null

      return {
        id: fungi.id,
        name: fungi.name,
        preferred_common_name: fungi.preferred_common_name,
        observations_count: fungi.observations_count,
        photos,
      }
    })
  })

  const totalCount = computed(() => {
    return result.value?.fungiCollection?.totalCount || 0
  })

  return { filteredShrooms, loading, error, totalCount }
}

