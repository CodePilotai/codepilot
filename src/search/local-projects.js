import { Observable } from 'rxjs'
import ripgrepSearch from './ripgrep'
import { readFile } from './utils/file-system-utils'

export default function findLocalProjects(directory) {
  const ripgrepSearchPromise = ripgrepSearch({
    text: '{',
    directory,
    resultsPerFile: 1,
    includeGlob: '{**/package.json,**/package.json/**}'
  })

  return Observable.fromPromise(ripgrepSearchPromise)
    .map(stream => stream.results)
    .flatMap(Observable.from)
    .map(file => ({
      ...file.file,
      localPath: file.file.path
    }))
    .flatMap(readFile)
    .map(file => {
      try {
        const parsedContent = JSON.parse(file.body)
        return {
          name: parsedContent.name,
          dependencies: parsedContent.dependencies,
          devDependencies: parsedContent.devDependencies
        }
      } catch (e) {
        console.warn(
          'The following package.json file is not a correct JSON file: ',
          file.localPath
        )
        return null
      }
    })
    .filter(file => file)
}
