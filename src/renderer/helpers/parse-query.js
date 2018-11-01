import parser from 'lucene-query-parser'

export default queryText => {
  // lucene-query-parser throws an exception when passed certain regex expression
  // to prevent the search from hanging when an error occurs while parsing the query text
  // we return null if an error happens during the parse.
  try {
    return parser.parse(queryText)
  } catch (errorParsingText) {
    return null
  }
}
