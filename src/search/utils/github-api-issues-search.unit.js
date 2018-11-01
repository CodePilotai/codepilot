import githubApiIssuesSearch from './github-api-issues-search'

require('jest-playback').setup(__dirname)

jest.mock('@state/store', () => ({
  dispatch: jest.fn()
}))

describe('@search/utils/github-api-issues-search', () => {
  it('works with a basic search', done => {
    const next = jest.fn(issue => {
      try {
        expect(issue.source).toEqual('GitHub Issues')
        expect(issue.type).toEqual('issue')
        expect(typeof issue.title).toEqual('string')
        expect(typeof issue.body).toEqual('string')
        expect(typeof issue.state).toEqual('string')
        expect(typeof issue.url).toEqual('string')
      } catch (error) {
        done.fail(error)
      }
    })
    githubApiIssuesSearch({
      query: 'vue-global-events',
      token: testConstants.githubApiToken
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
  })

  it('emits an error with responseMeta when passed a bad token', done => {
    const consoleWarn = jest.spyOn(console, 'warn').mockImplementation(() => {})
    githubApiIssuesSearch({
      query: 'vue-global-events',
      token: 'bad token'
    }).subscribe({
      error(error) {
        try {
          expect(typeof error.responseMeta).toEqual('object')
          expect(
            consoleWarn.mock.calls[consoleWarn.mock.calls.length - 1][0]
          ).toEqual(`Error fetching results from GitHub Issues API.`)
          consoleWarn.mockRestore()
        } catch (error) {
          done.fail(error)
        }
        done()
      }
    })
  })
})
