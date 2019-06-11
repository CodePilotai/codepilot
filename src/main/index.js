'use strict'

import packageConfig from '../../package.json'
import * as path from 'path'
import electron, {
  app,
  BrowserWindow,
  ipcMain as ipc,
  Menu,
  MenuItem,
  shell
} from 'electron'
import {
  minWindowSize,
  getWindowDimensions,
  saveWindowDimensions
} from './window-dimensions'

import initMenu from './init-menu'
import initTray from './init-tray'
import settings from 'electron-settings'
import { format as formatUrl } from 'url'
import {
  createProtocol,
  installVueDevtools
} from 'vue-cli-plugin-electron-builder/lib'
import fileReader from './file-reader'

import { appMenuTemplate } from './menu-template'

if (process.env.NODE_ENV !== 'production') {
  // Don't load any native (external) modules until the following line is run:
  require('module').globalPaths.push(process.env.NODE_MODULES_PATH)
}

if (process.env.SPECTRON) {
  settings.deleteAll()
  require('../../test/e2e/mock.js')({ electron })
}

// Force Single Instance Application
// const shouldQuit = app.makeSingleInstance((argv, workingDirectory) => {
const shouldQuit = app.requestSingleInstanceLock()
app.on('second-instance', (event, argv, workingDirectory) => {
  // Someone tried to run a second instance, we should focus our window.

  // Protocol handler for win32
  // argv: An array of the second instance’s (command line / deep linked) arguments
  if (process.platform === 'win32') {
    // Keep only command line / deep linked arguments
    processDeepLinkingUrl(argv.slice(1))
  }

  if (global.mainWindow) {
    if (global.mainWindow.isMinimized()) global.mainWindow.restore()
    global.mainWindow.focus()
  }
})
if (shouldQuit) {
  app.exit()
}

// Set the name of the app
app.setName(packageConfig.build.productName)

function createWindow() {
  // Initialize the menu bar
  initMenu()

  // Get either saved or default window dimensions
  const windowDimensions = getWindowDimensions()

  global.mainWindow = new BrowserWindow({
    ...windowDimensions.bounds,
    frame: false,
    titleBarStyle: 'hiddenInset',
    minWidth: minWindowSize.width,
    minHeight: minWindowSize.height,
    webPreferences: {
      // If we are in dev, disable webSecurity to prevent CORS errors
      webSecurity: process.env.NODE_ENV === 'production'
    }
  })

  // Protocol handler for win32
  if (process.platform === 'win32') {
    // Keep only command line / deep linked arguments
    processDeepLinkingUrl(process.argv.slice(1))
  }

  // To start the app as maximized
  if (windowDimensions.isMaximized) {
    global.mainWindow.maximize()
  }

  if (process.env.NODE_ENV !== 'production') {
    // Load the url of the dev server if in development mode
    global.mainWindow.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) global.mainWindow.webContents.openDevTools()
  } else {
    createProtocol('app')
    //   Load the index.html when not in development
    global.mainWindow.loadURL(
      formatUrl({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file',
        slashes: true
      })
    )
  }

  // Initialize the tray icon
  initTray()

  global.mainWindow.webContents.on('devtools-opened', () => {
    global.mainWindow.focus()
    setImmediate(() => {
      global.mainWindow.focus()
    })
  })

  // Save the current window dimensions before the
  // window closes.
  global.mainWindow.on('close', saveWindowDimensions)

  global.mainWindow.on('closed', () => {
    global.mainWindow = null
  })
}

// create main BrowserWindow when electron is ready
app.on('ready', async () => {
  if (process.env.NODE_ENV !== 'production' && !process.env.SPECTRON) {
    // Install Vue Devtools
    await installVueDevtools()
  }
  createWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.exit()
  }
})

app.on('activate', () => {
  if (global.mainWindow === null) {
    createWindow()
  } else {
    app.show() // macOS
    global.mainWindow.show()
  }
})

ipc.on('display-app-menu', (event, arg) => {
  const appMenu = Menu.buildFromTemplate(appMenuTemplate)

  appMenu.popup(global.mainWindow, arg.x, arg.y)
})

// The setAsDefaultProtocolClient only works on packaged versions of the application
app.setAsDefaultProtocolClient('codepilot')

// Protocol handler for osx
app.on('open-url', function(event, url) {
  event.preventDefault()
  processDeepLinkingUrl(url)
})

ipc.on('display-view-pane-context-menu', (event, arg) => {
  // Receive event from renderer process and construct
  // context menu for opening current viewable in other
  // application.
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Search Selected Text',
      accelerator: 'CommandOrControl+P',
      click: () => {
        event.sender.send('search-with-codepilot')
      }
    },
    {
      type: 'separator'
    },
    {
      role: 'copy'
    }
  ])

  contextMenu.popup(global.mainWindow, arg.x, arg.y)
})

ipc.on('display-file-context-menu', (event, arg) => {
  // Receive event from renderer process and construct
  // context menu for opening current viewable in other
  // application.
  const contextMenu = new Menu()
  contextMenu.append(
    new MenuItem({
      label: 'Open Item',
      click() {
        shell.openItem(arg.path)
      }
    })
  )
  contextMenu.append(
    new MenuItem({
      label: 'Show Item in Folder',
      click() {
        shell.showItemInFolder(arg.path)
      }
    })
  )

  contextMenu.popup(global.mainWindow, arg.x, arg.y)
})

ipc.on('display-link-context-menu', (event, arg) => {
  // Receive event from renderer process and construct
  // context menu for opening current viewable in browser.
  const contextMenu = new Menu()
  contextMenu.append(
    new MenuItem({
      label: 'Open in browser',
      click() {
        shell.openExternal(arg.link)
      }
    })
  )

  contextMenu.popup(global.mainWindow, arg.x, arg.y)
})

ipc.on('close-application', (event, arg) => {
  app.exit()
})

ipc.on('file-reader-send', (event, arg) => {
  fileReader(arg, event.sender)
})

function processDeepLinkingUrl(url) {
  // Parse the protocol used for deep linking out and only
  // keep the parameter that we send for performing certain actions
  let parameters = url
    .toString()
    .replace(/(^\w+:|^)\/\//, '')
    .split('/')

  // If there was no parameter, avoid doing any furthur work and return
  if (!parameters) return

  // This is just a demo for now until we figure out what functionality we
  // want to support with deep linking. Theoretically we could do anything
  // from app navigation all the way to performing searches.
  if (parameters[0] === 'search') {
    if (global.mainWindow) {
      global.mainWindow.webContents.send('run-deep-link-search', {
        query: decodeURI(parameters[2]),
        intent: parameters[1]
      })
    }
  }
}
