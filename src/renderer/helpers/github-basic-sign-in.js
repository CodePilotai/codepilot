import request from 'superagent'

export default async function github(authorization) {
  const authToken = await request
    .post('https://api.github.com/authorizations', {
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      scopes: ['public_repo', 'user'],
      note: 'user login'
    })
    .set({
      Authorization: authorization
    })
    .then(results => {
      const token = results.body.token
      return token
    })
    .catch(error => {
      console.error(error.message)
      return null
    })

  return authToken
}
