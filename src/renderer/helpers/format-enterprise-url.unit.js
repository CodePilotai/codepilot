import formatEnterpriseUrl from './format-enterprise-url'

describe('Helper: Format Enterprise Url', () => {
  it('correctly formats test.codepilot.ai to "https://test.codepilot.ai"', () => {
    expect(formatEnterpriseUrl('test.codepilot.ai')).toEqual(
      'https://test.codepilot.ai'
    )
  })

  it('correctly formats test.codepilot.ai/ to "https://test.codepilot.ai"', () => {
    expect(formatEnterpriseUrl('test.codepilot.ai/')).toEqual(
      'https://test.codepilot.ai'
    )
  })

  it('correctly formats https://test.codepilot.ai to "https://test.codepilot.ai"', () => {
    expect(formatEnterpriseUrl('https://test.codepilot.ai')).toEqual(
      'https://test.codepilot.ai'
    )
  })
})
