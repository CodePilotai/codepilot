import operatingSystem from 'os'

// https://nodejs.org/api/os.html#os_os_platform
const platform = operatingSystem.platform()

export default shortcut => {
  return shortcut
    .map(key => {
      if (key === 'Meta') {
        return platform === 'win32'
          ? 'Windows'
          : platform === 'darwin'
            ? 'Command'
            : 'Super'
      }
      if (key === ' ') {
        return 'Space'
      }
      return key
    })
    .join(' + ')
}
