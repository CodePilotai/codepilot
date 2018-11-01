import youtubeSearch from './youtube'
require('jest-playback').setup(__dirname)

describe('@search/youtube', () => {
  it(
    'Returns results with a typical search',
    done => {
      const next = jest.fn(data => {
        const result = data.results
        try {
          expect(result).toHaveProperty('type')
          expect(result).toHaveProperty('source')
          expect(result).toHaveProperty('id')
          expect(result).toHaveProperty('kind')
          expect(result).toHaveProperty('publishedAt')
          expect(result).toHaveProperty('channelId')
          expect(result).toHaveProperty('channelTitle')
          expect(result).toHaveProperty('description')
          expect(result).toHaveProperty('thumbnails')
          expect(result).toHaveProperty('title')
        } catch (error) {
          done.fail(error)
        }
      })

      youtubeSearch({
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
  it(
    'Gracefully handles errors',
    done => {
      const consoleWarn = jest
        .spyOn(console, 'warn')
        .mockImplementation(() => {})
      const next = jest.fn(data => {
        try {
          expect(typeof data.results).toEqual('undefined')
        } catch (error) {
          done.fail(error)
        }
      })
      youtubeSearch({
        query: { text: 'vue' },
        key: 'BAD_TOKEN'
      }).subscribe({
        next,
        complete() {
          try {
            expect(next).toHaveBeenCalledTimes(0)
            expect(consoleWarn.mock.calls[0][0]).toEqual(
              'Error fetching results from YouTube API.'
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
