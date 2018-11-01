import githubIssuesSearch from './github-issues'

require('jest-playback').setup(__dirname)

jest.mock('@state/store', () => ({
  dispatch: jest.fn()
}))

describe('@search/github-issues', () => {
  it(
    'returns results with a typical search',
    done => {
      const next = jest.fn(data => {
        const result = data.results
        try {
          expect(result.source).toEqual('GitHub Issues')
          expect(result.type).toEqual('issue')
          expect(typeof result.title).toEqual('string')
          expect(typeof result.body).toEqual('string')
          expect(typeof result.state).toEqual('string')
          expect(typeof result.url).toEqual('string')
          expect(Array.isArray(result.comments)).toEqual(true)
          result.comments.forEach(comment => {
            expect(typeof comment.id).toEqual('number')
            expect(typeof comment.author).toEqual('string')
            expect(typeof comment.body).toEqual('string')
          })
        } catch (error) {
          done.fail(error)
        }
      })
      githubIssuesSearch({
        text: 'vue-global-events',
        apiTokens: {
          githubToken: testConstants.githubApiToken
        }
      }).subscribe({
        next,
        complete() {
          try {
            expect(next.mock.calls.length).toBeGreaterThan(0)
          } catch (error) {
            done.fail(error)
          }
          done()
        }
      })
    },
    30000
  )

  it(
    'gracefully handles errors',
    done => {
      const consoleWarn = jest
        .spyOn(console, 'warn')
        .mockImplementation(() => {})
      const next = jest.fn(data => {
        try {
          expect(typeof data.results).toEqual('undefined')
          expect(typeof data.responseMeta.rateLimitRemaining).toEqual('number')
          expect(typeof data.responseMeta.retryAfter).toEqual('number')
          expect(typeof data.responseMeta.totalPages).toEqual('number')
        } catch (error) {
          done.fail(error)
        }
      })
      githubIssuesSearch({
        text: 'vue-global-events',
        apiTokens: {
          githubToken: 'bad token'
        }
      }).subscribe({
        next,
        complete() {
          try {
            expect(next).toHaveBeenCalledTimes(1)
            expect(consoleWarn.mock.calls[0][0].error.message).toEqual(
              'Unauthorized'
            )
            expect(consoleWarn.mock.calls[1][0]).toEqual(
              'Error fetching results from GitHub Issues API.'
            )
            consoleWarn.mockRestore()
          } catch (error) {
            done.fail(error)
          }
          done()
        }
      })
    },
    30000
  )
})
