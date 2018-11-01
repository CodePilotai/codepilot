import createQuestionMapper from './question-mapper'

const answer = {
  question_id: 1,
  owner: { display_name: 'test' },
  body: '<code>testing</code>'
}

describe('@search/stackoverflow/question-mapper', () => {
  it('should return a mapping function', () => {
    const mapper = createQuestionMapper([1])
    expect(typeof mapper).toEqual('function')
  })

  describe('questionMapper', () => {
    it('should map the question to the correct structure', () => {
      const mapper = createQuestionMapper([answer])
      const question = {
        title: 'testing',
        question_id: 1,
        body: '<a href="test">Just a test</a>'
      }
      expect(mapper(question)).toEqual({
        title: 'testing',
        question_id: 1,
        body: '<a href="test">Just a test</a>',
        source: 'Stack Overflow',
        type: 'question',
        answers: [
          {
            ...answer,
            formattedBody: '`testing`'
          }
        ],
        formattedBody: '[Just a test](test)'
      })
    })
  })
})
