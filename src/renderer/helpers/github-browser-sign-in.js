import request from 'superagent'

export default async function githubBrowserAuth(code) {
  const authToken = await request
    .post('https://github.com/login/oauth/access_token', {
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code: code
    })
    .then(results => {
      const token = results.body.access_token
      return token
    })
    .catch(error => {
      console.error(error.message)
      return null
    })
  return authToken
}
