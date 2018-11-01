import { handleOrQueries } from '@search/utils/handle-or-queries'

/* eslint no-unused-expressions: 0 */
describe('Search util: handleOrQueries', () => {
  it('works with simple "x OR y" query', () => {
    const query = { text: 'vue OR vuex' }
    const search = jest.fn()
    handleOrQueries(search, query)
    expect(search).toHaveBeenCalledTimes(2)
    expect(search).toHaveBeenCalledWith({ ...query, text: 'vue' })
    expect(search).toHaveBeenCalledWith({ ...query, text: 'vuex' })
  })

  it('works with "x OR y OR z" query', () => {
    const query = { text: 'vue OR vuex OR vue-router' }
    const search = jest.fn()
    handleOrQueries(search, query)
    expect(search).toHaveBeenCalledTimes(3)
    expect(search).toHaveBeenCalledWith({ ...query, text: 'vue' })
    expect(search).toHaveBeenCalledWith({ ...query, text: 'vuex' })
    expect(search).toHaveBeenCalledWith({ ...query, text: 'vue-router' })
  })

  it('works with complex query', () => {
    const query = { text: 'vue OR vuex vue-router' }
    const search = jest.fn()
    handleOrQueries(search, query)
    expect(search).toHaveBeenCalledTimes(2)
    expect(search).toHaveBeenCalledWith({ ...query, text: 'vue vue-router' })
    expect(search).toHaveBeenCalledWith({
      ...query,
      text: 'vuex vue-router'
    })
  })

  it('works with two query terms', () => {
    const query = { text: 'vue OR react' }
    const search = jest.fn()
    handleOrQueries(search, query)
    expect(search).toHaveBeenCalledWith({ text: 'vue' })
    expect(search).toHaveBeenCalledWith({ text: 'react' })
  })

  it('works with a query containing multiple independent ORs', () => {
    const query = { text: 'vue OR react elm OR purescript' }
    const search = jest.fn()
    handleOrQueries(search, query)
    expect(search).toHaveBeenCalledWith({
      ...query,
      text: 'vue elm'
    })
    expect(search).toHaveBeenCalledWith({
      ...query,
      text: 'vue purescript'
    })
    expect(search).toHaveBeenCalledWith({
      ...query,
      text: 'react elm'
    })
    expect(search).toHaveBeenCalledWith({
      ...query,
      text: 'react purescript'
    })
  })

  it('works with terms immediately preceding/preceded by OR', () => {
    const query = { text: 'vue vuex OR react mobx' }
    const search = jest.fn()
    handleOrQueries(search, query)
    expect(search).toHaveBeenCalledTimes(2)
    expect(search).toHaveBeenCalledWith({
      ...query,
      text: 'vue vuex mobx'
    })
    expect(search).toHaveBeenCalledWith({
      ...query,
      text: 'vue react mobx'
    })
  })

  it('works with quoted queries', () => {
    const query = { text: 'regular expression OR "regular expression"' }
    const search = jest.fn()
    handleOrQueries(search, query)
    expect(search).toHaveBeenCalledTimes(2)
    expect(search).toHaveBeenCalledWith({
      ...query,
      text: 'regular expression'
    })
    expect(search).toHaveBeenCalledWith({
      ...query,
      text: 'regular "regular expression"'
    })
  })

  it('works with complex quoted query', () => {
    const query = { text: 'maven OR "gradle build" java OR kotlin' }
    const search = jest.fn()
    handleOrQueries(search, query)
    expect(search).toHaveBeenCalledWith({
      ...query,
      text: 'maven java'
    })
    expect(search).toHaveBeenCalledWith({
      ...query,
      text: 'maven kotlin'
    })
    expect(search).toHaveBeenCalledWith({
      ...query,
      text: '"gradle build" java'
    })
    expect(search).toHaveBeenCalledWith({
      ...query,
      text: '"gradle build" kotlin'
    })
  })

  it('works with colon words', () => {
    const query = {
      text: 'levenshtein lang:HTML OR lang:JavaScript OR lang:CSS'
    }
    const search = jest.fn()
    handleOrQueries(search, query)
    expect(search).toHaveBeenCalledTimes(3)
    expect(search).toHaveBeenCalledWith({
      ...query,
      text: 'levenshtein lang:HTML'
    })
    expect(search).toHaveBeenCalledWith({
      ...query,
      text: 'levenshtein lang:JavaScript'
    })
    expect(search).toHaveBeenCalledWith({
      ...query,
      text: 'levenshtein lang:CSS'
    })
  })
})
