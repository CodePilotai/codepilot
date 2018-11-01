<template>
  <div class="flex justify-between self-center items-center h-10">
    <div
      v-if="file.title"
      class="flex justify-between"
    >
      <div
        v-tooltip.bottom="'Click to open issue in your browser'"
        class="flex flex-no-shrink my-0 mx-2"
      >
        <AppIcon
          :icon="iconName"
          source="octicon"
          class="mr-1"
        />
        <AppLink
          :href="file.url"
        >
          {{ file.title }}
        </AppLink>
      </div>
      <div
        v-tooltip.bottom="'Issue raised by ' + file.user.login"
        class="flex flex-no-shrink my-0 mx-2"
      >
        <AppIcon
          icon="user"
          class="mr-1"
        />
        <AppLink
          :href="file.user.html_url"
        >
          {{ file.user.login }}
        </AppLink>
      </div>
      <div
        v-tooltip.left="'Issue was created ' + formatRelativeDate(file.updatedAt)"
        v-if="file.updatedAt"
        class="flex flex-no-shrink my-0 mx-2"
      >
        <AppIcon
          icon="clock-o"
          class="mr-1"
        />
        {{ formatDate(file.updatedAt) }}
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
    iconName() {
      return this.file.state === 'open' ? 'issue-opened' : 'issue-closed'
    }
  },
  methods: {
    formatDate,
    formatRelativeDate
  }
}
</script>
