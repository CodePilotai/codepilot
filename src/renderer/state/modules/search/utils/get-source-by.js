import flow from 'lodash/flow'

export default function getSourceBy(field, value) {
  const sourcesObject = require('../sources').default
  return flow(
    Object.keys,
    sourceKeys => sourceKeys.map(sourceKey => sourcesObject[sourceKey]),
    sources => sources.find(source => source[field] === value)
  )(sourcesObject)
}
