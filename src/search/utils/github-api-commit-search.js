import path from 'path'
import escapeHtml from 'escape-html'
import { Observable } from 'rxjs'
import createTmpDirectory from './create-tmp-directory'
import githubApiGet from './github-api-get'
import githubResponseMeta from './github-response-meta'

export default function githubApiCommitSearch({ query, token }) {
  return (
    Observable
      // Get list of matching commits
      .combineLatest(createTmpDirectory('github-commits'), search())
      .flatMap(([tmpDirectory, response]) =>
        response.body.items.map(item => ({
          ...item,
          tmpDirectory
        }))
      )
      // Map each commit to match the required structure
      .map(commit => {
        const urlPartials = commit.html_url.split('/')
        const downloadPartial = `https://raw.githubusercontent.com/${
          urlPartials[3]
        }/${urlPartials[4]}/master`
        const packageJsonUrl = `${downloadPartial}/package.json`

        const localDirectory = path.join(
          commit.tmpDirectory,
          commit.repository.name,
          commit.sha
        )

        return {
          author: commit.commit.author.name,
          message: escapeHtml(commit.commit.message),
          commitDate: new Date(commit.commit.committer.date),
          sha: commit.sha,
          type: 'commit',
          source: 'GitHub Commits',
          url: commit.html_url,
          apiUrl: commit.url,
          repo: {
            url: commit.repository.html_url,
            name: commit.repository.name,
            description: commit.repository.description,
            isFork: commit.repository.fork,
            updatedAt: new Date(commit.commit.author.date),
            owner: {
              url: commit.repository.owner.html_url,
              // Will be "User" or "Organization"
              type: commit.repository.owner.type,
              name: commit.repository.owner.login
            }
          },
          localDirectory,
          packageJsonUrl,
          packagePath: path.join(localDirectory, '/package.json')
        }
      })
  )

  function search() {
    return Observable.fromPromise(
      githubApiGet({
        endpoint: `search/commits?per_page=20`,
        params: {
          q: query
        },
        token: token,
        source: 'GitHub Commits'
      })
    ).catch(error => {
      const responseMeta = githubResponseMeta(error.response)
      console.warn(
        `Error fetching results from GitHub Commit API.`,
        responseMeta
      )
      return Observable.throw({ responseMeta })
    })
  }
}
