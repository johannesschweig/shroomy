import { gql } from 'graphql-tag'
import { seedToday } from '@/utils'

export const GET_SHROOM_BY_ID = gql`
  query GetShroomById($id: Int!) {
  fungiCollection(filter: {id: {eq: $id}}) {
    edges {
      node {
        id
        rank_level
        name
        preferred_common_name
        observations_count
        ancestry
        observations_count
        
        photosCollection(first: 10) {
          edges {
            node {
              id
              url
              attribution
              license_code
            }
          }
        }
        attributes {
          id_123
          type
          season_from
          season_to
          size_from
          size_to
          gills_color
          gills_attachment
          gills_traits
          stem_color
          stem_traits
          cap_color
          cap_shape
          flesh_color
          flesh_bruising_color
          edibility
          toxicity
          taste
          smell
          spore_color
          habitat
          traits
          look_alikes
        }
      }
    }
  }
}`

const OFFSET = seedToday(9900) // max 9991 rows - some wiggle room

export const GET_RANDOM_FUNGI = gql`
  query GetRandomFungiWithPhoto {
    fungiCollection(first: 20, offset:${OFFSET}) {
     edges {
      node {
        id
        photosCollection(first: 1) {
          edges {
            node {
              url
              fungi_id
            }
          }
        }
      }
    }
  }
}
`

export const SEARCH_MUSHROOM_NAMES = gql`
query SearchMushroomNames($search: String) {
  fungiCollection(
    first: 5,
    filter: {
      or: [
        { name: { ilike: $search } },
        { preferred_common_name: { ilike: $search } }
      ]
    }
  ) {
    edges {
      node {
        name
        preferred_common_name
      }
    }
  }
}
`
export const SEARCH_MUSHROOMS = gql`
query SearchMushroom($search: String) {
  fungiCollection(
    first: 200,
    filter: {
      or: [
        { name: { ilike: $search } },
        { preferred_common_name: { ilike: $search } }
      ]
    }
  ) {
    totalCount
    edges {
      node {
        id
        name
        preferred_common_name
        observations_count
        photosCollection(first: 1) {
          edges {
            node {
              url
              fungi_id
            }
          }
        }
      }
    }
  }
}`