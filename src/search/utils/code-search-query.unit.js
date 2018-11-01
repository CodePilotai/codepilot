import codeSearchQuery from './code-search-query'

describe('Search Util: codeSearchQuery', () => {
  it('removes "language:" if includeOnly filter is empty', () => {
    let query = codeSearchQuery({ text: 'test', includeOnly: '' })
    expect(query).not.toContain('language:')
  })

  it('if "text" is in query, "text" is also in the returned query', () => {
    let query = codeSearchQuery({ text: 'test', includeOnly: '' })
    expect(query).toContain('test')
  })

  it('if includeOnly is "*.js", "language:js" is in the returned query', () => {
    let query = codeSearchQuery({ text: 'test', includeOnly: '*.js' })
    expect(query).toContain('language:js')
  })

  it('if includeOnly is "*.js, *.java", "language:js,java" is in the returned query', () => {
    let query = codeSearchQuery({ text: 'test', includeOnly: '*.js, *.java' })
    expect(query).toContain('language:js,java')
  })

  it('if includeOnly is "Dockerfile", "language:Dockerfile" is in the returned query', () => {
    let query = codeSearchQuery({ text: 'test', includeOnly: 'Dockerfile' })
    expect(query).toContain('language:Dockerfile')
  })

  it('if includeOnly is "my-test.spec.js", "language:js" is in the returned query', () => {
    let query = codeSearchQuery({
      text: 'test',
      includeOnly: 'my-test.spec.js'
    })
    expect(query).toContain('language:js')
  })

  it('if includeOnly is "test-a.js,test-b.js", "language:js" is in the returned query', () => {
    let query = codeSearchQuery({
      text: 'test',
      includeOnly: 'test-a.js,test-b.js'
    })
    expect(query).toMatch(/\blanguage:js$/)
  })
})
