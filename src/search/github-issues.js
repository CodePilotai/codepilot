import { Observable } from 'rxjs'
import githubApiIssuesSearch from './utils/github-api-issues-search'
import addDependencies from './utils/add-dependencies'
import addGithubComments from './utils/add-github-comments'

export default query => {
  const token = query.apiTokens.githubToken

  return (
    // ===
    // Initial fetch of results
    // ===

    githubApiIssuesSearch({
      query: query.text,
      token
    })
      // ===
      // Initial filtering of results
      // ===

      .distinct(issue => issue.url)
      // Filter out empty issues
      .filter(issue => (issue.body ? issue.body.trim() : ''))
      .map(issue => ({ ...issue, accessToken: `bearer ${token}` }))

      // ===
      // Get extra info/resources for each result
      // ===

      .pipe(addGithubComments({ token }))
      .pipe(addDependencies)

      // ===
      // Final mapping of results
      // ===

      .map(issue => ({ results: issue }))

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
