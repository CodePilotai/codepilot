import { Observable } from 'rxjs'
export default function(process, name) {
  return new Observable(observer => {
    const messageHandler = data => {
      if (data.error) {
        console.warn(`Error inside ${name} process.`, data.error)
        observer.error(data.error)
      } else {
        observer.next(data)
      }
    }

    process.on('message', messageHandler)
  }).share()
}
