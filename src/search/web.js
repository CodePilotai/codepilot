import { Observable } from 'rxjs'

export default query => {
  return Observable.from(query.customSearchSources)
    .flatMap(source => Observable.of(source))
    .map(source => {
      const url = createUrl(source, query)
      return {
        results: {
          type: 'website',
          source: source.name,
          name: source.label,
          key: url,
          url
        }
      }
    })
    .catch(console.warn)
}

function createUrl(source, query) {
  const store = require('@state/store').default
  const githubUser = store.state.githubAuth.githubUserInfo
    ? store.state.githubAuth.githubUserInfo.login
    : ''

  const escapedQuery = encodeURIComponent(query.text)
  const url = source.url
    .replace(/\{\{query\}\}/g, escapedQuery)
    .replace(/\{\{github_user\}\}/g, githubUser)

  if (source.isSearched) {
    const escapedUrl = encodeURIComponent(url)
    return escapedUrl === 'google.com'
      ? `https://google.com/search?q=${escapedQuery}`
      : `https://google.com/search?q=site%3A${escapedUrl}+${escapedQuery}`
  } else {
    return url.includes('http') ? url : `https://${url}`
  }
}
