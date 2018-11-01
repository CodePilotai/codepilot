<template>
  <!-- TODO: We can remove @click.prevent when we implement the -->
  <!-- stacked accordion results. -->
  <div
    :class="[{ ['flex-no-shrink']: !open }]"
    class="flex flex-col"
  >
    <div
      :class="['cursor-pointer rounded ', $style.summary, {[$style.highlighted]: select}]"
      class="relative flex-no-shrink py-1 px-2 my-1 mx-2 bg-grey-lighter border overflow-hidden"
      @click="$emit('updateGroupSelection')"
    >
      <div class="flex items-center justify-between">
        <div>
          <AppIcon
            :icon="openCloseIcon"
            class="mr-3"
          />
          <span
            v-tooltip.top-end="formattedResultsInfo"
            v-if="truncatedFormattedResultsInfo !== formattedResultsInfo"
          >
            {{ truncatedFormattedResultsInfo }}
          </span>
          <span
            v-else
            :data-e2e="'SearchResultsFormatListGroup-' + resultsGroup.name"
          >
            {{ formattedResultsInfo }}
          </span>
        </div>
        <ProgressBar v-if="searchInProgress"/>
        <div
          v-else
          class="flex items-center"
        >
          <AppLink
            v-tooltip.right="'Load more results'"
            v-if="resultsGroup.shouldLoadMoreResults"
            @click.stop="loadMoreResults"
          >
            Load more
          </AppLink>
          <DependencyFilterIcon
            v-if="hasDepFilter"
            location="Header Result"
          />
        </div>
        <div
          v-if="resultsGroup.source === 'Pins' && resultsGroup.key"
          class="flex items-center"
        >
          <AppIcon
            v-if="resultsGroup.isSolved"
            icon="check"
            class="text-xs text-green-dark"
          />
          <AppIcon
            :icon="!noteIsActive ? 'edit' : 'ellipsis-h'"
            class="ml-3"
            @click.stop="createOrViewExistingPinGroupNote(resultsGroup)"
          />
          <AppIcon
            class="ml-3"
            icon="trash"
            @click.stop="removePinGroup(resultsGroup.key)"
          />
        </div>
      </div>
    </div>
    <div
      v-if="open"
      ref="resultScroll"
      :class="$style.results"
    >
      <component
        v-for="result in resultsGroup.results"
        :key="result.key"
        :is="getSearchResultsItemType(result)"
        :result="result"
        @select="selectSearchResult"
        @contextmenu="showContextMenu"
      />
    </div>
  </div>
</template>

<script>
import flatten from 'lodash/flatten'
import resultBranchRef from '@helpers/result-branch-ref'
import { ipcRenderer as ipc } from 'electron'
import {
  pinsActions,
  pinsGetters,
  searchGetters,
  searchActions,
  userProfileGetters,
  editorGetters,
  editorActions
} from '@state/helpers'
import ProgressBar from './progress-bar'
import DependencyFilterIcon from './dependency-filter-icon'

