import parseDate from 'date-fns/parse'

export default preDate => {
  // If the date is a number before Sat Mar 03 1973 04:46:40,
  // then assume it's actually counting seconds rather than
  // milliseconds and parse it accordingly.
  if (typeof preDate === 'number' && preDate < 100000000000) {
    const date = new Date(0)
    date.setSeconds(preDate)
    return date
  }

  return parseDate(preDate)
}
