import path from 'path'
import { fork } from 'child_process'
import observableFromProcess from '../utils/observable-from-process'

export const initService = service => {
  const servicePath = path.resolve(`dist_electron/service-${service}.js`)
  const forkedProcess = fork(servicePath)

  return {
    input: message => {
      forkedProcess.send(message)
    },
    output$: observableFromProcess(forkedProcess, service)
  }
}
