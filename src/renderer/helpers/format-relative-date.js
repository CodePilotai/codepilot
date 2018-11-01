import parseDate from './parse-date'
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now'

export default date => {
  date = parseDate(date)
  // https://date-fns.org/v1.29.0/docs/distanceInWordsToNow
  return distanceInWordsToNow(date) + ' ago'
}
