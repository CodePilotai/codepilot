export default function truncatePath(pathName, truncationLength) {
  let truncatedPath = pathName.slice(-truncationLength)
  if (pathName.length < truncationLength + 1) {
    return pathName
  } else {
    return '...' + truncatedPath
  }
}
