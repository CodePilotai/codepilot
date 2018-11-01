import { Observable } from 'rxjs'
import graphqlTag from 'graphql-tag'
import githubApiGet from './github-api-get'
import gitHubApiGraphqlQuery from './github-api-graphql-query'

export default function getGithubRepoFromGithubGraphql({
  hostAddress,
  owner,
  name,
  token
}) {
  return new Observable(observer => {
    gitHubApiGraphqlQuery({
      query: graphqlTag`
        query {
          repository(owner:"${owner}", name:"${name}") {
            description
            updatedAt
            stargazers {
              totalCount
            }
            licenseInfo {
              name
            }
          }
        }
      `,
      hostAddress,
      token
    })
      .then(response => {
        const repo = response.data.repository
        observer.next({
          description: repo.description,
          license: repo.licenseInfo ? repo.licenseInfo.name : null,
          stars: repo.stargazers.totalCount,
          updatedAt: new Date(repo.updatedAt)
        })
        observer.complete()
      })
      .catch(error => {
        console.error(error)
        if (error.status === 404) {
          // 404 is the status code given when a commit hash cannot be found
          // because it comes from a private repo. It does not affect
          // the search so simply return.
        } else if (error.status === 403) {
          // 403 is the status code given when API Limit has been hit.
          githubApiGet({
            endpoint: 'rate_limit',
            source: 'GitHub Code',
            token
          })
            .then(response => {
              console.error({
                message: 'Github Rate Limit Exceeded',
                limits: response.body,
                error
              })
            })
            .catch(error => {
              console.error(error)
            })
        }
        observer.error({
          message: `GitHub GraphQL API encountered an error while searching for "${owner}/${name}"`,
          error
        })
      })
  })
}
