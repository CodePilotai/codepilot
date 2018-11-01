import * as pinsModule from './pins'

describe('@state/modules/pins', () => {
  it('exports a valid Vuex module', () => {
    expect(pinsModule).toBeAVuexModule()
  })
})
