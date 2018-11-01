import splitTest from './_split-test'

describe('@split-tests/_split-test', () => {
  it('works correctly with an array of string hypotheses', () => {
    const config = {
      key: 'foo',
      hypotheses: ['bar', 'baz']
    }
    const hypothesis = splitTest(config)

    expect(config.hypotheses).toContain(hypothesis.name)
    expect(config.hypotheses).toContain(hypothesis.value)
  })

  it('works correctly with object hypotheses', () => {
    const config = {
      key: 'foo',
      hypotheses: {
        a: 'b',
        c: 'd'
      }
    }
    const hypothesis = splitTest(config)

    expect(Object.keys(config.hypotheses)).toContain(hypothesis.name)
    expect(Object.values(config.hypotheses)).toContain(hypothesis.value)
  })
})
