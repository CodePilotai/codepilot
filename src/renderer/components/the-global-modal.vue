<template>
  <div>
    <GitHubSignInModal v-if="githubSignInModalShown"/>
    <GitHubEnterpriseSignInModal v-if="githubEnterpriseSignInModalShown"/>
    <GitHubEnterpriseInstructionsModal v-if="githubEnterpriseInstructionsShown"/>
    <AppConfirmationModal
      v-if="displayClearSettingsConfirmation"
      :confirm-button="{label: 'Clear Settings', type: 'danger'}"
      title="Clear Settings"
      message="Are you sure you want to clear your settings?"
      @confirm="clearSettings"
      @cancel="displayClearSettingsConfirmation = false"
    />
    <KeyboardShortcutsModal
      v-if="displayKeyboardShortcutsModal"
      @close="displayKeyboardShortcutsModal = false"
    />
    <AppPinModal v-if="appPinModalShown"/>
    <RubberDuckModal v-if="rubberDuckModalShown"/>
  </div>
</template>

<script>
import GitHubSignInModal from './github-sign-in-modal'
import GitHubEnterpriseSignInModal from './github-enterprise-sign-in-modal'
import GitHubEnterpriseInstructionsModal from './github-enterprise-instructions-modal'
import KeyboardShortcutsModal from './keyboard-shortcuts-modal'
import RubberDuckModal from './rubber-duck-modal'
import { interfaceGetters, interfaceActions } from '@state/helpers'
import settings from 'electron-settings'
import { ipcRenderer as ipc } from 'electron'

export default {
  components: {
    GitHubSignInModal,
    GitHubEnterpriseSignInModal,
    GitHubEnterpriseInstructionsModal,
    KeyboardShortcutsModal,
    RubberDuckModal
  },
  data() {
    return {
      displayClearSettingsConfirmation: false,
      displayKeyboardShortcutsModal: false
    }
  },
  computed: {
    ...interfaceGetters
  },
  created() {
    ipc.on('clear-settings-confirmation', (event, arg) => {
      this.displayClearSettingsConfirmation = true
    })
    ipc.on('showKeyboardShortcuts', () => {
      this.displayKeyboardShortcutsModal = true
    })
  },
  methods: {
    ...interfaceActions,
    clearSettings() {
      settings.deleteAll()
      this.$electron.remote.getCurrentWindow().reload()
    }
  }
}
</script>
