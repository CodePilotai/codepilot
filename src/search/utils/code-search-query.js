export default query => {
  let extensionsArray = []
  let returnedQuery
  for (const glob of query.includeOnly.split(',')) {
    let extension = glob.substring(glob.lastIndexOf('.') + 1, glob.length)
    // Add file extensions (This may not work for all searches)
    if (extension && !extensionsArray.includes(extension)) {
      extensionsArray.push(extension)
    }
  }

  returnedQuery = `${query.text} in:file`

  if (extensionsArray.length > 0) {
    returnedQuery += ` language:${extensionsArray.join(',')}`
  }

  if (query.append) {
    returnedQuery += ` ${query.append}`
  }

  return returnedQuery
}
