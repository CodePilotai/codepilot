import omit from 'lodash/omit'
import settings from 'electron-settings'
export default function getStrippedSettingsString() {
  const settingsToExclude = [
    'githubToken',
    'githubUserInfo',
    'splitTest',
    'pins.rubberDuckSessions',
    'pins.rubberDuckSessionKey'
  ]
  const strippedSettings = omit(settings.getAll(), settingsToExclude)
  strippedSettings['appVersion'] = process.env.APP_VERSION
  return JSON.stringify(strippedSettings)
}
