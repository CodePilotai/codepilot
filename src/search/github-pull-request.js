import { Observable } from 'rxjs'
import githubApiPullRequestSearch from './utils/github-api-pull-request-search'
import addDependencies from './utils/add-dependencies'
import addGithubComments from './utils/add-github-comments'

export default query => {
  const token = query.apiTokens.githubToken

  return (
    // ===
    // Initial fetch of results
    // ===

    githubApiPullRequestSearch({ query: query.text, token })
      // ===
      // Initial filtering of results
      // ===

      // Filter out empty issues
      .filter(pr => pr.body.trim())
      .map(pr => ({ ...pr, accessToken: `bearer ${token}` }))
      // Remove duplicates based on the unique key
      .distinct(pr => pr.url)

      // ===
      // Get extra info/resources for each result
      // ===

      .pipe(addGithubComments({ token }))
      .pipe(addDependencies)

      // ===
      // Final mapping of results
      // ===

      .map(pr => ({ results: pr }))

      // ===
      // Error handling
      // ===

      .catch(error =>
        Observable.of({
          responseMeta: error.responseMeta
        })
      )
  )
}
