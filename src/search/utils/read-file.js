import { Observable } from 'rxjs'
import fs from 'graceful-fs'

export default function readFile(
  filePath,
  { emitError = false, maxLength = Infinity } = {}
) {
  return new Observable(observer => {
    let content = ''
    const readStream = fs.createReadStream(filePath, { encoding: 'utf8' })

    readStream.on('data', chunk => {
      content += chunk
      if (content.length >= maxLength) {
        readStream.destroy()
      }
    })
    readStream.on('end', () => {
      observer.next(content)
      observer.complete()
    })
    readStream.on('close', () => {
      observer.complete()
    })
    readStream.on('error', error => {
      if (emitError) {
        observer.error(error)
      } else {
        console.warn(`Could not read file: "${filePath}".`)
        observer.next(content)
        observer.complete()
      }
    })
  })
}
