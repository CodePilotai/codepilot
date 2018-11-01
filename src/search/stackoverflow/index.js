import request from 'superagent'
import { Observable } from 'rxjs'
import createQuestionMapper from './question-mapper'

export default query => {
  // Perform a search against the Stack Overflow API
  const searchPromise = stackoverflowApi.get({
    // https://api.stackexchange.com/docs/advanced-search
    endpoint: 'search/advanced',
    params: {
      q: constructApiQuery(query),
      // also match for query text in title
      intitle: query.text,
      // The minimum number of answers returned questions must have.
      answers: 0,
      // Sort by the number of votes, descending.
      sort: 'votes',
      order: 'desc',
      // The minimum number of votes the question must have.
      min: 0,
      // Include the question body in the results.
      filter: 'withBody',
      // Return up to 100 results, instead of the default 30.
      pagesize: 100
    }
  })

  return (
    Observable
      // Use the search promise as the source for the stream
      .fromPromise(searchPromise)
      .map(response => response.body.items)
      .flatMap(Observable.from)
      .bufferCount(5)
      .concatMap(
        // Use the resolved questions to get a list
        // of accepted answers IDs
        // Then use the IDs to get their answers
        questions => {
          const ids = questions.map(q => q.question_id)
          return stackoverflowApi.getQuestionsAnswers(ids)
        },
        // Use both questions and accepted answers to create
        // a normalized results list
        (questions, answersResponse) => {
          const questionMapper = createQuestionMapper(
            answersResponse.body.items
          )
          return {
            results: questions.map(questionMapper)
          }
        }
      )
      .catch(console.error)
  )
}

export const constructApiQuery = function(query) {
  return (
    query.text
      // For exclusions, Stack Overflow search supports "-termToExclude" syntax
      .replace(/\bNOT\s+/g, '-')
      // Stack Overflow search supports AND as the default
      .replace(/\bAND\s+/g, '')
  )
}

export const stackoverflowApi = {
  // A generic function for making Stack Overeflow GET requests.
  get({ endpoint, params }) {
    const apiBaseUrl = 'https://api.stackexchange.com/2.2/'
    endpoint = endpoint.replace(apiBaseUrl, '')
    return request.get(apiBaseUrl + endpoint).query({
      site: 'stackoverflow',
      key: process.env.STACKOVERFLOW_API_KEY,
      ...params
    })
  },
  getQuestionsAnswers(questionIds) {
    return this.get({
      // https://api.stackexchange.com/docs/answers-by-ids
      endpoint: `questions/${questionIds.join(';')}/answers`,
      params: {
        sort: 'votes',
        order: 'desc',
        filter: 'withBody',
        pagesize: 100
      }
    })
  }
}
