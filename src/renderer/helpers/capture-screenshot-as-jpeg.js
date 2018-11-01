import electron from 'electron'

export default ({ callback }) => {
  electron.remote.getCurrentWindow().capturePage(buffer => {
    callback(buffer.toJPEG(95))
  })
}
