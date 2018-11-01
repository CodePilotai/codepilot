import flatten from 'lodash/flatten'

export default function flattenResults(searchResults) {
  return flatten(
    searchResults.map(result => {
      return result.branches
    })
  )
}
