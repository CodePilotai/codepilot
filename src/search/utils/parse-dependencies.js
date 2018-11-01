import { Observable } from 'rxjs'
import readFile from './read-file'
import parseDependenciesFromPackageJson from './parse-dependencies-from-package-json'

export default function parseDependencies(filePath) {
  return parseDependenciesForFileType(filePath).catch(error => {
    // TODO: Need to figure out what is causing the error below
    console.warn(
      `Dependencies could not be parsed for file: "${filePath}".`,
      error
    )
    return Observable.of({
      dependencies: null,
      devDependencies: null,
      packageName: null,
      version: null
    })
  })
}

function parseDependenciesForFileType(filePath) {
  const content$ = readFile(filePath).filter(content => {
    return !content.startsWith('404')
  })

  if (/package\.json$/.test(filePath))
    return content$.pipe(parseDependenciesFromPackageJson)

  return Observable.throw('Could not find appropriate dependencies parser.')
}
