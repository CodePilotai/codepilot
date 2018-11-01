<template>
  <div class="flex justify-between self-center items-center h-10">
    <div class="flex">
      <div
        v-tooltip.bottom="'Click to open containing folder ' + fileDirectoryPath"
        class="flex flex-no-shrink my-0 mx-2"
      >
        <AppIcon
          icon="folder-open-o"
          class="mr-1"
        />
        <AppLink
          @click="openPath"
        >
          {{ infobarFileDirectoryPath }}
        </AppLink>
      </div>

      <div
        v-tooltip.bottom="'Click to open file'"
        class="flex flex-no-shrink my-0 mx-2"
      >
        <AppIcon
          icon="file"
          class="mr-1"
        />
        <AppLink
          @click="openFile"
        >
          {{ filename }}
        </AppLink>
      </div>
    </div>
  </div>
</template>

<script>
import path from 'path'
import { shell } from 'electron'
import truncatePath from '@helpers/truncate-path'

export default {
  props: {
    selectedResult: {
      type: Object,
      required: true
    }
  },
  computed: {
    file() {
      return this.selectedResult
    },
    filename() {
      return this.file.path.split(path.sep).pop()
    },

    infobarFileDirectoryPath() {
      let formattedPath = truncatePath(this.fileDirectoryPath, 25)
      return formattedPath
    },

    fileDirectoryPath() {
      const pathChunks = this.file.path.split(path.sep)
      pathChunks.pop()
      return pathChunks
        .join(path.sep)
        .replace(this.$electron.remote.app.getPath('home'), '~')
    }
  },
  methods: {
    openPath() {
      shell.showItemInFolder(this.file.path)
    },
    openFile() {
      shell.openItem(this.file.path)
    }
  }
}
</script>
