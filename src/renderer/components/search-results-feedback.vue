<template>
  <div
    v-if="shouldRequestFeedback"
    :class="$style.searchResultsFeedbackContainer"
    class="h-16 leading-loose flex flex-col py-2 px-4 justify-center overflow-hidden whitespace-no-wrap border-b border-solid"
  >
    <span
      :class="[
        $style.searchResultsFeedback,
        { ['opacity-0']: feedbackFaded }
      ]"
    >
      <span v-if="searchStatus === 'pending'">
        {{ searchStatusText }}
      </span>
      <span v-else-if="searchStatus === 'complete'">

        <template v-if="searchResults.resultsCount > 0 && sidebarActiveTab === 'Results'">
          {{ resultsFeedbackText }} result(s)
        </template>
        <template
          v-else-if="searchResults.resultsCount === 0 && sidebarActiveTab === 'Results'"
          data-e2e="SearchResultsFeedback-noResults"
        >No results found. ({{ selectedSearchDuration }}s)
        </template>
        <template v-else>
          Showing {{ pinsFeedbackText }} total pin(s)
        </template>
      </span>
    </span>
    <span
      v-if="!githubAccessToken"
      class="flex items-center"
    >
      <AppLink
        class="mr-1"
        @click="updateGitHubSignInModalShown(true)"
      >
        Sign in
      </AppLink>
      to GitHub for additional search results.
    </span>
  </div>
</template>

<script>
import Vue from 'vue'
import {
  searchGetters,
  pinsGetters,
  githubAuthGetters,
  interfaceActions,
  interfaceGetters
} from '@state/helpers'

export default {
  data() {
    return {
      appIconHidden: true,
      feedbackFaded: false,
      showClickHere: false,
      searchComplete: {},
      searchStatusText: 'Searching ...',
      resultsFeedbackText: ''
    }
  },
  computed: {
    ...githubAuthGetters,
    ...searchGetters,
    ...interfaceGetters,
    ...pinsGetters,
    shouldRequestFeedback() {
      return this.searchStatus === 'pending' || this.searchStatus === 'complete'
    },
    pinsFeedbackText() {
      return this.pinnedResults ? this.pinnedResults.length : 0
    },
    selectedSearchStatus() {
      return this.searchResults.meta.status
    },
    selectedSearchDuration() {
      const duration = this.searchResults.meta.durationInSeconds
      return duration ? duration.toFixed(2) : 0
    }
  },
  watch: {
    selectedSearchIntentKey(newResultsTypeKey) {
      this.setFeedback(this.selectedSearchStatus)
    },
    selectedSearchStatus() {
      this.setFeedback(this.selectedSearchStatus)
    }
  },
  methods: {
    ...interfaceActions,
    setFeedback(newStatus) {
      if (newStatus === 'pending') {
        this.searchStatusText =
          'Searching ' + this.selectedSearchIntent.name + '...'
        this.feedbackFaded = false
        this.appIconHidden = true
        this.showClickHere = false
        Vue.set(this.searchComplete, this.selectedSearchIntent.key, false)
      }
      if (newStatus === 'complete') {
        if (this.searchResults.resultsCount > 0) {
          this.resultsFeedbackText = `Showing ${
            this.searchResults.resultsCount
          } total`
          this.appIconHidden = false
          Vue.set(this.searchComplete, this.selectedSearchIntent.key, true)
        }
      }
    }
  }
}
</script>
<style lang="scss" module>
@import '~@branding';

.app-icon {
  &:hover {
    background: var(--selectable-hovered-bg);
  }
}

.email-input label {
  color: $app-prominent-text-color;
}

.error-message {
  color: $app-error-bg;
}

.search-results-feedback-container {
  background-color: $infobar-bg;
  border-bottom: var(--app-border);
  transition: $fade-transition;
}

.search-results-feedback {
  transition: opacity 1s;
}
</style>
