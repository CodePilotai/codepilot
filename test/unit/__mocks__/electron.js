const electron = {
  remote: {
    getCurrentWindow: () => ({
      setTitle: () => {},
      isVisible: () => {},
      isFocused: () => {},
      show: () => {},
      hide: () => {}
    }),
    app: {
      getName: () => '',
      getPath: () => '',
      on: () => {}
    },
    dialog: {
      showOpenDialog: () => {}
    },
    globalShortcut: {
      register: () => {},
      unregister: () => {},
      unregisterAll: () => {}
    }
  },
  shell: {
    openExternal: () => {}
  }
}

electron.app = electron.remote.app

export default electron
