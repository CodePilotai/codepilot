import electron from 'electron'
import settings from 'electron-settings'

// The minimum size we'll allow for the CodePilot.ai window.
export const minWindowSize = {
  width: 800,
  height: 400
}

// Get the initial window dimensions, returning normalized
// values from settings - or defaults, if the app is opening
// for the first time.
export const getWindowDimensions = () => {
  // The size of the screen the OS reports is available for
  // windows. For example, on macOS this does not include
  // the menu bar or dock hover area.
  const { workAreaSize } = electron.screen.getPrimaryDisplay()
  // The percentage of the screen width to take up by default
  const defaultWidthPercentage = workAreaSize.width <= 1440 ? 0.8 : 0.5
  // The percentage of the screen height ot take up by default
  const defaultHeightPercentage = 0.9

  // Get the saved dimensions from settings or establish defaults.
  const savedDimensions = settings.get('windowDimensions') || {
    bounds: {
      x: Math.floor((workAreaSize.width * (1 - defaultWidthPercentage)) / 2),
      y: Math.floor((workAreaSize.height * (1 - defaultHeightPercentage)) / 2),
      width: Math.floor(workAreaSize.width * defaultWidthPercentage),
      height: Math.floor(workAreaSize.height * defaultHeightPercentage)
    },
    workAreaSize,
    isMaximized: false
  }

  // Ratios comparing the current work area to the saved work area.
  // These make it possible to dynamically adjust to users of
  // multiple monitors. For example, if working on one's laptop
  // and the app is taking up half the work area, it will still take
  // up half the work area when their primary monitor changes to a
  // larger resolution monitor that they plug in.
  const widthRatio = workAreaSize.width / savedDimensions.workAreaSize.width
  const heightRatio = workAreaSize.height / savedDimensions.workAreaSize.height

  savedDimensions.bounds.x = Math.max(
    // Start no further than the left edge of the work area.
    0,
    Math.min(
      Math.floor(savedDimensions.bounds.x * widthRatio),
      // End no further than what would leave room for the
      // minimum window width.
      workAreaSize.width - minWindowSize.width
    )
  )

  savedDimensions.bounds.y = Math.max(
    // Start no further than the top edge of the work area.
    0,
    Math.min(
      Math.floor(savedDimensions.bounds.y * heightRatio),
      // End no further than what would leave room for the
      // minimum window height.
      workAreaSize.height - minWindowSize.height
    )
  )

  savedDimensions.bounds.width = Math.max(
    // Expand no less than the minimum window width.
    minWindowSize.width,
    Math.min(
      Math.floor(savedDimensions.bounds.width * widthRatio),
      // Expand no further than the right edge of the work area.
      workAreaSize.width - savedDimensions.bounds.x
    )
  )

  savedDimensions.bounds.height = Math.max(
    // Expand no less than the minimum window height.
    minWindowSize.height,
    Math.min(
      Math.floor(savedDimensions.bounds.height * heightRatio),
      // Expand no further than the bottom edge of the work area.
      workAreaSize.height - savedDimensions.bounds.y
    )
  )

  return savedDimensions
}

export const saveWindowDimensions = () => {
  // Save the current window dimensions
  settings.set('windowDimensions', {
    bounds: global.mainWindow.getBounds(),
    workAreaSize: electron.screen.getPrimaryDisplay().workAreaSize,
    isMaximized: global.mainWindow.isMaximized()
  })
}
