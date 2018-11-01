<template>
  <div
    :data-e2e="'NavResultsType-' + selectedSearchIntent.name"
    class="text-sm leading-none relative flex flex-no-shrink items-center bg-grey-dark text-grey-text pl-4 pr-4 rounded-l"
  >
    {{ selectedSearchIntent.name }}
    <ProgressBar v-if="selectedTabSearchResults.meta.status === 'pending'"/>
    <div
      :data-e2e="'NavResultsType-' + selectedSearchIntent.name"
      :class="$style.resultsCount"
      class="text-xs pl-2 rounded-lg"
    >
      {{ selectedTabSearchResults.resultsCount }}
    </div>
  </div>
</template>

<script>
import { searchGetters, searchActions } from '@state/helpers'
import ProgressBar from './progress-bar'
import DependencyFilterIcon from './dependency-filter-icon'

export default {
  components: {
    ProgressBar,
    DependencyFilterIcon
  },
  computed: {
    ...searchGetters
  },
  methods: {
    ...searchActions
  }
}
</script>

<style lang="scss" module>
@import '~@branding';

.results-count {
  background: $no-results-bg;
}
</style>
