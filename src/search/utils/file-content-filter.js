export default function fileContentFilter(fileContent) {
  return (
    // Only files larger than 30 chars
    fileContent.length >= 30 &&
    // Only files smaller than than 100000 chars
    fileContent.length < 100000 &&
    // Only files without any lines longer than 500 chars
    !fileContent.split('\n').some(line => line.length > 500)
  )
}
