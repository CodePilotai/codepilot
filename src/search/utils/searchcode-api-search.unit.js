import searchcodeApiSearch from './searchcode-api-search'

require('jest-playback').setup(__dirname)

describe('@search/utils/searchcode-api-search', () => {
  it('works with a basic search', done => {
    const next = jest.fn(file => {
      try {
        expect(typeof file.key).toEqual('string')
        expect(typeof file.type).toEqual('string')
        expect(typeof file.path).toEqual('string')
        expect(typeof file.baseDirectory).toEqual('string')
        expect(typeof file.relativePath).toEqual('string')
        expect(typeof file.downloadUrl).toEqual('string')
        expect(typeof file.language.name).toEqual('string')
        expect(typeof file.language.iconClass).toEqual('string')
        expect(typeof file.language.extension).toEqual('string')
        expect(typeof file.name).toEqual('string')
        expect(typeof file.repo).toEqual('string')
        expect(typeof file.url).toEqual('string')
      } catch (error) {
        done.fail(error)
      }
    })
    searchcodeApiSearch({
      query: {
        text: 'vue-global-events'
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
  })

  it('gracefully recovers from bad queries', done => {
    const consoleWarn = jest.spyOn(console, 'warn').mockImplementation(() => {})
    const next = jest.fn()
    searchcodeApiSearch({
      query: {
        text: ''
      }
    }).subscribe({
      next,
      complete() {
        try {
          expect(next).toHaveBeenCalledTimes(0)
          expect(consoleWarn).toHaveBeenCalledWith(
            'Error fetching results from Searchcode API.'
          )
          consoleWarn.mockRestore()
        } catch (error) {
          done.fail(error)
        }
        done()
      }
    })
  })
})
