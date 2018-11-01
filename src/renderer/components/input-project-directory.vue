<template>
  <div>
    <ul
      v-if="query.projectDirectories.length">
      <li
        v-for="directory of query.projectDirectories"
        :key="directory"
        class="flex mb-3"
      >
        <div
          :class="$style.directoryPath"
          class="py-3 px-6 leading-normal bg-grey rounded flex-grow"
        >{{ directory }}</div>
        <AppButton
          :disabled="query.projectDirectories.length === 1"
          class="my-0 rounded-r"
          type="danger"
          @click="deleteDirectory(directory)"
        >
          Delete
        </AppButton>
      </li>
    </ul>

    <div
      v-else
      class="my-3 text-red"
    >
      No Folders selected. No Local Code search will be performed until a folder is selected.
    </div>
    <AppButtonCard
      id="InputProjectDirectory-el"
      title="Add folders to search"
      description="You can add multiple directories at once"
      icon="folder-open"
      @click="addDirectories"
    />
  </div>
</template>

<script>
import changeFolderDialog from '@helpers/change-folder-dialog'
import { searchGetters, searchActions } from '@state/helpers'
import union from 'lodash/union'

export default {
  inheritAttrs: false,
  computed: {
    ...searchGetters
  },
  methods: {
    ...searchActions,
    formatPath(rawPath) {
      return rawPath.replace(this.$electron.remote.app.getPath('home'), '~')
    },
    addDirectories() {
      const defaultPath = this.$electron.remote.app.getPath('home')
      changeFolderDialog({
        title: 'Select a folder to search',
        buttonTitle: 'Choose Folder',
        defaultPath,
        callback: folderPaths => {
          if (folderPaths) {
            this.updateQuery({
              projectDirectories: union(
                this.query.projectDirectories,
                folderPaths
              )
            })
          }
        }
      })
    },
    deleteDirectory(pathToDelete) {
      this.updateQuery({
        projectDirectories: this.query.projectDirectories.filter(
          directoryPath => directoryPath !== pathToDelete
        )
      })
    }
  }
}
</script>

<style lang="scss" module>
@import '~@branding';

.directory-path {
  font-family: $code-font-stack-default;
}
</style>
