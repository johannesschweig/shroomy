import { gql } from 'graphql-tag'

// for detail page
export const GET_SHROOM_BY_ID = gql`
  query GetShroomById($id: Int!) {
  fungiCollection(filter: {id: {eq: $id}}) {
    edges {
      node {
        id
        rank_level
        name
        preferred_common_name
        obs_count_ger
        ancestry
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

// for mushrooms of the day
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

// for autocomplete search suggestions
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

// for full search results page
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
    orderBy: [{ obs_count_ger: DescNullsLast }]
  ) {
    totalCount
    edges {
      node {
        id
        name
        preferred_common_name
        obs_count_ger
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

// get look alikes by ids
export const GET_LOOK_ALIKE_FUNGI = gql`
  query GetLookAlikeFungi($ids: [String!]) {
    attributesCollection(filter: { id_123: { in: $ids } }) {
      edges {
        node {
          fungi_id
          fungi {
            id
            name
            preferred_common_name
            obs_count_ger
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
  }
`

export const GET_LETTER_COUNTS = gql`
  query GetLetterCounts($first: Int!, $after: String) {
    fungiCollection(first: $first, after: $after) {
      edges {
        node {
          id
          name
          preferred_common_name
        }
        cursor
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`
