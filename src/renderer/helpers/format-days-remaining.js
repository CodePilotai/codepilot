import parseDate from './parse-date'

export default date => {
  const oneDay = 1000 * 60 * 60 * 24
  const today = Date.now()
  const periodEndDate = parseDate(date)
  const daysRemainingInPeriod = Math.ceil((periodEndDate - today) / oneDay)
  return daysRemainingInPeriod
}
