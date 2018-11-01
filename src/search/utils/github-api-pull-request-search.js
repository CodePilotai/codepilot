import path from 'path'
import { Observable } from 'rxjs'
import pick from 'lodash/pick'
import createTmpDirectory from './create-tmp-directory'
import githubApiGet from './github-api-get'
import githubResponseMeta from './github-response-meta'

export default function githubApiPullRequestSearch({ query, token }) {
  return Observable.combineLatest(
    createTmpDirectory('github-pr'),
    search()
  ).flatMap(([tmpDirectory, response]) =>
    response.body.items.map(pr => {
      const [repoOwner, repoName] = pr.repository_url.split('/').slice(-2)
      const downloadPartial = `https://raw.githubusercontent.com/${repoOwner}/${repoName}/master`
      const packageJsonUrl = `${downloadPartial}/package.json`
      const localDirectory = path.join(tmpDirectory, repoOwner, repoName)

      return {
        ...pick(
          pr,
          'id',
          'title',
          'body',
          'state',
          'user',
          'labels',
          'comments_url'
        ),
        source: 'GitHub Pull Requests',
        type: 'pr',
        updatedAt: new Date(pr.updated_at),
        createdAt: new Date(pr.created_at),
        closedAt: new Date(pr.closed_at),
        url: pr.html_url,
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
    return Observable.from(
      githubApiGet({
        endpoint: `search/issues?per_page=30`,
        params: {
          q: `${query} type:pr`
        },
        token: token,
        source: 'GitHub Pull Requests'
      })
    ).catch(error => {
      const responseMeta = githubResponseMeta(error.response)
      console.warn(
        `Error fetching results from GitHub Pull Request API.`,
        responseMeta
      )
      return Observable.throw({ responseMeta })
    })
  }
}
