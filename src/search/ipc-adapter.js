import observableFromIpc from '../utils/observable-from-ipc'
import { ipcRenderer as ipc } from 'electron'

export default function (channel) {
  return {
    input: options => {
      ipc.send(`file-reader-send`, options)
    },
    output$: observableFromIpc(channel)
  }
}
