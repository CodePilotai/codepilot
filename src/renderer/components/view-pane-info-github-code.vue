<template>
  <div class="flex justify-between self-center items-center h-10">
    <div class="flex">
      <div
        v-tooltip.bottom="'Click to open '+repo.owner.name+'\'s page in your browser.'"
        class="flex flex-no-shrink my-0 mx-2"
      >
        <AppIcon
          icon="user"
          class="mr-1"
        />
        <AppLink
          :href="repo.owner.url"
        >
          {{ repo.owner.name }}
        </AppLink>
      </div>
      /
      <div
        v-tooltip.top="'Desc: '+formattedRepoDescription"
        v-tooltip.bottom="'Click to open '+repo.name+' repo in your browser. '+'Desc: '+formattedRepoDescription"
        class="flex flex-grow my-0 mx-1 overflow-hidden "
      >
        <AppIcon
          source="octicon"
          icon="repo"
          class="mr-1"
        />
        <AppLink
          :href="repo.url"
          class="truncate w-32"
        >
          {{ repo.name }}
        </AppLink>
      </div>
    </div>
    <div class="flex flex-no-shrink my-0 mx-2">
      <div
        v-tooltip.bottom="'Click to open the ~/' + fileDirectoryPath + ' folder'"
        v-if="infobarDirectoryPath"
        class="flex flex-no-shrink my-0 mx-2 mr-auto"
      >
        <AppIcon
          icon="folder-open-o"
          class="mr-1"
        />
        <AppLink
          :href="formattedFolderPath"
        >
          {{ infobarDirectoryPath }}
        </AppLink>
      </div>
      <div class="flex flex-no-shrink my-0 mx-2">
        <AppIcon
          icon="file"
          class="mr-1"
        />
        <AppLink
          v-tooltip.bottom="'Click to open this file in your browser'"
          :href="formattedFilePath"
        >
          {{ formattedFilename }}
        </AppLink>
      </div>
    </div>
    <div
      v-tooltip.bottom="'Repository has ' + formattedStarsTooltip"
      v-if="repo.stars"
      class="flex flex-no-shrink my-0 mx-2"
    >
      <AppIcon
        icon="star"
        class="mr-1 text-yellow-dark"
      />
      {{ repo.stars }}
    </div>

    <div
      v-tooltip.bottom="'Code is licensed under ' + formattedRepoLicense"
      v-if="repo.license"
      class="flex flex-no-shrink my-0 mx-2"
    >
      <AppIcon
        icon="balance-scale"
        class="mr-1"
      />
      {{ formattedRepoLicense }}
    </div>
    <div
      v-tooltip.left="'Repository was last updated ' + formatRelativeDate(file.repo.updatedAt)"
      class="flex flex-no-shrink my-0 mx-2"
    >
      <AppIcon
        icon="clock-o"
        class="mr-1"
      />
      {{ formatDate(file.repo.updatedAt) }}
    </div>
  </div>
</template>

<script>
import formatDate from '@helpers/format-date'
import formatRelativeDate from '@helpers/format-relative-date'
import truncatePath from '@helpers/truncate-path'
import { shell } from 'electron'
import path from 'path'

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
    repo() {
      return this.file.context.repo
    },
    formattedRepoDescription() {
      return this.repo.description || 'Click to open repository in your browser'
    },
    formattedRepoLicense() {
      return this.repo.license.replace(/\s+License/, '')
    },
    formattedStarsTooltip() {
      return this.repo.stars + (this.repo.stars === 1 ? ' star' : ' stars')
    },
    formattedFilename() {
      return this.file.relativePath.replace(/^.*[\\/]/, '')
    },
    formattedFolderPath() {
      let folderUrlParts = this.file.context.html_url.split(path.sep)
      folderUrlParts.pop()
      let folderUrlPath = folderUrlParts.join('/')

      return this.file.context.files
        ? this.file.context.files[0].blob_url // If we are doing a commit search, return blob_url
        : folderUrlPath // If we are doing a code search, return html_url
    },
    formattedFilePath() {
      return this.file.context.files
        ? this.file.context.files[0].blob_url // If we are doing a commit search, return blob_url
        : this.file.context.html_url // If we are doing a code search, return html_url
    },
    infobarDirectoryPath() {
      let formattedPath = truncatePath(this.fileDirectoryPath, 25)
      return formattedPath
    },
    fileDirectoryPath() {
      const pathChunks = this.file.relativePath.split(path.sep)
      pathChunks.pop()
      return pathChunks
        .join(path.sep)
        .replace(this.$electron.remote.app.getPath('home'), '~')
    }
  },
  methods: {
    formatDate,
    formatRelativeDate,
    openPath() {
      shell.showItemInFolder(this.file.path)
    }
  }
}
</script>
