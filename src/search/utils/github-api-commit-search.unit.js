import githubApiCommitSearch from './github-api-commit-search'

require('jest-playback').setup(__dirname)

jest.mock('@state/store', () => ({
  dispatch: jest.fn()
}))

describe('@search/utils/github-api-commit-search', () => {
  it('works with a basic search', done => {
    const next = jest.fn(commit => {
      try {
        expect(typeof commit.sha).toEqual('string')
        expect(typeof commit.apiUrl).toEqual('string')
        expect(typeof commit.author).toEqual('string')
        expect(typeof commit.localDirectory).toEqual('string')
        expect(typeof commit.message).toEqual('string')
        expect(typeof commit.packageJsonUrl).toEqual('string')
        expect(typeof commit.packagePath).toEqual('string')
        expect(typeof commit.source).toEqual('string')
        expect(typeof commit.type).toEqual('string')
        expect(typeof commit.url).toEqual('string')
        expect(typeof commit.repo).toEqual('object')
        expect(commit.commitDate).toBeInstanceOf(Date)
      } catch (error) {
        done.fail(error)
      }
    })
    githubApiCommitSearch({
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
    githubApiCommitSearch({
      query: 'new VueRouter',
      token: 'bad token'
    }).subscribe({
      error(error) {
        try {
          expect(typeof error.responseMeta).toEqual('object')
          expect(
            consoleWarn.mock.calls[consoleWarn.mock.calls.length - 1][0]
          ).toEqual(`Error fetching results from GitHub Commit API.`)
          consoleWarn.mockRestore()
        } catch (error) {
          done.fail(error)
        }
        done()
      }
    })
  })
})
