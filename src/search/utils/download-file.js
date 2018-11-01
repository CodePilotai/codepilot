import fs from 'graceful-fs'
import path from 'path'
import request from 'superagent'
import { Observable } from 'rxjs'
import createLocalDirectory from './create-local-directory'

export default function downloadFile(
  downloadUrl,
  downloadPath,
  { headers } = {},
  { emitError = false } = {}
) {
  return Observable.concat(
    createLocalDirectory(path.dirname(downloadPath)),
    new Observable(observer => {
      const writeStream = fs.createWriteStream(downloadPath)

      request
        .get(downloadUrl)
        .set(headers || {})
        .on('error', error => {
          const detailedError = {
            message: `Error downloading file "${downloadUrl}"`,
            error
          }
          if (emitError) {
            observer.error(detailedError)
          } else {
            console.warn(detailedError)
            observer.complete()
          }
        })
        .pipe(writeStream)

      writeStream.on('finish', () => {
        observer.next(downloadPath)
        observer.complete()
      })
    })
  ).last()
}
