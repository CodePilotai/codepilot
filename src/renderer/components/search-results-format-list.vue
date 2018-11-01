<template>
  <div
    class="flex flex-col flex-grow min-w-full no-outline"
    tabindex="-1"
  >
    <GlobalEvents
      v-if="!_inactive"
      @keydown="navigateSearchResults"
    />
    <SearchResultsFormatListGroup
      v-for="resultsGroup in searchResultsItemsGroups"
      v-show="resultsGroup.name === 'Pins' || selectedTabSearchResults.resultsCount"
      :key="resultsGroup.name"
      :results-group="resultsGroup"
      :open="openedGroupName === resultsGroup.name"
      :select="selectedGroupName === resultsGroup.name"
      @updateGroupSelection="updateOpenedGroupName(resultsGroup.name)"
    />
  </div>
</template>

<script>
import SearchResultsFormatListGroup from './search-results-format-list-group'
import {
  searchGetters,
  searchActions,
  interfaceActions,
  interfaceGetters,
  editorActions
} from '@state/helpers'
import GlobalEvents from 'vue-global-events'

export default {
  components: {
    SearchResultsFormatListGroup,
    GlobalEvents
  },
  props: {
    scrollContainer: {
      type: window.Element,
      default: null
    }
  },
  data() {
    return {
      openedGroupName: '',
      selectedGroupName: ''
    }
  },
  computed: {
    ...searchGetters,
    ...interfaceGetters,
    selectedInResults() {
      return this.selectedTabSearchResults.items.some(this.resultIsSelected)
    },
    searchResultsLength() {
      return this.selectedTabSearchResults.resultsCount
    }
  },
  watch: {
    selectedResult: {
      handler(newSelected, oldSelected) {
        for (const resultsGroup of this.searchResultsItemsGroups) {
          for (const result of resultsGroup.results) {
            if (result.key === newSelected.key) {
              this.openedGroupName = resultsGroup.name
            }
          }
        }
        this.selectedGroupName = ''
      },
      deep: true
    },
    selectedSearchIntentKey(newValue, oldValue) {
      this.updateOpenedGroupName(this.openedGroupName)
      this.selectedGroupName = ''
    }
  },
  methods: {
    ...interfaceActions,
    ...searchActions,
    ...editorActions,
    resultIsSelected(result) {
      return (
        this.selectedResult.key && this.selectedResult.key.includes(result.key)
      )
    },
    updateOpenedGroupName(name) {
      this.openedGroupName = this.openedGroupName === name ? '' : name
    },
    async navigateSearchResults(event) {
      // Abort if editor focused
      if (this.editorFocused) {
        if (event.key === 'Escape') {
          this.editorBlur()
        }
        return true
      }

      // Get the ViewPane element the old style.
      const viewPane = document.getElementById('TheViewPane-el')
      // Check if event originated from within the ViewPane
      // if yes – prevent the results navigation
      if (viewPane && viewPane.contains(event.target)) {
        // If the users had pressed the Escape key focus the sidebar
        // thus making it possible to navigate the results with arrows
        if (event.key === 'Escape') {
          this.$el.focus()
        }
        return true
      }

      // Abort if no viewable and search results exist yet
      if (!this.selectedBranch && !this.selectedTabSearchResults.items.length)
        return true

      const focusedEditable = await this.$store.dispatch('getFocusedEditable')

      if (event.key === 'ArrowUp') {
        event.preventDefault()

        // if no group is opened but one is selected
        if (this.openedGroupName === '' && this.selectedGroupName) {
          const indexOfCurrentlySelectedGroup = this.searchResultsItemsGroups.findIndex(
            itemsGroup => itemsGroup.name === this.selectedGroupName
          )

          // If no tab is open, check if the currently selected tab is not the first tab
          // otherwise nothing happens
          if (indexOfCurrentlySelectedGroup > 0) {
            // select the previous tab if it is
            this.selectedGroupName = this.searchResultsItemsGroups[
              indexOfCurrentlySelectedGroup - 1
            ].name
          }
        } else {
          this.selectSearchResult({ relative: 'prev' })
          if (focusedEditable) focusedEditable.blur()
        }
        return true
      }

      if (event.key === 'ArrowDown') {
        event.preventDefault()

        // If no group is opened and no group is selected, select the first group allowing the user to navigate the accordion groups
        if (this.openedGroupName === '' && this.selectedGroupName === '') {
          this.selectedGroupName = this.searchResultsItemsGroups[0].name
        }
        // If there is a group open and not selected
        else if (this.openedGroupName !== '' && this.selectedGroupName === '') {
          // select the next result
          this.selectSearchResult({ relative: 'next' })
        }
        // If there is no group open but a group is selected
        else if (this.openedGroupName === '' && this.selectedGroupName !== '') {
          // find the index of the group which is selected
          const indexOfCurrentlySelectedGroup = this.searchResultsItemsGroups.findIndex(
            itemsGroup => itemsGroup.name === this.selectedGroupName
          )

          // If the selected group is not the last group, select the next group
          if (
            indexOfCurrentlySelectedGroup <
            this.searchResultsItemsGroups.length - 1
          ) {
            this.selectedGroupName = this.searchResultsItemsGroups[
              indexOfCurrentlySelectedGroup + 1
            ].name
          }
        }
        // If there a group opened and selected
        else if (this.openedGroupName !== '' && this.selectedGroupName !== '') {
          // Find the index of the group
          const currentlyOpenedGroupIndex = this.searchResultsItemsGroups.findIndex(
            group => group.name === this.openedGroupName
          )

          // Check if the current opened and selected group is empty
          if (
            this.searchResultsItemsGroups[currentlyOpenedGroupIndex].results
              .length
          ) {
            // If the group is not empty, select the first result in the group
            this.selectSearchResult({
              relative: 'firstInGroup',
              groupName: this.openedGroupName
            })
          } else if (
            this.groupContainingSelectedResult.name === this.openedGroupName
          ) {
            // If the currently selected result exists in the recently opened group, select the next result
            this.selectSearchResult({ relative: 'next' })
          } else {
            // If the group is empty, open the next group with non-zero results and select the first result in that group
            this.updateOpenedGroupName(
              this.searchResultsItemsGroups.find(
                (group, index) =>
                  group.results.length > 0 && index > currentlyOpenedGroupIndex
              ).name
            )
            this.selectedGroupName = ''
            this.selectSearchResult({
              relative: 'firstInGroup',
              groupName: this.openedGroupName
            })
          }
        }
        return true
      }

      if (!focusedEditable && event.key === 'ArrowLeft') {
        event.preventDefault()
        // collapse the currently opened tab
        if (this.openedGroupName !== '') {
          this.selectedGroupName = this.openedGroupName
        }
        this.updateOpenedGroupName(this.openedGroupName)

        return true
      }

      if (!focusedEditable && event.key === 'ArrowRight') {
        event.preventDefault()

        // If no tab is open, open the currently selected tab
        if (this.openedGroupName === '') {
          this.updateOpenedGroupName(this.selectedGroupName)
          // if the tab that was opened above contains the selected result, don't wait for arrow down to make selection
          if (
            this.groupContainingSelectedResult &&
            this.groupContainingSelectedResult.name === this.openedGroupName
          )
            this.selectedGroupName = ''
        } else {
          this.editorFocus()
        }

        return true
      }
    }
  }
}
</script>
