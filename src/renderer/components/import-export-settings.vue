<template lang="html">
  <div class="flex self-center">
    <button
      class="ml-3 px-3 py-2 bg-grey-lighter text-grey-text-high-contrast rounded text-xxs leading-none uppercase hover:bg-primary"
      @click="importSettings"
    >
      import
    </button>
    <button
      v-if="!onlyImport"
      class="ml-3 px-3 py-2 bg-grey-lighter text-grey-text-high-contrast rounded text-xxs leading-none uppercase hover:bg-primary"
      @click="exportSettings"
    >
      export
    </button>
    <AppConfirmationModal
      v-if="isConfirmingImport"
      :confirm-button="{label: 'Import', type: 'danger'}"
      :cancel-button="{label: 'Cancel'}"
      title="App Version Mismatch"
      message="It appears that these settings were saved in a previous version of CodePilot. Do you still want to import them?"
      @confirm="setSettings(importedSettings)"
      @cancel="cancelImport"
    />
  </div>
</template>

<script>
import { notificationActions } from '@state/helpers'
import getStrippedSettingsString from '@helpers/get-stripped-settings-string'
import { remote } from 'electron'
import fs from 'fs'
import settings from 'electron-settings'

export default {
  props: {
    onlyImport: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isConfirmingImport: false,
      importedSettings: null
    }
  },
  methods: {
    ...notificationActions,
    getFilePath() {
      const currentBrowserWindow = remote.getCurrentWindow()
      return remote.dialog.showOpenDialog(currentBrowserWindow, {
        properties: ['openFile']
      })
    },
    getSavePath() {
      const currentBrowserWindow = remote.getCurrentWindow()
      return remote.dialog.showSaveDialog(currentBrowserWindow, {
        defaultPath: 'codepilot-settings',
        buttonLabel: 'Save settings'
      })
    },
    importSettings() {
      return new Promise(resolve => {
        const filePath = this.getFilePath()
        if (filePath) {
          fs.readFile(filePath[0], (err, data) => {
            if (err) {
              this.addNotification({
                type: 'Warning',
                message: 'Couldn’t import the settings!'
              })
            } else {
              try {
                const settingsObj = JSON.parse(data)
                if (
                  !settingsObj.appVersion ||
                  settingsObj.appVersion !== process.env.APP_VERSION
                ) {
                  this.isConfirmingImport = true
                  this.importedSettings = settingsObj
                  return resolve()
                }

                this.setSettings(settingsObj)

                this.addNotification({
                  type: 'Notice',
                  message: 'Settings loaded. Reload the app to take effect.'
                })
              } catch (err) {
                this.addNotification({
                  type: 'Warning',
                  message: 'Invalid file. Couldn’t import the settings!'
                })
              }
            }
            resolve()
          })
        } else {
          resolve()
        }
      })
    },
    exportSettings() {
      return new Promise(resolve => {
        const settingsString = getStrippedSettingsString()
        const path = this.getSavePath()
        if (path) {
          fs.writeFile(path + '.json', settingsString, err => {
            if (err) {
              this.addNotification({
                type: 'Warning',
                message: 'Couldn’t export the settings!'
              })
            } else {
              this.addNotification({
                type: 'Notice',
                message: 'Settings exported successfully!'
              })
            }
            resolve()
          })
        } else {
          resolve()
        }
      })
    },
    setSettings(settingsObj) {
      Object.keys(settingsObj).forEach(key => {
        settings.set(key, settingsObj[key])
      })
      this.isConfirmingImport = false
    },
    cancelImport() {
      this.importedSettings = null
      this.isConfirmingImport = false
    }
  }
}
</script>
