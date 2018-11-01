import request from 'superagent'
import pick from 'lodash/pick'

const resultRankingApiHostname = process.env.RESULT_RANKER_API_HOSTNAME

// The search arguments that we are receiving here will consist of two
// variables that we will be sending to the result ranker. These include
// the query and the actual results themselves.
export default searchArguments => {
  const rankingPayload = {
    ...searchArguments,
    // Remove any data we don't need in order to rank results.
    results: searchArguments.results.map(result =>
      // Only send the `title` and `body` fields to the ranker,
      // since they are the only fields currently used.
      pick(result, ['title', 'body'])
    )
  }
  // If the ranking payload is larger than 6MB,
  // AWS will fail so just resolve to empty scores.
  if (JSON.stringify(rankingPayload).length > 6000000) {
    return Promise.resolve({})
  }

  const emptyScores = searchArguments.results.map(r => 0)

  const timer = new Promise(resolve =>
    setTimeout(
      () =>
        resolve({
          body: {
            scores: emptyScores
          }
        }),
      5000
    )
  )

  const rankerPromise = request.post(resultRankingApiHostname, rankingPayload)

  return Promise.race([timer, rankerPromise])
    .then(response => mapScores(response.body.scores, searchArguments))
    .catch(error => {
      // Log the error from lambda
      console.error(error)
      // Return like we normally would but with all zeros for ranking scores
      // to prevent the search from breaking.
      return mapScores(emptyScores, searchArguments)
    })
}

function mapScores(scores, searchArguments) {
  // Reduce the result scores into an object of result keys
  // and their corresponding scores.
  return scores
    .map((score, scoreIndex) => ({
      [searchArguments.results[scoreIndex].key]: score
    }))
    .reduce((a, b) => Object.assign({}, a, b), {})
}
