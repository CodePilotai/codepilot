<template>
  <div
    :class="$style.titleBar"
    @dblclick="manageWindowMaximization"
  >
    <div class="flex">
      <div class="flex-1">
        <AppIcon
          v-if="platform === 'win32'"
          :class="$style.titleBarIcon"
          icon="bars"
          class="ml-4 mt-2 px-2 py-1 rounded hover:bg-grey-lightest"
          @click="displayAppMenu"
        />
        <AppWindowControls v-if="onLinuxPlatform"/>
      </div>
      <div class="mt-3 flex-1 text-center">
        CodePilot.ai
      </div>
      <div class="flex flex-1 justify-end">
        <AppWindowControls v-if="platform === 'win32'"/>
      </div>
    </div>
  </div>
</template>

<script>
import operatingSystem from 'os'
import { remote, ipcRenderer as ipc } from 'electron'
import { searchGetters } from '@state/helpers'
export default {
  computed: {
    ...searchGetters,
    platform() {
      return operatingSystem.platform()
    },
    onLinuxPlatform() {
      return this.platform !== 'win32' && this.platform !== 'darwin'
    }
  },
  methods: {
    displayAppMenu(event) {
      ipc.send('display-app-menu', {
        x: event.x,
        y: event.y
      })
    },
    manageWindowMaximization() {
      const currentWindow = remote.getCurrentWindow()
      if (currentWindow.isMaximized()) {
        currentWindow.unmaximize()
        this.minMaxIcon = 'window-maximize'
      } else {
        currentWindow.maximize()
        this.minMaxIcon = 'window-restore'
      }
    }
  }
}
</script>


<style lang="scss" module>
.title-bar {
  -webkit-app-region: drag;
  width: 100%;
  height: 35px;
}

.title-bar-icon {
  -webkit-app-region: no-drag;
}
</style>