export default {
  components: { ProgressBar, DependencyFilterIcon },
  props: {
    resultsGroup: {
      type: Object,
      required: true
    },
    open: {
      type: Boolean,
      default: false
    },
    select: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...userProfileGetters,
    ...searchGetters,
    ...editorGetters,
    ...pinsGetters,
    noteIsActive() {
      return (
        this.currentGroupsNote &&
        this.currentGroupsNote.groupName === this.resultsGroup.name
      )
    },
    searchInProgress() {
      return (
        this.resultsGroup.status === 'pending' ||
        (process.env.RANKER_ACTIVE && this.resultsGroup.isRanking)
      )
    },
    resultsCount() {
      return flatten(this.resultsGroup.results.map(result => result.branches))
        .length
    },
    resultType() {
      switch (this.resultsGroup.name) {
        case 'Pins':
          return 'pin'
        case 'Custom Sources':
          return 'source'
        case 'GitHub Issues':
          return 'issue'
        case 'YouTube':
          return 'video'
        default:
          return 'result'
      }
    },
    openCloseIcon() {
      return this.open ? 'caret-down' : 'caret-right'
    },
    formattedResultsInfo() {
      if (this.resultsGroup.name === 'View Web Results') {
        return this.resultsGroup.name
      } else {
        return (
          this.resultsGroup.name +
          ' - ' +
          this.resultsCount +
          ' ' +
          this.resultType +
          (this.resultsCount === 1 ? '' : 's')
        )
      }
    },
    truncatedFormattedResultsInfo() {
      const maxLength = 50
      return this.formattedResultsInfo.length > maxLength
        ? this.formattedResultsInfo.slice(0, maxLength) + '...'
        : this.formattedResultsInfo
    },
    hasDepFilter() {
      return (
        this.resultsGroup.name.includes('Git') ||
        this.resultsGroup.name.includes('Personal')
      )
    }
  },
  watch: {
    selectedResult: {
      async handler(newSelected, oldSelected) {
        if (!this.selectedBranch) return
        // Wait until the vue updates DOM elements
        await this.$nextTick()

        if (this.open) {
          // Scroll to new selected result if it's out of view
          const branchEl = document.querySelector(
            `[data-ref="${resultBranchRef(
              this.selectedResult,
              this.selectedBranch
            )}"]`
          )
          if (!branchEl) return

          const container = this.$refs.resultScroll
          // Estimated size of the info bar and line result header
          const additionalScrollPadding =
            parseInt(this.$style.baseFontSize) * // result info text
            parseInt(this.$style.baseLineHeight) * // it’s line height
              2 + // again for a result title
            parseInt(this.$style.gridPadding) * // paddings around the titles
              5 // 4 + 1 extra for the additional space)

          const branchOffset = branchEl.offsetTop + branchEl.clientHeight
          const containerHeight = container.clientHeight
          const branchIsInView =
            branchEl.offsetTop - additionalScrollPadding >=
              container.scrollTop &&
            branchOffset <= container.scrollTop + containerHeight
          const branchNotFurtherThanContainerHeight =
            branchOffset + branchEl.parentNode.clientHeight < containerHeight
          const newScrollTop = branchIsInView
            ? container.scrollTop
            : branchNotFurtherThanContainerHeight
              ? branchEl.offsetTop - additionalScrollPadding
              : branchOffset - containerHeight
          container.scrollTop = newScrollTop
        }
      },
      deep: true
    }
  },
  methods: {
    ...pinsActions,
    ...searchActions,
    ...editorActions,
    loadMoreResults() {
      this.resultsGroup.getMoreResults()
    },
    getSearchResultsItemType(result) {
      return require(`./search-results-item-${result.type}`).default
    },
    showFileContextMenu(path) {
      // Send event to main process to display file context menu
      ipc.send('display-file-context-menu', {
        path: path,
        x: event.x,
        y: event.y
      })
    },
    showLinkContextMenu(link) {
      // Send event to main process to display link context menu
      ipc.send('display-link-context-menu', {
        link: link,
        x: event.x,
        y: event.y
      })
    },
    showContextMenu(result) {
      if (!result) return
      switch (result.type) {
        case 'file':
          this.showFileContextMenu(result.path)
          break
        case 'question':
          this.showLinkContextMenu(result.link)
          break
        case 'commit':
          const commitUrl =
            result.blob_url || `${result.repo.url}/commit/${result.sha}`

          this.showLinkContextMenu(commitUrl)
          break
        case 'issue':
          this.showLinkContextMenu(result.url)
          break
        case 'pr':
          this.showLinkContextMenu(result.url)
          break
      }
    }
  }
}
</script>

<style lang="scss" module>
@import '~@branding';

.summary {
  outline: none;
  transition: var(--fade-transition);

  &.highlighted {
    border-color: var(--input-focus-border-color);
    box-shadow: config('shadows.default');
  }
}

.results {
  overflow-x: hidden;
  overflow-y: overlay;
}
</style>
