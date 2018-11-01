import youtubeApiSearch from './youtube-api-search'
require('jest-playback').setup(__dirname)
describe('@search/utils/youtubeApiSearch', () => {
  it(
    'Returns results from the API',
    done => {
      const next = jest.fn(data => {
        const youtubeApiSearchResults = data
        try {
          expect(youtubeApiSearchResults.length).toBeLessThanOrEqual(25)
        } catch (error) {
          done.fail(error)
        }
      })

      youtubeApiSearch({
        query: { text: 'vue' },
        apiKey: testConstants.youtubeToken
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
})
