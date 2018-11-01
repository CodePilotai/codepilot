import { Observable } from 'rxjs'
import githubApiGet from './github-api-get'

export default function addComments({ token }) {
  return observable =>
    observable
      .flatMap(
        item =>
          item.comments === 0
            ? Observable.of({ body: [] })
            : githubApiGet({
                endpoint: item.comments_url,
                token: token,
                source: 'GitHub Comments Fetching'
              }).catch(error => ({ error, body: [] })),
        (item, commentsResponse) => ({
          ...item,
          comments: commentsResponse.body.map(comment => ({
            id: comment.id,
            author: comment.user.login,
            body: comment.body,
            updatedAt: new Date(comment.updated_at)
          })),
          repoDeleted:
            commentsResponse.error &&
            commentsResponse.error.message === 'Not Found'
        })
      )
      .filter(item => !item.repoDeleted)
}
