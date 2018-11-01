import searchIntents from '../intents'

export default function createEmptySourceResults() {
  return searchIntents
    .map(searchIntent => searchIntent.sources)
    .reduce((resultsHash, sources) => {
      return {
        ...resultsHash,
        ...sources.reduce((sourcesHash, source) => {
          return {
            ...sourcesHash,
            [source.storeKey]: {
              meta: { status: 'neverRun', durationInSeconds: 0 },
              totalPages: 1,
              lastSearchedPage: 0,
              items: []
            }
          }
        }, {})
      }
    }, {})
}
