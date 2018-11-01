import ripgrepSearch from './ripgrep'
import githubCodeSearch from './github-code'
import githubIssuesSearch from './github-issues'
import githubPullRequestSearch from './github-pull-request'
import githubCommitSearch from './github-commit'
import stackoverflowSearch from './stackoverflow'
import webSearch from './web'
import youtubeSearch from './youtube'
import searchcodeSearch from './searchcode'
import parseQuery from '@helpers/parse-query'
import { Observable } from 'rxjs'
import { handleOrQueries } from './utils/handle-or-queries'

export default options => {
  const userProfile = require('@state/store').default.getters.selectedProfile
  const { query } = options

  // Moved all query normalization here, since
  // these are normalizations we'll probably want
  // to make for every kind of search.
  query.text = query.text.trim()

  query.parsed = parseQuery(query.text)

  // If we're doing a ripgrep search directly...
  if (options.type === 'ripgrep') {
    return Observable.fromPromise(
      ripgrepSearch({
        ...query,
        directories: query.projectDirectories
      })
    )
  }
  // If we're doing a GitHub code search...
  if (options.type === 'githubCode') {
    return githubCodeSearch(query)
  }

  if (options.type === 'githubIssues') {
    return githubIssuesSearch(query)
  }

  if (options.type === 'githubPullRequest') {
    return githubPullRequestSearch(query)
  }

  if (options.type === 'githubCommit') {
    return githubCommitSearch(query)
  }

  if (options.type === 'personalRepos') {
    return githubCodeSearch(query)
  }
  if (options.type === 'githubEnterpriseCode') {
    return githubCodeSearch(query)
  }
  // If we're doing a Stack Overflow search...
  if (options.type === 'stackoverflow') {
    // In case data source does not support OR natively
    return handleOrQueries(stackoverflowSearch, query)
  }
  // If we're doing a YouTube search...
  if (options.type === 'youtube') {
    return youtubeSearch({ query })
  }
  // If we're doing a web search...
  if (options.type === 'web') {
    return webSearch(query)
  }
  // If we're doing a searchcode search
  if (options.type === 'searchcode') {
    const notStrings = []
    return handleOrQueries(searchcodeSearch, {
      ...query,
      text:
        query.text.replace(/\s*\bNOT\s+("[^"]+"|\S+)/g, (match, notString) => {
          notStrings.push(notString.replace(/"/g, ''))
          return ''
        }) +
        ' ' +
        userProfile.programmingLanguages
          .map(lang => `lang:${lang}`)
          .join(' OR '),
      notStrings
    })
  }
}
