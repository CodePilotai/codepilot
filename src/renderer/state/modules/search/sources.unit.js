import sources from './sources'

require('jest-playback').setup(__dirname)

describe('@state/modules/search/sources', () => {
  it('every source has the required properties', () => {
    for (const sourceKey in sources) {
      const source = sources[sourceKey]
      if (typeof source === 'object') {
        expect(typeof source.name).toEqual('string')
        expect(typeof source.label).toEqual('string')
        expect(typeof source.storeKey).toEqual('string')
        expect(typeof source.service).toEqual('string')
        expect(typeof source.canLoadMoreResults).toEqual('boolean')
        expect(typeof source.queryMapper).toEqual('function')
        expect(typeof source.resultsMapper).toEqual('function')
        expect(typeof source.exactFilter).toEqual('function')
      }
    }
  })
})
