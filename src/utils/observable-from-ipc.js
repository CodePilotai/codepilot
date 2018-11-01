import { Observable } from 'rxjs'
import { ipcRenderer as ipc } from 'electron'

export default function(channel) {
  return new Observable(observer => {
    ipc.on(`${channel}-data`, (event, data) => {
      observer.next(data)
    })
    ipc.on(`${channel}-error`, (event, data) => {
      console.warn(`Error inside ${channel} channel.`, data.error)
      observer.error(data.error)
    })
  }).share()
}
