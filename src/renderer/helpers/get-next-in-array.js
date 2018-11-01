export default ({ array, currentItem, currentIndex = -1, circular = true }) => {
  if (currentItem) {
    currentIndex = array.indexOf(currentItem)
  }

  const nextIndex =
    currentIndex === array.length - 1
      ? circular
        ? 0
        : currentIndex
      : currentIndex + 1

  return {
    index: nextIndex,
    value: array[nextIndex]
  }
}
