describe('@state/modules/interface', () => {
  jest.mock('@branding', () => {
    return {
      _baseFontSize: '14px',
      _codeFontStackDefault: 'DEFAULT FONTS'
    }
  })

  const branding = require('@branding')
  const interfaceModule = require('./interface').default

  it('exports a valid Vuex module', () => {
    expect(interfaceModule).toBeAVuexModule()
  })

  describe('in a store', () => {
    let store
    beforeEach(() => {
      store = createModuleStore(interfaceModule)
    })

    describe('actions.updateCodeFontSize', () => {
      it('saves string numbers as numbers', () => {
        store.dispatch('updateCodeFontSize', '20')
        expect(store.state.codeFontSize).toEqual(20)
      })

      it('saves the default when passed an empty string', () => {
        store.dispatch('updateCodeFontSize', '')
        expect(store.state.codeFontSize).toEqual(
          parseInt(branding._baseFontSize)
        )
      })

      it('commits the absolute value if passed a negative number string', () => {
        store.dispatch('updateCodeFontSize', '-30')
        expect(store.state.codeFontSize).toEqual(30)
      })
    })

    describe('actions.updateCodeFontFamily', () => {
      it('saves strings directly', () => {
        store.dispatch('updateCodeFontFamily', 'Arial')
        expect(store.state.codeFontFamily).toEqual('Arial')
      })

      it('saves the default when passed an empty string', () => {
        store.dispatch('updateCodeFontFamily', 'something')
        store.dispatch('updateCodeFontFamily', '')
        expect(store.state.codeFontFamily).toEqual(
          branding._codeFontStackDefault
        )
      })
    })
  })
})
