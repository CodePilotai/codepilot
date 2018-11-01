export default ({ array, currentItem, currentIndex = -1, circular = true }) => {
  if (currentItem) {
    currentIndex = array.indexOf(currentItem)
  }

  const prevIndex =
    currentIndex <= 0
      ? circular
        ? array.length - 1
        : currentIndex
      : currentIndex - 1

  return {
    index: prevIndex,
    value: array[prevIndex]
  }
}
