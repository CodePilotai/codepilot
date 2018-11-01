import formatShortcut from './format-shortcut'

describe('Helper: formatShortcut', () => {
  it('correctly formats "Control O" as "Ctrl + O', () => {
    expect(formatShortcut(['Ctrl', 'O'])).toEqual('Ctrl + O')
  })

  it('correctly formats " " O as "Space + O', () => {
    expect(formatShortcut([' ', 'O'])).toEqual('Space + O')
  })

  it('correctly formats "Meta" to "Command" on macOS', () => {
    formatShortcut.__Rewire__('platform', 'darwin')
    expect(formatShortcut(['Meta'])).toEqual('Command')
    formatShortcut.__ResetDependency__('platform')
  })

  it('correctly formats "Meta" to "Windows" on Windows', () => {
    formatShortcut.__Rewire__('platform', 'win32')
    expect(formatShortcut(['Meta'])).toEqual('Windows')
    formatShortcut.__ResetDependency__('platform')
  })

  it('correctly formats "Meta" to "Super" on Linux', () => {
    formatShortcut.__Rewire__('platform', 'linux')
    expect(formatShortcut(['Meta'])).toEqual('Super')
    formatShortcut.__ResetDependency__('platform')
  })
})
