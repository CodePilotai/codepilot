import githubApiCodeSearch from './github-api-code-search'

require('jest-playback').setup(__dirname)

jest.mock('@state/store', () => ({
  dispatch: jest.fn()
}))

describe('@search/utils/github-api-code-search', () => {
  it('works with a basic search', done => {
    const next = jest.fn(item => {
      try {
        expect(typeof item.name).toEqual('string')
      } catch (error) {
        done.fail(error)
      }
    })
    githubApiCodeSearch({
      query: 'new VueRouter',
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
    githubApiCodeSearch({
      query: 'new VueRouter',
      token: 'bad token'
    }).subscribe({
      error(error) {
        try {
          expect(typeof error.responseMeta).toEqual('object')
          expect(
            consoleWarn.mock.calls[consoleWarn.mock.calls.length - 1][0]
          ).toEqual(`Error fetching results from GitHub Code API.`)
          consoleWarn.mockRestore()
        } catch (error) {
          done.fail(error)
        }
        done()
      }
    })
  })
})
