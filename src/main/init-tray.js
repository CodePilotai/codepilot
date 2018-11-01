import path from 'path'
import { app, Tray } from 'electron'
import icon from '@assets/images/icon.png'

export default () => {
  let tray
  // For more info: https://electronjs.org/docs/api/tray
  if (process.env.NODE_ENV !== 'production') {
    tray = new Tray('src/renderer/assets/images/icon.png')
  } else {
    tray = new Tray(path.join(__dirname, icon))
  }
  tray.setToolTip('CodePilot.ai')
  tray.setHighlightMode('never')

  tray.on('click', () => {
    if (!global.mainWindow.isVisible()) {
      global.mainWindow.show()
    }
  })

  app.on('window-all-closed', () => {
    tray.destroy()
  })

  global.mainWindow.on('hide', () => {
    tray.setHighlightMode('selection')
  })

  global.mainWindow.on('show', () => {
    tray.setHighlightMode('never')
  })
}
