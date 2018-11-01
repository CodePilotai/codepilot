import getMatchedLines from './get-matched-lines'

describe('@search/utils/get-matched-lines', () => {
  it('works with simple matching', () => {
    const lines = getMatchedLines(
      ['foo1', 'bar1', 'baz1', 'foo2', 'bar2', 'baz2'].join('\n'),
      'foo'
    )
    expect(lines).toEqual([
      { body: 'foo1', number: 1, column: 1, match: 'foo' },
      { body: 'foo2', number: 4, column: 1, match: 'foo' }
    ])
  })
})
