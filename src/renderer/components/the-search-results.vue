<template>
  <div class="relative flex flex-col h-full max-h-full">
    <TheSidebarTabs/>
    <div class="flex flex-col h-full relative">
      <keep-alive>
        <SearchResultsFormatList
          :key="sidebarActiveTab"
          class="inline-block"
        />
      </keep-alive>
    </div>
  </div>
</template>

<script>
import TheSidebarTabs from './the-sidebar-tabs'
import SearchResultsFormatList from './search-results-format-list'
import SearchResultsFeedback from './search-results-feedback'
import {
  searchActions,
  searchGetters,
  pinsGetters,
  interfaceGetters,
  githubAuthGetters
} from '@state/helpers'

export default {
  components: {
    SearchResultsFormatList,
    SearchResultsFeedback,
    TheSidebarTabs
  },
  computed: {
    ...githubAuthGetters,
    ...searchGetters,
    ...interfaceGetters,
    ...pinsGetters
  },
  methods: {
    ...searchActions
  }
}
</script>
