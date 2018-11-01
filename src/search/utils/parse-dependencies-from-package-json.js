export default function parseDependenciesFromPackageJson(content$) {
  return content$.map(content => {
    const parsedContent = JSON.parse(content)
    return {
      dependencies: parsedContent.dependencies,
      devDependencies: parsedContent.devDependencies,
      packageName: parsedContent.name,
      version: parsedContent.version
    }
  })
}
