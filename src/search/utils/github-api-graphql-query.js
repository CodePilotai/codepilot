import { ApolloClient } from 'apollo-client'
import { setContext } from 'apollo-link-context'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'

// A generic function for making GitHub GraphQL queries
export default function gitHubApiGraphqlQuery({ query, hostAddress, token }) {
  const host = hostAddress
    ? `${hostAddress}/api/graphql`
    : 'https://api.github.com/graphql'

  const httpLink = createHttpLink({
    uri: host,
    fetch: require('node-fetch')
  })

  const middlewareLink = setContext(() => ({
    headers: {
      authorization: 'bearer ' + token
    }
  }))

  const link = middlewareLink.concat(httpLink)

  const client = new ApolloClient({
    link,
    cache: new InMemoryCache()
  })

  return client.query({ query })
}
