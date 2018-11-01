<template>
  <div class="flex justify-between w-full">
    <div
      v-tooltip.bottom="`${video.description}`"
      class="flex flex-grow overflow-hidden flex-no-shrink my-0 mx-2"
    >
      <AppIcon
        icon="youtube"
        class="mr-1"
      />
      {{ video.title }}
    </div>

    <div class="flex flex-no-shrink my-0 mx-2">
      <AppIcon
        icon="user"
        class="mr-1"
      />
      <AppLink
        v-tooltip.bottom="'Click to open channel in your browser'"
        :href="`https://youtube.com/c/${video.channelTitle}`"
      >
        {{ video.channelTitle }}
      </AppLink>
    </div>

    <div
      v-tooltip.left="'Video was uploaded ' + formatRelativeDate(uploadDate)"
      class="flex flex-no-shrink my-0 mx-2"
    >
      <AppIcon
        icon="clock-o"
        class="mr-1"
      />
      {{ formatDate(uploadDate) }}
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
    video() {
      return this.selectedResult
    },
    uploadDate() {
      // Last activity date will display the most recent edit
      // date, or if that is undefined, the creation date
      return this.video.publishedAt
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

.question-container {
  min-width: $infobar-stackoverflow-question-min-width;
}
</style>
