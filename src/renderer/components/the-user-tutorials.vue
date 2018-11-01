<template lang="html">
  <div
    v-if="onboardingIsComplete"
    class="z-50"
  >
    <FilterTutorial v-if="!tutorialsCompleted.filter"/>
    <SearchTutorial v-if="!tutorialsCompleted.search"/>
  </div>
</template>

<script>
import FilterTutorial from './filter-tutorial'
import SearchTutorial from './search-tutorial'
import { tutorialsGetters, onboardingGetters } from '@state/helpers'

export default {
  components: {
    FilterTutorial,
    SearchTutorial
  },
  computed: {
    ...tutorialsGetters,
    ...onboardingGetters
  }
}
</script>
