import path from 'path'
import { Observable } from 'rxjs'
import pick from 'lodash/pick'
import createTmpDirectory from './create-tmp-directory'
import githubApiGet from './github-api-get'
import githubResponseMeta from './github-response-meta'

export default function githubApiIssuesSearch({ query, token }) {
  return Observable.combineLatest(
    createTmpDirectory('github-issues'),
    search()
  ).flatMap(([tmpDirectory, response]) =>
    response.body.items.map(issue => {
      const [repoOwner, repoName] = issue.repository_url.split('/').slice(-2)
      const downloadPartial = `https://raw.githubusercontent.com/${repoOwner}/${repoName}/master`
      const packageJsonUrl = `${downloadPartial}/package.json`
      const localDirectory = path.join(tmpDirectory, repoOwner, repoName)

      return {
        ...pick(
          issue,
          'id',
          'title',
          'body',
          'state',
          'user',
          'labels',
          'comments_url'
        ),
        source: 'GitHub Issues',
        type: 'issue',
        updatedAt: new Date(issue.updated_at),
        createdAt: new Date(issue.created_at),
        closedAt: new Date(issue.closed_at),
        url: issue.html_url,
        repoOwner,
        repoName,
        localDirectory,
        packageJsonUrl,
        packagePath: path.join(localDirectory, '/package.json'),
        tmpDirectory
      }
    })
  )

  function search() {
    return Observable.fromPromise(
      githubApiGet({
        endpoint: `search/issues?per_page=30`,
        params: {
          q: `${query} type:issue`
        },
        token: token,
        source: 'GitHub Issues'
      })
    ).catch(error => {
      const responseMeta = githubResponseMeta(error.response)
      console.warn(
        `Error fetching results from GitHub Issues API.`,
        responseMeta
      )
      return Observable.throw({ responseMeta })
    })
  }
}
