<template lang="html">
  <div
    v-if="pinnedResults.length"
    :class="['flex justify-center', $style.mainContainer]"
  >
    <div class="w-full">
      <h3 class="text-center text-grey-text">Saved</h3>
      <div :class="['w-full flex flex-wrap overflow-overlay justify-center', $style.recentPins]">
        <div
          v-for="(tab, index) of tabs"
          :key="index"
          :class="['flex flex-col mx-2 my-2 sm:w-2/3 lg:w-1/2 xl:w-1/4 ', $style.pinsContainer]"
        >
          <h3 class="w-full py-2 mb-0 text-center text-grey-text no-outline bg-grey-darkest rounded-t ">{{ tab }}</h3>
          <div
            v-if="filteredPinGroups(tab).length"
            class="w-full py-2 bg-grey-dark rounded-b flex flex-col overflow-overlay"
          >
            <div
              v-for="pinGroup of filteredPinGroups(tab)"
              :key="pinGroup.key"
              class="w-full"
            >
              <div
                v-if="pinGroup.name === 'Pins'"
                class="flex flex-col items-center px-2"
              >
                <component
                  v-for="result in pinGroup.results"
                  :key="result.key"
                  :is="getSearchResultsItemType(result)"
                  :result="result"
                  :class="['w-full', $style.pin]"
                  @select="selectSearchResult"
                />
              </div>
              <div
                v-else
                class="flex p-2 ml-2 mr-2 mb-2 bg-grey-lightest rounded cursor-pointer"
                @click="openPinView(pinGroup)"
              >
                <div class="flex-1 flex justify-start">
                  <div>{{ pinGroup.name }} - {{ pinGroup.results.length }}</div>
                </div>
                <div class="flex-1 flex justify-end items-center mr-2">
                  <AppIcon
                    v-if="pinGroup.isSolved"
                    icon="check"
                    class="text-xs text-green-dark"
                  />
                  <AppIcon
                    class="ml-3"
                    icon="edit"
                    @click.stop="openNoteView(pinGroup)"
                  />
                  <AppIcon
                    class="ml-3"
                    icon="trash"
                    @click.stop="removePinGroup(pinGroup.key)"
                  />
                </div>
              </div>
            </div>
          </div>
          <div
            v-else
            :class="['flex items-center justify-center bg-grey-dark p-3 w-full rounded-b']"
          >
            No pins to show
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  pinsGetters,
  pinsActions,
  interfaceActions,
  searchActions
} from '@state/helpers'

export default {
  data() {
    return {
      tabs: ['Problems Unsolved', 'Problems Solved', 'Pins']
    }
  },
  computed: {
    ...pinsGetters
  },
  methods: {
    ...pinsActions,
    ...searchActions,
    ...interfaceActions,
    getSearchResultsItemType(result) {
      this.updateSidebarActiveTab('Pins')
      return require(`./search-results-item-${result.type}`).default
    },
    openPinView(pinGroup) {
      this.updateSidebarActiveTab('Pins')
      this.updateSearchIsFullWindow(false)
      this.selectSearchResult({
        relative: 'firstInGroup',
        groupName: pinGroup.name
      })
    },
    openNoteView(pinGroup) {
      this.updateSidebarActiveTab('Pins')
      this.updateSearchIsFullWindow(false)
      this.createOrViewExistingPinGroupNote(pinGroup)
    },
    filteredPinGroups(tab) {
      switch (tab) {
        case 'Problems Unsolved':
          return this.pinnedResultsGroups.filter(
            group => !group.isSolved && group.name !== 'Pins'
          )
        case 'Problems Solved':
          return this.pinnedResultsGroups.filter(group => group.isSolved)
        case 'Pins':
          return this.pinnedResultsGroups.filter(group => group.name === 'Pins')
        default:
          return this.pinnedResultsGroups.filter(
            group => !group.isSolved && group.name !== 'Pins'
          )
      }
    }
  }
}
</script>

<style lang="css" module>
.main-container {
  flex-shrink: 0;
  height: 50vh;
}

.recent-pins {
  flex-shrink: 0;
  height: 50vh;
}

.pins-container {
  max-height: 40vh;
}

.pin {
  break-inside: avoid;
  page-break-inside: avoid;
  max-height: 10rem;
  transition: all 0.2s ease-in-out;
}

.pin:hover {
  transform: scale(1.02);
}
</style>
