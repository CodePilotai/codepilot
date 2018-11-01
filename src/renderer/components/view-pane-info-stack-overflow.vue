<template>
  <div
    class="flex justify-between self-center items-center h-10"
  >
    <div
      :class="$style.questionContainer"
      class="flex flex-grow overflow-hidden flex-no-shrink my-0 mx-2"
    >
      <AppIcon
        icon="stack-overflow"
        class="mr-1"
      />
      <AppLink
        v-tooltip.bottom="'Click to open question page in your browser'"
        :href="question.link"
        class="truncate"
      >
        {{ question.title }}
      </AppLink>
    </div>

    <div class="flex flex-no-shrink my-0 mx-2">
      <AppIcon
        icon="user"
        class="mr-1"
      />
      <AppLink
        v-tooltip.bottom="'Click to open user\'s page in your browser'"
        :href="question.owner.link"
      >
        {{ question.owner.display_name }}
      </AppLink>
      ( {{ question.owner.reputation }} )
    </div>

    <div
      v-tooltip.left="'Question was last updated ' + formatRelativeDate(lastUpdatedDate)"
      class="flex flex-no-shrink my-0 mx-2"
    >
      <AppIcon
        icon="clock-o"
        class="mr-1"
      />
      {{ formatDate(lastUpdatedDate) }}
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
    question() {
      return this.selectedResult
    },
    lastUpdatedDate() {
      // Last activity date will display the most recent edit
      // date, or if that is undefined, the creation date
      return this.question.last_activity_date
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
