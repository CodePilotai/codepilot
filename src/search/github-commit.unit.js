import githubCommitSearch from './github-commit'

require('jest-playback').setup(__dirname)

jest.mock('@state/store', () => ({
  dispatch: jest.fn()
}))

describe('@search/github-commit', () => {
  it(
    'returns results with a typical search',
    done => {
      const next = jest.fn(data => {
        const result = data.results
        try {
          expect(result.commitDate).toBeInstanceOf(Date)
          expect(result.source).toEqual('GitHub Commits')
          expect(result.type).toEqual('commit')
          expect(typeof result.author).toEqual('string')
          expect(typeof result.sha).toEqual('string')
          expect(typeof result.url).toEqual('string')
          expect(typeof result.message).toEqual('string')
          expect(Array.isArray(result.files)).toEqual(true)
          expect(typeof result.repo.url).toEqual('string')
          expect(typeof result.repo.name).toEqual('string')
          expect(typeof result.repo.isFork).toEqual('boolean')
          expect(result.repo.updatedAt).toBeInstanceOf(Date)
          expect(typeof result.repo.owner.url).toEqual('string')
          expect(typeof result.repo.owner.type).toEqual('string')
          expect(typeof result.repo.owner.name).toEqual('string')
          expect(typeof result.localDirectory).toEqual('string')
          result.files.forEach(file => {
            expect(typeof file.path).toEqual('string')
            expect(file.type).toEqual('commit')
            expect(file.source).toEqual('GitHub Commits')
          })
        } catch (error) {
          done.fail(error)
        }
      })
      githubCommitSearch({
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
      githubCommitSearch({
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
              'Error fetching results from GitHub Commit API.'
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
