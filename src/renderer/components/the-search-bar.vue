<template>
  <div
    ref="topBar"
    :class="[
      $style.container,
      { ['flex flex-col justify-center h-full max-w-xl']: searchIsFullWindow },
      { [$style.fullWindow]: searchIsFullWindow },
      { [$style.fullWindowWithPins]: pinnedResults.length },
      {['h-auto']: !searchIsFullWindow && isAdvancedOpen }
    ]"
    class="flex-no-shrink p-3 mx-auto w-full z-30 bg-grey"
  >
    <h1
      v-if="searchIsFullWindow"
      :class="$style.tagline"
      class="mb-3 text-center"
    >
      Faster solutions to your coding problems
    </h1>
    <div>
      <div
        :class="$style.mainSearch"
        class="flex justify-center relative"
      >
        <CodepilotLogo
          v-if="searchIsFullWindow"
          :class="[$style.heroImage]"
        />
        <SelectedProfile
          :has-new-profile-link="!isEditingTemporaryProfile"
          :class="['mr-1', {'sm:hidden md:block': !searchIsFullWindow}]"
          class="flex flex-grow"
        />
        <TheSearchInput
          data-e2e="TheSearchBar-searchInput"
          @search="collapseAndRunSearch"
          @advanced-search="toggleAdvancedSearch"
        >
          <SelectedSearchIntent v-if="!searchIsFullWindow"/>
        </TheSearchInput>
        <AppButton
          v-tooltip.bottom="filtersLabel"
          v-if="!searchIsFullWindow"
          :active="filtersActive"
          data-v-step="filter-button"
          data-e2e="TheSearchBar-toggleExactFilter"
          class="mx-1 cursor-pointer"
          type="bordered"
          @click="toggleView({ type: 'filters' })"
        >
          <div class="flex">
            Filter
            <AppIcon
              class="ml-2"
              icon="filter"
            />
          </div>
        </AppButton>
        <AppButton
          v-tooltip.bottom="'Settings'"
          v-if="viewable || searchIsFullWindow"
          :active="viewable.type === 'settings'"
          data-e2e="TheSearchBar-goToUserSettings"
          icon="gear"
          class="mx-1"
          type="bordered"
          @click="toggleSettingsView()"
        />
        <ThemeToggler class="mx-1"/>
        <AppButton
          type="bordered"
          class="ml-1"
          @click="updateRubberDuckModalShown(true)"
        >
          <RubberDuckIcon class="m-0"/>
        </AppButton>
      </div>
    </div>
  </div>
</template>

<script>
import SelectedSearchIntent from './selected-search-intent'
import SelectedProfile from './selected-profile'
import TheSearchInput from './the-search-input'
import RubberDuckIcon from './rubber-duck-icon'
import CodepilotLogo from './codepilot-logo'
import ThemeToggler from './theme-toggler'

import {
  pinsGetters,
  searchGetters,
  searchActions,
  interfaceGetters,
  interfaceActions,
  internetConnectionGetters,
  userProfileGetters
} from '@state/helpers'

export default {
  components: {
    SelectedSearchIntent,
    TheSearchInput,
    RubberDuckIcon,
    CodepilotLogo,
    ThemeToggler,
    SelectedProfile
  },
  data() {
    return {
      isAdvancedOpen: false
    }
  },
  computed: {
    ...internetConnectionGetters,
    ...pinsGetters,
    ...searchGetters,
    ...interfaceGetters,
    ...userProfileGetters,
    advancedSearchIsEmpty() {
      return !this.query.includeOnly && !this.query.exclude
    },
    filtersLabel() {
      return this.filtersActive ? 'Filters are active' : 'Open filters view'
    }
  },
  created() {
    this.checkAdvancedFieldPopulated()
    window.addEventListener('click', this.closeAdvancedOptionsIfEmpty)
  },
  beforeDestroy() {
    window.removeEventListener('click', this.closeAdvancedOptionsIfEmpty)
  },
  methods: {
    ...searchActions,
    ...interfaceActions,
    closeAdvancedOptionsIfEmpty(event) {
      // Abort hiding advanced search if not all fields are empty
      if (!this.advancedSearchIsEmpty) return true

      // If this was called from a click event handler...
      if (event) {
        // If the click was outside of the top bar...
        if (!this.$refs.topBar.contains(event.target)) {
          this.isAdvancedOpen = false
        }
      } else {
        this.isAdvancedOpen = false
      }
    },
    toggleAdvancedSearch() {
      this.isAdvancedOpen = !this.isAdvancedOpen
    },
    collapseAndRunSearch() {
      this.closeAdvancedOptionsIfEmpty()
      this.runSearch()
    },
    checkAdvancedFieldPopulated() {
      // Check to see if the advanced search fields are empty
      if (!this.advancedSearchIsEmpty) {
        // If they are then go to the non-full screen search
        // and open the advanced fields view.
        this.updateSearchIsFullWindow(false)
        this.isAdvancedOpen = true
      }
    },
    toggleSettingsView() {
      this.toggleView({ type: 'settings' })
      this.revertToPrevSidebarWidth()
    }
  }
}
</script>

<style lang="scss" module>
@import '~@branding';

.container {
  border-bottom: $app-border;
  transition: height $top-bar-transition-duration, $fade-transition;

  &.full-window {
    &.full-window-with-pins {
      height: 30vh;
      margin-top: 20vh;
      border-bottom: none;
    }

    .main-search {
      .hero-image {
        position: absolute;
        top: -$top-bar-logo-height - $top-bar-logo-margin-bottom;
        left: 50%;
        width: $top-bar-logo-width;
        height: $top-bar-logo-height;
        margin-left: $top-bar-logo-width / -2;
      }
    }
  }

  .tagline {
    color: rgba(128, 128, 128, 0.5);
  }
}

.advanced-settings {
  width: $onboarding-max-content-width;
}

.rubber-duck {
  right: $grid-padding;
}
</style>
