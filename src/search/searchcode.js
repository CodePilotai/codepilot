import fs from 'graceful-fs'
import searchcodeApiSearch from './utils/searchcode-api-search'
import filePathFilter from './utils/file-path-filter'
import downloadFile from './utils/download-file'
import readFile from './utils/read-file'
import getMatchedLines from './utils/get-matched-lines'
import fileContentFilter from './utils/file-content-filter'

export default query => {
  return (
    // ===
    // Initial fetch of results
    // ===

    searchcodeApiSearch({ query })
      // ===
      // Initial filtering of results
      // ===

      .filter(file => filePathFilter(file.relativePath))

      // ===
      // Get extra info/resources for each result
      // ===

      .delayWhen(file => downloadFile(file.downloadUrl, file.path))
      .filter(file => fs.existsSync(file.path))
      .flatMap(
        file => readFile(file.path, { maxLength: 100000 }),
        (file, body) => ({
          ...file,
          body,
          lines: getMatchedLines(body, query.text).map(line => ({
            file: {
              ...file,
              line
            }
          }))
        })
      )

      // ===
      // Filter based on extra info/resources
      // ===

      .filter(
        file =>
          // Only include files with at least one matching line of code
          file.lines.length &&
          // Only include files that match our content constraints &&
          fileContentFilter(file.body) &&
          // Only include files that don't contain any NOT strings
          (!query.notStrings ||
            query.notStrings.every(
              notString =>
                !file.body.toLowerCase().includes(notString.toLowerCase())
            ))
      )

      // ===
      // Final mapping of results
      // ===

      .map(file => ({ results: file }))

      // ===
      // Error handling
      // ===

      .catch(error => {
        console.warn(error)
      })
  )
}
