<template>
  <div>
    <div
      v-if="platform === 'win32'"
      class="mr-4 mt-2 flex items-center"
    >
      <AppIcon
        :class="$style.windowControlIcon"
        icon="window-minimize"
        class="mx-1 px-2 py-1 rounded hover:bg-grey-lightest"
        @click="minimizeApplication"
      />
      <AppIcon
        :class="$style.windowControlIcon"
        :icon="minMaxIcon"
        class="mx-1 px-2 py-1 rounded hover:bg-grey-lightest"
        @click="manageWindowMaximization"
      />
      <AppIcon
        :class="$style.windowControlIcon"
        icon="close"
        class="mx-1 px-2 py-1 rounded hover:bg-grey-lightest"
        @click="closeApplication"
      />
    </div>
    <div
      v-else
      class="mr-4 mt-2 flex items-center"
    >
      <AppIcon
        :class="$style.windowControlIcon"
        icon="close"
        class="mx-1 px-2 py-1 rounded hover:bg-grey-lightest"
        @click="closeApplication"
      />
      <AppIcon
        :class="$style.windowControlIcon"
        :icon="minMaxIcon"
        class="mx-1 px-2 py-1 rounded hover:bg-grey-lightest"
        @click="manageWindowMaximization"
      />
      <AppIcon
        :class="$style.windowControlIcon"
        icon="window-minimize"
        class="mx-1 px-2 py-1 rounded hover:bg-grey-lightest"
        @click="minimizeApplication"
      />
    </div>
  </div>
</template>

<script>
import operatingSystem from 'os'
import { remote } from 'electron'
export default {
  data() {
    return {
      minMaxIcon: ''
    }
  },
  computed: {
    platform() {
      return operatingSystem.platform()
    }
  },
  mounted() {
    // Wait to ensure that electron is loaded before we try to set the icon
    this.minMaxIcon = remote.getCurrentWindow().isMaximized()
      ? 'window-restore'
      : 'window-maximize'
  },
  methods: {
    manageWindowMaximization() {
      const currentWindow = remote.getCurrentWindow()
      if (currentWindow.isMaximized()) {
        currentWindow.unmaximize()
        this.minMaxIcon = 'window-maximize'
      } else {
        currentWindow.maximize()
        this.minMaxIcon = 'window-restore'
      }
    },
    minimizeApplication() {
      remote.getCurrentWindow().minimize()
    },
    closeApplication() {
      remote.app.quit()
    }
  }
}
</script>


<style lang="scss" module>
.window-control-icon {
  -webkit-app-region: no-drag;
}
</style>
