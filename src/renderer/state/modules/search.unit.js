describe('@state/modules/search', () => {
  jest.mock('@search', () => jest.fn())

  const searchModule = require('./search').default

  const {
    actions,
    state: { searchIntents }
  } = searchModule
  let state, rootState

  beforeEach(() => {
    state = {
      searchIntents,
      selectedSearchIntent: searchIntents[0]
    }
    rootState = {
      githubAuth: {
        githubAccessToken: 'someToken'
      },
      internetConnection: {
        hasInternetConnection: true
      }
    }
    navigator.__defineGetter__('onLine', () => true)
  })

  describe('Actions', () => {
    describe('updateSelectedSearchIntent', () => {
      it('should commit the "SET_SELECTED_SEARCH_INTENT" mutation', () => {
        const commit = jest.fn()
        actions.updateSelectedSearchIntent(
          { commit, state, rootState },
          'codeResults'
        )
        expect(commit).toHaveBeenCalledWith(
          'SET_SELECTED_SEARCH_INTENT',
          searchIntents[0]
        )
      })
    })
  })
})
