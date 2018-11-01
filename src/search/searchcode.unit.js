import searchcodeSearch from './searchcode'

require('jest-playback').setup(__dirname)

describe('@search/searchcode', () => {
  it(
    'returns results with a typical search',
    done => {
      const next = jest.fn(data => {
        const result = data.results
        try {
          expect(result).toHaveProperty('baseDirectory')
          expect(result).toHaveProperty('body')
          expect(result).toHaveProperty('downloadUrl')
          expect(result).toHaveProperty('filename')
          expect(result).toHaveProperty('key')
          expect(result).toHaveProperty('language')
          expect(result).toHaveProperty('lines')
          expect(result).toHaveProperty('linescount')
          expect(result).toHaveProperty('location')
          expect(result).toHaveProperty('name')
          expect(result).toHaveProperty('path')
          expect(result).toHaveProperty('relativePath')
          expect(result).toHaveProperty('repo')
          expect(result).toHaveProperty('source')
          expect(result).toHaveProperty('type')
          expect(result).toHaveProperty('url')
        } catch (error) {
          done.fail(error)
        }
      })
      searchcodeSearch({
        text: 'vue-global-events'
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
    'filters out results with no matching lines',
    done => {
      const next = jest.fn(data => {
        const result = data.results
        expect(result.lines.length).toBeGreaterThan(0)
      })
      searchcodeSearch({
        // This search is known to return results with no matching lines
        text: 'to_s'
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
