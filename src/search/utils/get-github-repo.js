import { Observable } from 'rxjs'
import getGithubRepoFromGithubGraphql from './get-github-repo-from-github-graphql'

export default function getGithubRepo({ hostAddress, owner, name, token }) {
  return (
    getGithubRepoFromGithubGraphql({ hostAddress, owner, name, token })
      // Fall back to an empty object if it fails
      .catch(() => Observable.of({}))
      .map(repo => ({
        ...repo,
        owner,
        name,
        fullName: `${owner}/${name}`
      }))
  )
}
