import { app, shell, Menu } from 'electron'

export default () => {
  const appName = app.getName()
  const releaseNotes = {
    label: 'Release Notes',
    click() {
      shell.openExternal(
        'https://github.com/CodePilotai/codepilot-vue/pulls?q=is%3Apr+is%3Aclosed'
      )
    }
  }
  const sendFeedback = {
    label: 'Send Feedback',
    click() {
      global.mainWindow.webContents.send('sendFeedback', {
        smileyVisibility: true
      })
    }
  }
  const keyboardShortcuts = {
    label: 'Keyboard Shortcuts',
    accelerator: 'CommandOrControl+K',
    click() {
      global.mainWindow.send('showKeyboardShortcuts')
    }
  }

  const finder = {
    label: 'Finder',
    accelerator: 'CommandOrControl+F',
    click() {
      global.mainWindow.send('showFinder')
    }
  }

  const settings = {
    label: 'Settings',
    click() {
      global.mainWindow.send('goToSettings')
    }
  }
  const clearSettings = {
    label: 'Clear Settings',
    click() {
      global.mainWindow.send('clear-settings-confirmation')
    }
  }
  const helpMenuItems = [
    releaseNotes,
    sendFeedback,
    { role: 'reload' },
    { role: 'toggledevtools' },
    keyboardShortcuts,
    finder,
    clearSettings
  ]
  const menuTemplate = [
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        {
          label: 'Focus Search Input',
          accelerator: 'CommandOrControl+S',
          click() {
            global.mainWindow.send('focusSearchInput')
          }
        },
        {
          label: 'Search Selected Text',
          accelerator: 'CommandOrControl+P',
          click() {
            global.mainWindow.send('search-with-codepilot')
          }
        }
      ]
    },
    {
      label: 'Selection',
      submenu: [{ role: 'selectall' }]
    },
    {
      label: 'View',
      submenu: [
        { role: 'togglefullscreen' },
        {
          label: 'Zoom In',
          accelerator: 'CommandOrControl+=',
          click() {
            global.mainWindow.send('zoomIn')
          }
        },
        {
          label: 'Zoom Out',
          accelerator: 'CommandOrControl+-',
          click() {
            global.mainWindow.send('zoomOut')
          }
        },
        {
          label: 'Reset Zoom',
          accelerator: 'CommandOrControl+0',
          click() {
            global.mainWindow.send('resetZoom')
          }
        }
      ]
    },
    {
      role: 'window',
      submenu: [{ role: 'minimize' }, { role: 'close' }, { role: 'quit' }]
    },
    {
      role: 'help',
      submenu: helpMenuItems
    }
  ]

  if (process.platform === 'darwin') {
    menuTemplate.unshift({
      label: appName,
      submenu: [{ role: 'about' }, settings, { role: 'quit' }]
    })
  } else {
    helpMenuItems.unshift(settings)
  }

  Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplate))
}
