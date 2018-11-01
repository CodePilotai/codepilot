import { constructApiQuery } from './index'

require('jest-playback').setup(__dirname)

describe('@search/stackoverflow: constructApiQuery', () => {
  it('given a simple exclusion constructs correct StackOverflow API query', () => {
    const query = { text: 'props NOT jQuery' }
    expect(constructApiQuery(query)).toEqual('props -jQuery')
  })
  it('given multiple exclusions constructs correct StackOverflow API query', () => {
    const query = { text: 'props NOT jQuery NOT React' }
    expect(constructApiQuery(query)).toEqual('props -jQuery -React')
  })
  it('given no exclusions constructs correct StackOverflow API query', () => {
    const query = { text: 'Is React not reactive' }
    expect(constructApiQuery(query)).toEqual('Is React not reactive')
  })
  it('given simple search query to narrow down search using "AND" constructs correct StackOverflow API query', () => {
    const query = { text: 'sort AND JavaScript' }
    expect(constructApiQuery(query)).toEqual('sort JavaScript')
  })
  it('given complex search query to narrow down search using "AND" and "NOT" constructs correct StackOverflow API query', () => {
    const query = { text: 'sort AND JavaScript NOT bubble' }
    expect(constructApiQuery(query)).toEqual('sort JavaScript -bubble')
  })
})

describe('@search/stackoverflow', () => {
  const runSearch = createSearchRunner(__filename)

  it(
    'emits results with the correct structure',
    () => {
      return runSearch({ text: 'electron' }).then(results => {
        results.forEach(result => {
          expect(result.source).toEqual('Stack Overflow')
          expect(result.type).toEqual('question')
          expect(typeof result.title).toEqual('string')
          expect(typeof result.formattedBody).toEqual('string')
          if (result.answers.length) {
            expect(result.answers[0].question_id).toEqual(result.question_id)
            expect(typeof result.answers[0].formattedBody).toEqual('string')
          }
        })
      })
    },
    30000
  )
})
