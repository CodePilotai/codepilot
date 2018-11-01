<template>
  <div class="flex justify-between self-center items-center h-10">
    <div
      v-if="file.message"
      class="flex flex-grow overflow-hidden my-0 mx-2"
    >
      <div class="flex flex-no-shrink my-0 mx-2">
        <AppIcon
          source="octicon"
          icon="git-commit"
          class="mr-1"
        />
        <AppLink
          v-tooltip.bottom="file.message"
          :href="file.url"
        >
          {{ messageFirstLine }}
        </AppLink>
        <div
          :class="$style.additions"
          class="ml-2"
        >
          +{{ file.additions }}
        </div>
        <div
          :class="$style.deletions"
          class="ml-1"
        >
          -{{ file.deletions }}
        </div>
      </div>
      <div
        v-tooltip.left="'These changes were committed ' + formatRelativeDate(file.commitDate)"
        v-if="file.message"
        class="flex flex-no-shrink my-0 mx-2"
      >
        <AppIcon
          icon="clock-o"
          class="mr-1"
        />
        {{ formatDate(file.commitDate) }}
      </div>
    </div>
    <div class="flex flex-no-shrink my-0 mx-2">
      <div
        v-tooltip.bottom="'Click to open ' + repo.owner.name + '\'s page in your browser.'"
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
        :class="$style.iconWithLongLabel"
        class="flex my-0 mx-1 overflow-hidden"
      >
        <AppIcon
          source="octicon"
          icon="repo"
          class="mr-1"
        />
        <AppLink
          v-tooltip.bottom="formattedRepoDescription"
          :href="repo.url"
          class="truncate"
        >
          {{ repo.name }}
        </AppLink>
      </div>
      /
      <div class="flex flex-no-shrink my-0 mx-2">
        <AppIcon
          icon="file"
          class="mr-1"
        />
        <AppLink
          v-tooltip.bottom="'Click to open file in your browser.'"
          :href="file.blob_url"
        >
          {{ file.filename }}
        </AppLink>
      </div>
    </div>
  </div>
</template>

<script>
import formatDate from '@helpers/format-date'
import formatRelativeDate from '@helpers/format-relative-date'

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
      return this.file.repo
    },
    formattedRepoDescription() {
      return this.repo.description || 'Click to open repository in your browser'
    },
    messageList() {
      return this.file.message.split('\n')
    },
    messageFirstLine() {
      const firstLine = this.messageList[0]

      if (firstLine.length > 35) {
        return firstLine.substring(0, 35) + '...'
      } else {
        return firstLine
      }
    }
  },
  methods: {
    formatDate,
    formatRelativeDate
  }
}
</script>

<style lang="scss" module>
@import '~@branding';

.icon-with-long-label {
  min-width: $infobar-stackoverflow-question-min-width;
}

.additions {
  color: $infobar-github-additions-color;
}

.deletions {
  color: $infobar-github-deletions-color;
}
</style>
