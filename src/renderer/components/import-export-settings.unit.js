import ImportExportSettings from './import-export-settings'

jest.mock('fs', () => ({
  readFile: (path, _cb) => {
    if (path === 'c') {
      return _cb(
        undefined,
        `{
          "appVersion": "myAppVersion"
        }`
      )
    } else if (path === 'w') {
      return _cb(undefined, ']d')
    } else {
      return _cb(true)
    }
  },
  writeFile: (path, content, _cb) => {
    if (path === 'c.json') {
      return _cb()
    } else {
      return _cb(true)
    }
  }
}))

jest.mock('electron-settings', () => ({
  set: jest.fn(),
  getAll: jest.fn().mockImplementation(() => ({
    githubToken: 'x',
    githubUserInfo: 'x',
    splitTest: 'x',
    rest: 'x'
  }))
}))

describe('@components/import-export-settings', () => {
  describe('#importSettings', () => {
    it('should notify the user that settings have been loaded when file is correct', () => {
      const wrapper = shallowMount(ImportExportSettings)
      wrapper.setMethods({
        getFilePath: jest.fn().mockImplementation(() => 'c'),
        addNotification: jest.fn()
      })

      const originalAppVersion = process.env.APP_VERSION
      process.env.APP_VERSION = 'myAppVersion'

      return wrapper.vm.importSettings().then(() => {
        expect(wrapper.vm.addNotification).toBeCalledWith({
          type: 'Notice',
          message: 'Settings loaded. Reload the app to take effect.'
        })
        process.env.APP_VERSION = originalAppVersion
      })
    })

    it('should notify the user that the file is invalid', () => {
      const wrapper = shallowMount(ImportExportSettings)
      wrapper.setMethods({
        getFilePath: jest.fn().mockImplementation(() => 'w'),
        addNotification: jest.fn()
      })

      return wrapper.vm.importSettings().then(() => {
        expect(wrapper.vm.addNotification).toBeCalledWith({
          type: 'Warning',
          message: 'Invalid file. Couldn’t import the settings!'
        })
      })
    })

    it('should notify the user that the file could not be loaded', () => {
      const wrapper = shallowMount(ImportExportSettings)
      wrapper.setMethods({
        getFilePath: jest.fn().mockImplementation(() => 'x'),
        addNotification: jest.fn()
      })

      return wrapper.vm.importSettings().then(() => {
        expect(wrapper.vm.addNotification).toBeCalledWith({
          type: 'Warning',
          message: 'Couldn’t import the settings!'
        })
      })
    })
  })

  describe('#exportSettings', () => {
    it('should call the getSavePath method', () => {
      const wrapper = shallowMount(ImportExportSettings)
      wrapper.setMethods({
        getSavePath: jest.fn().mockImplementation(() => 'c'),
        addNotification: jest.fn()
      })

      return wrapper.vm.exportSettings().then(() => {
        expect(wrapper.vm.getSavePath).toBeCalled()
      })
    })

    it('should notify the user that there was an error when exporting', () => {
      const wrapper = shallowMount(ImportExportSettings)
      wrapper.setMethods({
        getSavePath: jest.fn().mockImplementation(() => 'x'),
        addNotification: jest.fn()
      })

      return wrapper.vm.exportSettings().then(() => {
        expect(wrapper.vm.addNotification).toBeCalledWith({
          type: 'Warning',
          message: 'Couldn’t export the settings!'
        })
      })
    })
    it('should notify the user that the settings were exported', () => {
      const wrapper = shallowMount(ImportExportSettings)
      wrapper.setMethods({
        getSavePath: jest.fn().mockImplementation(() => 'c'),
        addNotification: jest.fn()
      })

      return wrapper.vm.exportSettings().then(() => {
        expect(wrapper.vm.addNotification).toBeCalledWith({
          type: 'Notice',
          message: 'Settings exported successfully!'
        })
      })
    })
  })
})
