import githubCodeSearch from './github-code'

require('jest-playback').setup(__dirname)

jest.mock('@state/store', () => ({
  dispatch: jest.fn()
}))

describe('@search/github-code', () => {
  it(
    'returns results with a typical search',
    done => {
      const next = jest.fn(data => {
        try {
          expect(typeof data.results).toEqual('object')
        } catch (error) {
          done.fail(error)
        }
      })
      githubCodeSearch({
        text: 'new VueRouter',
        page: 1,
        includeOnly: '',
        exclude: '',
        apiTokens: {
          githubToken: testConstants.githubApiToken,
          githubEnterpriseToken: testConstants.githubEnterpriseToken
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
    'returns results with a typical search on github enterprise',
    done => {
      const next = jest.fn(data => {
        try {
          expect(typeof data.results).toEqual('object')
        } catch (error) {
          done.fail(error)
        }
      })
      githubCodeSearch({
        hostAddress: testConstants.githubEnterpriseHostAddress,
        text: 'Vue.use',
        page: 1,
        includeOnly: '',
        exclude: '',
        apiTokens: {
          githubToken: testConstants.githubApiToken,
          githubEnterpriseToken: testConstants.githubEnterpriseToken
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
      githubCodeSearch({
        text: 'new VueRouter',
        page: 1,
        includeOnly: '',
        exclude: '',
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
              'Error fetching results from GitHub Code API.'
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
