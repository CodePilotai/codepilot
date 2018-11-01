import convertHtmlToMarkdown from './convert-html-to-markdown'

describe('Search Util: convertHtmlToMarkdown', () => {
  it('correctly formats "<b>test</b>" as "** test **"', () => {
    expect(convertHtmlToMarkdown('<b>test</b>')).toEqual('** test **')
  })

  it('correctly formats "<i>test</i>" as "_test_"', () => {
    expect(convertHtmlToMarkdown('<i>test</i>')).toEqual('* test *')
  })

  it('correctly formats "<code>test</code>" as "`test`"', () => {
    expect(convertHtmlToMarkdown('<code>test</code>')).toEqual('`test`')
  })

  it('correctly formats "&#42;test&#42;" decodes to "*test*"', () => {
    expect(convertHtmlToMarkdown('&#42;test&#42;')).toEqual('*test*')
  })

  it('correctly formats "&#32;test&#32;" decodes to " test "', () => {
    expect(convertHtmlToMarkdown('&#32;test&#32;')).toEqual(' test ')
  })
})
