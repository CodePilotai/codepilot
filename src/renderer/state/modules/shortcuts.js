import electron from 'electron'
// https://github.com/nathanbuchar/electron-settings
import settings from 'electron-settings'

// Ensure no shortcuts are registered when the app starts
electron.remote.globalShortcut.unregisterAll()

export default {
  state: {
    // Global, OS-level keyboard shortcuts
    global: {
      toggleAppFocus: []
    },
    // Shortcuts that only work when the app
    // is in focus
    local: {}
  },
  mutations: {
    SET_SHORTCUTS(state, newShortcuts) {
      state.global = newShortcuts.global
      state.local = newShortcuts.local
    },
    SET_TOGGLE_APP_FOCUS_SHORTCUT(state, newShortcut) {
      state.global.toggleAppFocus = newShortcut
    }
  },
  actions: {
    updateToggleAppFocusShortcut({ commit, state }, newShortcut) {
      updateGlobalShortcut(
        newShortcut,
        state.global.toggleAppFocus,
        toggleAppFocus
      )
      commit('SET_TOGGLE_APP_FOCUS_SHORTCUT', newShortcut)
      settings.set('shortcuts', state)
    },
    initShortcuts({ commit, state }) {
      const savedShortcuts = settings.get('shortcuts')
      if (savedShortcuts) {
        commit('SET_SHORTCUTS', savedShortcuts)
      }
      updateGlobalShortcut(state.global.toggleAppFocus, null, toggleAppFocus)
    }
  }
}

// ===
// Callbacks
// ===

function toggleAppFocus(newShortcut, oldShortcut, callback) {
  const mainWindow = electron.remote.getCurrentWindow()
  // https://github.com/electron/electron/blob/master/docs/api/browser-window.md#instance-methods
  if (mainWindow.isVisible() && mainWindow.isFocused()) {
    mainWindow.hide()
  } else {
    mainWindow.show()
    const searchInput = document.getElementById('SearchForm-searchInput')
    if (searchInput) {
      searchInput.focus()
      searchInput.select()
    }
  }
}

// ===
// Helpers
// ===

function updateGlobalShortcut(newShortcut, oldShortcut, callback) {
  if (oldShortcut && oldShortcut.length) {
    unregisterGlobalShortcut(oldShortcut)
  }
  if (newShortcut && newShortcut.length) {
    registerGlobalShortcut(newShortcut, callback)
  }

  // https://github.com/electron/electron/blob/master/docs/api/global-shortcut.md#globalshortcutregisteraccelerator-callback
  function registerGlobalShortcut(shortcut, callback) {
    electron.remote.globalShortcut.register(parseShortcut(shortcut), callback)
  }

  // https://github.com/electron/electron/blob/master/docs/api/global-shortcut.md#globalshortcutunregisteraccelerator
  function unregisterGlobalShortcut(shortcut) {
    electron.remote.globalShortcut.unregister(parseShortcut(shortcut))
  }

  function parseShortcut(shortcut) {
    return shortcut
      .map(key => {
        if (key === 'Meta') return 'Super'
        if (key === ' ') return 'Space'
        return key
      })
      .join('+')
  }
}
