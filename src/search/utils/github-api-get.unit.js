import nock from 'nock'
import githubApiGet from './github-api-get'

jest.mock('@state/store', () => ({
  dispatch: jest.fn()
}))

describe('@search/utils/github-api-get', () => {
  it('works with a correct API token', () => {
    return githubApiGet({
      endpoint: 'search/code',
      params: {
        q: 'new VueRouter'
      },
      token: testConstants.githubApiToken,
      source: 'test'
    }).then(response => {
      expect(Array.isArray(response.body.items)).toEqual(true)
    })
  })

  describe('when encountering an error', () => {
    beforeEach(() => {
      nock.disableNetConnect()
      jest.spyOn(console, 'warn').mockImplementation(() => {})
    })
    afterEach(() => {
      nock.cleanAll()
      nock.enableNetConnect()
      jest.restoreAllMocks()
    })

    it('correctly handles a 401 error', () => {
      const codeToTest = 401
      return getApiGetWithCode(codeToTest).catch(error => {
        // Passes along the error
        expect(error.status).toEqual(codeToTest)
        // Logs the error to the console
        expect(console.warn).toHaveBeenCalledWith(
          expectedConsoleErrorFor(error)
        )
      })
    })

    it('correctly handles a 403 error', () => {
      const codeToTest = 403
      return getApiGetWithCode(codeToTest).catch(error => {
        expect(error.status).toEqual(codeToTest)
        expect(console.warn).toHaveBeenCalledWith(
          expectedConsoleErrorFor(error)
        )
      })
    })
  })

  const baseSearchOptions = {
    endpoint: 'search/code',
    params: { foo: 'bar' },
    token: 'baz',
    source: 'GitHub Code'
  }

  function getApiGetWithCode(code) {
    const searchOptions = scopeSearchOptions(baseSearchOptions, code)
    nock('https://api.github.com')
      .get('/' + searchOptions.endpoint)
      .query(searchOptions.params)
      .reply(code)
    return githubApiGet(searchOptions)
  }

  function expectedConsoleErrorFor(error) {
    const searchOptions = scopeSearchOptions(baseSearchOptions, error.status)
    return {
      endpoint: searchOptions.endpoint,
      params: searchOptions.params,
      source: searchOptions.source,
      error
    }
  }

  function scopeSearchOptions(options, code) {
    return {
      ...options,
      endpoint: options.endpoint + code
    }
  }
})
