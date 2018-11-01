import { Observable } from 'rxjs'
import temp from 'temp'
import path from 'path'
import os from 'os'

// HACK: Temporary directory not being set correctly on Windows,
// So over-riding it
temp.dir = path.resolve(os.tmpdir())

// Create a temporary directory we can save files to.
export default function createTmpDirectory(name) {
  // HACK: For some reason the function emitted twice,
  // that’s why we had to add this `completed` check
  // Do not remove unless the real reason for that was found.
  let completed = false

  return new Observable(observer => {
    temp.mkdir(name, (error, tmpDirectory) => {
      if (error) {
        observer.error(error)
      } else {
        if (!completed) {
          completed = true
          observer.next(tmpDirectory)
          observer.complete()
        }
      }
    })
  })
}
