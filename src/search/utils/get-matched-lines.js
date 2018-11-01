import uniqBy from 'lodash/uniqBy'

export default function getMatchedLines(content, queryText) {
  const mergedQuery = queryText
    .replace(/\s+/g, ' ')
    .match(/\w+/g)
    // NOTE: Filter out query partials that are just 1 character
    .filter(word => word.length > 1)
    .join('|')
  const queryRegex = new RegExp(`\\b(${mergedQuery})\\b`, 'i')

  const lines = content
    .split('\n')
    .map((line, index) => ({ number: index + 1, body: line }))
    .filter(line => line.body.length)

  const fullyMatchedLines = uniqBy(
    lines
      .map(line => ({
        ...line,
        column: line.body.indexOf(queryText) + 1,
        match: queryText
      }))
      .filter(line => line.column > 0),
    'number'
  )

  const partiallyMatchedLines = uniqBy(
    lines
      .filter(
        line =>
          !fullyMatchedLines.find(
            matchedLine => matchedLine.number === line.number
          )
      )
      .map(line => {
        const match = line.body.match(queryRegex)
        if (match) {
          return {
            ...line,
            column: match.index + 1,
            match: match[0]
          }
        } else {
          return {
            ...line,
            column: -1
          }
        }
      })
      .filter(line => line.column > 0),
    'number'
  )

  return fullyMatchedLines.concat(partiallyMatchedLines).slice(0, 30)
}
