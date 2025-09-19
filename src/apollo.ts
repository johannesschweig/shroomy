import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client/core'

const httpLink = new HttpLink({
  uri: `${import.meta.env.VITE_SUPABASE_URL}/graphql/v1`,
  headers: {
    apikey: import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY,
    Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY}`,
  }
})

export const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
})
