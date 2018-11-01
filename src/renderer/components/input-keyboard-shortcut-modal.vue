<template>
  <AppModal
    title="Set a Hotkey"
    @close="cancelShortcut"
  >
    <AppInputText
      v-tooltip.top="'Press the key combination you want to set as the hotkey.'"
      ref="inputComponent"
      :value="formattedShortcut"
      label="Keyboard Shortcut"
      @keydown.enter="confirmShortcut"
      @keydown.prevent.stop="captureShortcut"
    />
    <div class="mt-4 flex">
      <AppButton
        class="w-1/3"
        @click="cancelShortcut"
      >
        Cancel
      </AppButton>
      <AppButton
        :disabled="shortcut.length == 0"
        class="w-1/3 ml-3"
        @click="resetShortcut"
      >
        Reset
      </AppButton>
      <AppButton
        :disabled="shortcut.length < 2"
        class="w-1/3 ml-3"
        data-e2e="InputKeyboardShortcut-confirmHotkeyButton"
        @click="confirmShortcut"
      >
        Confirm
      </AppButton>
    </div>
  </AppModal>
</template>

<script>
import operatingSystem from 'os'
import formatShortcut from '@helpers/format-shortcut'
import { shortcutGetters, shortcutActions } from '@state/helpers'

// https://nodejs.org/api/os.html#os_os_platform
const platform = operatingSystem.platform()

export default {
  inheritAttrs: false,
  data() {
    return {
      shortcut: []
    }
  },
  computed: {
    ...shortcutGetters,
    formattedShortcut() {
      return formatShortcut(this.shortcut)
    }
  },
  created() {
    this.resetShortcut()
  },
  methods: {
    ...shortcutActions,
    cancelShortcut(event) {
      this.$emit('cancel')
    },
    captureShortcut(event) {
      event.preventDefault()

      // Do not allow the alt key to be used on mac
      if (event.altKey && platform === 'darwin') {
        return
      }

      // Do not include keys that are repeated
      // from being held down.
      if (!event.repeat) {
        // Do not allow the final key to be a modifier
        const finalKey =
          event.key &&
          event.key !== 'Meta' &&
          event.key !== 'Control' &&
          event.key !== 'Shift' &&
          event.key !== 'Alt' &&
          event.key.toUpperCase()
        if (!finalKey) return

        // Combine any modifiers and the final key
        // into an array of keys.
        this.shortcut = [
          event.metaKey && 'Meta',
          event.ctrlKey && 'Ctrl',
          event.altKey && 'Alt',
          event.shiftKey && 'Shift',
          finalKey
        ].filter(key => key)
      }
    },
    confirmShortcut() {
      this.updateToggleAppFocusShortcut(this.shortcut)
      this.$emit('confirm', this.shortcut)
    },
    resetShortcut() {
      this.$nextTick(() => {
        this.$refs.inputComponent.$refs.input.focus()
      })
      this.shortcut = this.toggleAppFocusShortcut
    }
  }
}
</script>
