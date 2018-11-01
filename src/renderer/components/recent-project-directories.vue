<template>
  <div v-if="query.recentProjectDirectories.length">
    <h2>Recent Folders</h2>
    <ul>
      <li
        v-for="directoryPath in query.recentProjectDirectories.slice(0, 3)"
        :key="directoryPath"
      >
        <AppLink
          class="mr-3"
          @click="updateQuery({ projectDirectory: directoryPath })"
        >
          {{ getDirectoryName(directoryPath) }}
        </AppLink>
        {{ getParentDirectory(directoryPath) }}
      </li>
    </ul>
  </div>
</template>

<script>
import path from 'path'
import { searchGetters, searchActions } from '@state/helpers'

export default {
  computed: searchGetters,
  methods: {
    ...searchActions,
    getPathChunks(directoryPath) {
      return directoryPath.split(path.sep)
    },
    getDirectoryName(directoryPath) {
      return this.getPathChunks(directoryPath).pop()
    },
    getParentDirectory(directoryPath) {
      const pathChunks = this.getPathChunks(directoryPath)
      pathChunks.pop()
      return pathChunks
        .join(path.sep)
        .replace(this.$electron.remote.app.getPath('home'), '~')
    }
  }
}
</script>
