export default function mergeSearchStatuses(sourceStoreKeys, results) {
  // Get only the sources that exist in the results object.
  const sourcesInResults = sourceStoreKeys.filter(
    sourceStoreKey => results[sourceStoreKey]
  )

  // If no sources have corresponding results, then return
  // complete, because these sources (e.g. Web Results) are
  // always complete.
  if (!sourcesInResults.length) {
    return 'complete'
  }

  return sourcesInResults.every(
    source => results[source].meta.status === 'neverRun'
  )
    ? 'neverRun'
    : sourcesInResults.some(source => results[source].meta.status === 'pending')
      ? 'pending'
      : 'complete'
}
