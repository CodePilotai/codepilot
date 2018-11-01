import request from 'superagent'
import btoa from 'btoa'

export default function revokeGitHubAccess(userAccessToken) {
  const basicAuthToken =
    'Basic ' +
    btoa(process.env.GITHUB_CLIENT_ID + ':' + process.env.GITHUB_CLIENT_SECRET)

  return request
    .delete(
      `https://api.github.com/applications/${
        process.env.GITHUB_CLIENT_ID
      }/tokens/${userAccessToken}`
    )
    .set({
      Authorization: basicAuthToken
    })
    .catch(error => {
      console.error(error)
    })
}
