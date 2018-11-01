import electron from 'electron'

export default ({ title, buttonTitle, defaultPath, callback }) => {
  // https://github.com/electron/electron/blob/master/docs/api/dialog.md#methods
  electron.remote.dialog.showOpenDialog(
    {
      title: title,
      message: title, // macOS only
      defaultPath: defaultPath,
      buttonLabel: buttonTitle,
      properties: [
        'openDirectory',
        'multiSelections',
        'treatPackageAsDirectory' // macOS only
      ]
    },
    callback
  )
}
