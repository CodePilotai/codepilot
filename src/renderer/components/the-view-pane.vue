<template>
  <div
    id="TheViewPane-el"
    ref="scrollableContainer"
    :class="[
      $style.viewPaneContainer,
      { [$style.scrollable]: shouldBeScrollable }
    ]"
    data-v-step="viewpane"
    class="w-full overflow-hidden border-l no-outline border-grey-darkest"
    tabindex="0"
    @mousedown="contextMenuShown = false"
    @keydown.esc="contextMenuShown = false"
  >
    <template v-if="viewable.type === 'result' && selectedResult.key">
      <template v-if="selectedResult.type === 'file' || selectedResult.type === 'commit'">
        <keep-alive>
          <ViewPaneFile
            key="FileViewer"
            :file="selectedResult"
          />
        </keep-alive>
      </template>
      <ViewPaneDoc
        v-if="selectedResult.type === 'doc'"
        :doc="selectedResult"
        @contextmenu.prevent="showContextMenu"
      />
      <ViewPaneIssue
        v-if="selectedResult.type === 'issue'"
        :issue="selectedResult"
        @contextmenu.prevent="showContextMenu"
      />
      <ViewPanePullRequest
        v-if="selectedResult.type === 'pr'"
        :pr="selectedResult"
        @contextmenu.prevent="showContextMenu"
      />
      <ViewPaneQuestion
        v-if="selectedResult.type === 'question'"
        :question="selectedResult"
        @contextmenu.prevent="showContextMenu"
      />
      <ViewPaneWebsite
        v-if="selectedResult.type === 'website'"
        :website="selectedResult"
      />
      <ViewPaneVideo
        v-if="selectedResult.type === 'video'"
        :video="selectedResult"
        class="h-full"
      />
    </template>
    <ViewPaneSearching v-if="viewable.type === 'searchPending'"/>
    <ViewPaneNoResults v-if="viewable.type === 'noResults'"/>
    <ViewPaneFilters v-if="viewable.type === 'filters'"/>
    <ViewPaneUserSettings v-if="viewable.type === 'settings'"/>
    <ViewPaneNotes v-if="viewable.type === 'notes'"/>
  </div>
</template>

<script>
import ViewPaneDoc from './view-pane-doc'
import ViewPaneFile from './view-pane-file'
import ViewPaneIssue from './view-pane-issue'
import ViewPanePullRequest from './view-pane-pull-request'
import ViewPaneQuestion from './view-pane-question'
import ViewPaneUserSettings from './view-pane-user-settings'
import ViewPaneSearching from './view-pane-searching'
import ViewPaneVideo from './view-pane-video'
import ViewPaneWebsite from './view-pane-website'
import ViewPaneNoResults from './view-pane-no-results'
import ViewPaneFilters from './view-pane-filters'
import ViewPaneNotes from './view-pane-notes'
import {
  searchGetters,
  pinsGetters,
  searchActions,
  interfaceGetters
} from '@state/helpers'
import { ipcRenderer as ipc } from 'electron'

export default {
  components: {
    ViewPaneDoc,
    ViewPaneFile,
    ViewPaneIssue,
    ViewPanePullRequest,
    ViewPaneQuestion,
    ViewPaneUserSettings,
    ViewPaneSearching,
    ViewPaneVideo,
    ViewPaneNoResults,
    ViewPaneWebsite,
    ViewPaneFilters,
    ViewPaneNotes
  },
  computed: {
    ...searchGetters,
    ...pinsGetters,
    ...interfaceGetters,
    // Some viewables should not be scrollable, because there's an embedded
    // element that handles scrolling instead, such as the code editor.
    shouldBeScrollable() {
      // The view pane should be scrollable if...
      return (
        // there is not a viewable, or
        (!this.selectedResult ||
          // the selectedResult is not a file
          this.selectedResult !== 'file' ||
          // the viewable is not of type result
          this.viewable.type !== 'result') &&
        // and the viewable is not of type settings
        this.viewable.type !== 'settings'
      )
    }
  },
  watch: {
    viewable: 'adjustScroll',
    selectedResult: 'adjustScroll',
    pinnedResults: {
      handler() {
        if (!this.selectedResult) return

        const allResults = this.pinnedResults.concat(
          this.selectedTabSearchResultsUnfiltered.items
        )

        for (const result of allResults) {
          if (this.selectedResult.key === result.key) {
            this.selectResult({
              ...this.selectedResult,
              pin: result.pin
            })
            break
          }
        }
      },
      deep: true
    }
  },
  created() {
    ipc.on('search-with-codepilot', this.runSearchOnSelectedText)
  },
  methods: {
    ...searchActions,
    adjustScroll() {
      this.$nextTick(() => {
        this.$refs.scrollableContainer.scrollTop = 0
      })
    },
    showContextMenu(event) {
      ipc.send('display-view-pane-context-menu', {
        x: event.x,
        y: event.y
      })
    },
    runSearchOnSelectedText() {
      const selectedText = window.getSelection().toString()
      if (selectedText && selectedText !== this.query.text) {
        this.updateQuery({ text: selectedText })
        this.runSearch()
      }
    }
  }
}
</script>

<style lang="scss" module>
@import '~@branding';

.view-pane-container {
  transition: $fade-transition;

  &.scrollable {
    overflow: overlay;
  }
}
</style>
