import parseDate from './parse-date'
import formatDate from 'date-fns/format'

export default date => {
  date = parseDate(date)
  // https://date-fns.org/v1.29.0/docs/format
  return formatDate(date, 'MMM Do, YYYY')
}
