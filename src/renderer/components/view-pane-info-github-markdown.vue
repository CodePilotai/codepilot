<template>
  <div class="flex justify-between self-center items-center h-10">
    <div class="flex overflow-hidden">
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
      <div class="flex flex-no-shrink my-0 mx-2">
        <AppIcon
          source="octicon"
          icon="repo"
          class="mr-1"
        />
        <AppLink
          v-tooltip.bottom="formattedRepoDescription"
          :href="repo.url"
        >
          {{ repo.name }}
        </AppLink>
      </div>
    </div>
    <div class="flex flex-no-shrink my-0 mx-2">
      <AppIcon
        icon="file"
        class="mr-1"
      />
      <AppLink
        v-tooltip.bottom="'Click to open this file in your browser'"
        :href="file.url"
      >
        {{ formattedFilename }}
      </AppLink>
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
      v-tooltip.left="'Repository was last updated ' + formatRelativeDate(repo.updatedAt)"
      class="flex flex-no-shrink my-0 mx-2"
    >
      <AppIcon
        icon="clock-o"
        class="mr-1"
      />
      {{ formatDate(repo.updatedAt) }}
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
    formattedRepoLicense() {
      return this.repo.license.replace(/\s+License/, '')
    },
    formattedStarsTooltip() {
      return this.repo.stars + (this.repo.stars === 1 ? ' star' : ' stars')
    },
    formattedFilename() {
      return this.file.path.replace(/^.*[\\/]/, '')
    }
  },
  methods: {
    formatDate,
    formatRelativeDate
  }
}
</script>
