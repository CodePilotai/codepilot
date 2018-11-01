import flow from 'lodash/flow'
import uniq from 'lodash/uniq'
import compact from 'lodash/compact'
import getSourceBy from './get-source-by'

export default function getSourceKeysForResults(results) {
  return flow(
    // Get each source by the name o
    results => results.map(result => getSourceBy('name', result.source)),
    // Remove duplicate sources
    uniq,
    // Remove any non-existant sources
    compact,
    // Transform the sources to a list of their store keys
    sources => sources.map(source => source.storeKey)
  )(results)
}
