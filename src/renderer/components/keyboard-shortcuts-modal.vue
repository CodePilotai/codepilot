<template>
  <AppModal
    title="Keyboard Shortcuts"
    @close="$emit('close')"
  >
    <div>
      <div class="row">
        <div class="column">
          <h4>Press:</h4>
        </div>
        <div class="column">
          <h4>To:</h4>
        </div>
      </div>
      <div
        v-for="keyboardShortcut in keyboardShortcuts"
        :key="keyboardShortcut.shortcut"
        class="row"
      >
        <div class="column">{{ keyboardShortcut.shortcut }}</div>
        <div class="column">{{ keyboardShortcut.command }}</div>
      </div>
    </div>
  </AppModal>
</template>

<script>
import operatingSystem from 'os'
const platform = operatingSystem.platform()
let functionKey = ''

// Command on macOS and Control on Linux and Windows
if (platform === 'darwin') {
  functionKey = 'Command'
} else {
  functionKey = 'Ctrl'
}
export default {
  data() {
    return {
      keyboardShortcuts: [
        { shortcut: functionKey + ' + F', command: 'Show finder' },
        { shortcut: functionKey + ' + S', command: 'Focus the search' },
        {
          shortcut: functionKey + ' + P',
          command: 'Search selected text in editor'
        },
        { shortcut: functionKey + ' + K', command: 'Show keyboard shortcuts ' },
        {
          shortcut: functionKey + ' + =',
          command: 'Zoom In'
        },
        {
          shortcut: functionKey + ' + -',
          command: 'Zoom Out'
        },
        {
          shortcut: functionKey + ' + 0',
          command: 'Reset Zoom'
        },
        { shortcut: functionKey + ' + R', command: 'Reload application' }
      ]
    }
  }
}
</script>
