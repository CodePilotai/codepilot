import path from 'path'
import mkdirp from 'mkdirp'
import { Observable } from 'rxjs'

export default function createLocalDirectory(...dirs) {
  const dirPath = path.join(...dirs)
  return new Observable(observer => {
    mkdirp(dirPath, () => {
      observer.next(dirPath)
      observer.complete()
    })
  })
}
