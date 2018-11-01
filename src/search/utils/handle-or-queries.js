import { Observable } from 'rxjs'

export const handleOrQueries = function(searchDataSource, query) {
  // If the query contains at least one OR
  if (query.text.indexOf(' OR ') !== -1) {
    const queryTextChunks = query.text
      // Split the query text into chunks using whitespace
      // as a delimiter, but preserving quoted text
      .split(/('.*?'|".*?"|\S+)/)
      // Remove any chunks that only contain whitespace
      .filter(string => string.trim())

    // For each "OR" chunk, combine the surrounding
    // chunks into an array of possibilities
    let index = 1
    while (index < queryTextChunks.length - 1) {
      const currentChunk = queryTextChunks[index]
      if (currentChunk === 'OR') {
        const prevChunk = queryTextChunks[index - 1]
        const nextChunk = queryTextChunks[index + 1]
        if (Array.isArray(prevChunk)) {
          prevChunk.push(nextChunk)
          queryTextChunks.splice(index, 2)
        } else {
          queryTextChunks.splice(index - 1, 3, [prevChunk, nextChunk])
        }
      } else {
        index++
      }
    }

    // Normalize queryTextChunks so that every lone
    // possibility is wrapped in an array
    queryTextChunks.forEach((chunk, index) => {
      if (!Array.isArray(chunk)) {
        queryTextChunks[index] = [chunk]
      }
    })

    // Collect searches for each possible query text variation
    const searches = getAllPossibleQueryTexts(queryTextChunks).map(queryText =>
      searchDataSource({
        ...query,
        text: queryText
      })
    )

    // Merge results for every search variation
    return Observable.merge(...searches)
  } else {
    // Just run the search normally if the query text
    // does not contain any ORs
    return searchDataSource(query)
  }
}

function getAllPossibleQueryTexts(queryTextChunks) {
  if (queryTextChunks.length === 1) {
    return queryTextChunks[0]
  } else {
    const possibilities = []
    const allCasesOfRest = getAllPossibleQueryTexts(queryTextChunks.slice(1))
    for (let i = 0; i < allCasesOfRest.length; i++) {
      for (let j = 0; j < queryTextChunks[0].length; j++) {
        possibilities.push(queryTextChunks[0][j] + ' ' + allCasesOfRest[i])
      }
    }
    return possibilities
  }
}
