<template>
  <div
    class="overflow-hidden"
    @contextmenu="$emit('contextmenu', $event)"
  >
    <ViewPaneInfo/>
    <AppFinder>
      <div
        class="flex p-6"
      >
        <div
          :class="$style.postStats"
          class="flex flex-col pr-3 text-4xl leading-tight text-center"
        >
          <span class="text-3xl leading-normal">
            {{ question.score }}
          </span>
          <span class="text-xs leading-none m-0 p-0">
            votes
          </span>
        </div>
        <div class="relative block overflow-hidden">
          <h1 class="mb-0">{{ question.title }}</h1>
          <hr>
          <AppEmbeddedHtml
            :html="question.body"
            class="mt-3"
          />
        </div>
      </div>
      <div
        :class="$style.answerSorting"
        class="py-3 px-6"
      >
        <h2>{{ `${sortedAnswers.length} Answer${sortedAnswers.length > 1 ? 's' : ''}` }}</h2>
        <template v-if="sortedAnswers.length > 1">
          Sort by:
          <select
            v-model="selectedSorting"
            class="ml-1"
          >
            <option
              v-for="option of sortingOptions"
              :key="option"
            >
              {{ option }}
            </option>
          </select>
        </template>
      </div>
      <div
        v-for="answer of sortedAnswers"
        :class="$style.answer"
        :key="answer.answer_id"
        class="flex p-3 m-3 border-t border-solid"
      >
        <div
          :class="$style.postStats"
          class="flex flex-col pr-3 text-4xl leading-tight text-center"
        >
          <span class="text-3xl leading-normal">
            {{ answer.score }}
          </span>
          <span class="text-xs leading-none m-0 p-0">
            votes
          </span>
          <AppIcon
            v-if="question.accepted_answer_id === answer.answer_id"
            :class="$style.postAccepted"
            icon="check"
            size="large"
          />
        </div>
        <div class="flex-grow">
          <div
            :class="$style.postMeta"
            class="flex mb-3 leading-loose"
          >
            <span v-tooltip.top="'Author'">
              <AppIcon
                class="ml-0 leading-loose"
                icon="user"
              />
              {{ answer.owner.display_name }}
            </span>
            <span v-tooltip.top="'Last activity'">
              <AppIcon
                class="ml-3 leading-loose"
                icon="edit"
              />
              {{ getDate(answer.last_activity_date) }}
            </span>
            <span v-tooltip.top="'Created on'">
              <AppIcon
                class="ml-3 leading-loose"
                icon="clock-o"
              />
              {{ getDate(answer.creation_date) }}
            </span>
          </div>
          <AppEmbeddedHtml :html="answer.body"/>
        </div>
      </div>
    </AppFinder>
  </div>
</template>

<script>
import ViewPaneInfo from './view-pane-info'
import formatDate from '@helpers/format-date'

export default {
  components: {
    ViewPaneInfo
  },
  props: {
    question: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      selectedSorting: 'votes',
      sortingOptions: ['votes', 'last activity', 'creation date']
    }
  },
  computed: {
    sortedAnswers() {
      switch (this.selectedSorting) {
        case 'last activity':
          return this.question.answers
            .concat()
            .sort(
              (a, b) => (a.last_activity_date < b.last_activity_date ? 1 : -1)
            )
        case 'creation date':
          return this.question.answers
            .concat()
            .sort((a, b) => (a.creation_date < b.creation_date ? 1 : -1))
        default:
          return this.question.answers
      }
    }
  },
  methods: {
    getDate(timestamp) {
      return formatDate(timestamp)
    }
  }
}
</script>

<style lang="scss" module>
@import '~@branding';

$post-meta-height: $grid-padding * 3;

.post-stats {
  min-width: $post-meta-height * 2.6;
  color: $app-prominent-text-color;
}

.post-accepted {
  color: $app-light-green-color;
}

.post-meta {
  color: $app-prominent-text-color;
}

.answer {
  border-top: $app-border;
}
</style>
