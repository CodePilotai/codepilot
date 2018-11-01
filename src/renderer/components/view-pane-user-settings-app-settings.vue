<template>
  <div>
    <div class="mr-3">
      <h3>App Settings</h3>
      <p>
        Set up codepilot to work according to your preferences.
      </p>
    </div>

    <h3>Search Directories</h3>
    <InputProjectDirectory/>
    <h3>General Settings</h3>
    <InputKeyboardShortcut/>
    <OptionalSettings/>
    <div class="mt-4">
      <AppButton @click="openKeyboardShortcuts">Keyboard Shortcuts</AppButton>
      <AppButton
        class="ml-2"
        @click="resetTutorials"
      >
        Reset Feature Tutorials
      </AppButton>
    </div>
  </div>
</template>

<script>
import InputKeyboardShortcut from './input-keyboard-shortcut'
import InputProjectDirectory from './input-project-directory'
import RecentProjectDirectories from './recent-project-directories'
import OptionalSettings from './optional-settings'
import { remote } from 'electron'
import { tutorialsActions } from '@state/helpers'

export default {
  components: {
    InputKeyboardShortcut,
    InputProjectDirectory,
    RecentProjectDirectories,
    OptionalSettings
  },
  methods: {
    ...tutorialsActions,
    openKeyboardShortcuts() {
      remote.getCurrentWebContents().send('showKeyboardShortcuts')
    }
  }
}
</script>
