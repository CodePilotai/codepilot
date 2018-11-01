import request from 'superagent'
import LRU from 'lru-cache'
import store from '@state/store'
import PQueue from 'p-queue'

const cache = LRU(1000)
const cacheEndpointBlacklist = ['rate_limit']
const queue = new PQueue({ concurrency: 10 })

// A generic function for making GitHub GET requests
export default function githubApiGet({
  hostAddress,
  endpoint,
  params,
  token,
  source
}) {
  const accessToken = 'bearer ' + token
  endpoint = endpoint.replace('https://api.github.com/', '')
  const cacheKey = JSON.stringify(arguments)
  const shouldCacheResponse = !cacheEndpointBlacklist.includes(endpoint)

  let host = hostAddress ? `${hostAddress}/api/v3` : 'https://api.github.com'

  if (shouldCacheResponse) {
    const cachedResponse = cache.get(cacheKey)
    if (cachedResponse) {
      return Promise.resolve(cachedResponse)
    }
  }

  process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0

  return queue.add(
    () =>
      // Wrap superagent in our own promise, instead of
      // throwing from their promise, to avoid maximum
      // call stack errors.
      new Promise((resolve, reject) => {
        request
          .get(`${host}/${endpoint}`)
          .query(params)
          .set({
            Accept: hostAddress
              ? ''
              : endpoint.includes('search/commits')
                ? // https://developer.github.com/v3/search/#search-commits
                  'application/vnd.github.cloak-preview'
                : // https://developer.github.com/v3/#current-version
                  'application/vnd.github.v3+json',
            Authorization: accessToken
          })
          .timeout({
            // Wait 5 seconds for the server to start sending,
            // to prevent hanging searches when the GitHub API
            // is unresponsive.
            response: 5000
          })
          // Try to retry twice is a request fails.
          .retry(2)
          .then(response => {
            // Cache the response if we get a good response
            if (shouldCacheResponse) {
              cache.set(cacheKey, response)
            }
            resolve(response)
          })
          .catch(error => {
            if (error.status === 401) {
              store.dispatch('githubBrowserSignIn')
            } else if (error.status === 403) {
              store.dispatch('addNotification', {
                type: 'Warning',
                message:
                  'We had a problem retrieving ' +
                  endpoint +
                  ' from GitHub. Please try again in a couple of minutes.'
              })
            }

            // No matter what the error is, make sure that
            // it's logged with as much information as we have.
            console.warn({ error, endpoint, params, source })

            // Pass on the error to the search, so that it can
            // be handled appropriately with default data or
            // fallback behavior.
            reject(error)
          })
      })
  )
}
