<template>
  <div>
    <AppButtonCard
      :description="'Current hotkey: ' + savedFormattedShortcut"
      title="Set a Hotkey"
      icon="bolt"
      @click="capturingShortcut=true"
    />
    <InputKeyboardShortcutModal
      v-if="capturingShortcut"
      data-e2e="InputKeyboardShortcut-appModal"
      @confirm="closeModal"
      @cancel="closeModal"
    />
  </div>
</template>

<script>
import InputKeyboardShortcutModal from './input-keyboard-shortcut-modal'
import formatShortcut from '@helpers/format-shortcut'
import { shortcutGetters } from '@state/helpers'

export default {
  components: {
    InputKeyboardShortcutModal
  },
  inheritAttrs: false,
  data() {
    return {
      capturingShortcut: false
    }
  },
  computed: {
    ...shortcutGetters,
    savedFormattedShortcut() {
      return (
        formatShortcut(this.toggleAppFocusShortcut) || 'No Hotkey selected.'
      )
    }
  },
  methods: {
    closeModal() {
      this.capturingShortcut = false
    }
  }
}
</script>
