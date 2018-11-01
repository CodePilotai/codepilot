export default (result, branch) => {
  return (
    `result=${result.key}__branch=${branch.key}`
      // Needed to prevent unselectable refs on Windows
      .replace(/\\/g, '/')
  )
}
