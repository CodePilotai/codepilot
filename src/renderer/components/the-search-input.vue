<template>
  <div
    ref="suggestionsContainer"
    class="relative flex w-full"
  >
    <div
      :class="$style.searchContainer"
      class="relative flex flex-grow z-50 mx-1"
    >
      <AppInputText
        id="SearchForm-searchInput"
        ref="searchInput"
        :value="query.text"
        v-bind="$attrs"
        data-v-step="search-input"
        data-e2e="TheSearchBar-input"
        placeholder="Type your search then press Enter"
        class="bg-transparent flex flex-grow z-20"
        @keydown.up.prevent="prev"
        @keydown.down.prevent="next"
        @keydown.tab.prevent="autocomplete"
        @keydown.enter="confirm()"
        @keydown.esc="deactivate"
        @keydown.delete="currentStepIndex = 0"
        @input="updateQuery({ text: $event })"
        @focus="activate"
        @blur="deactivate"
        v-on="$listeners"
      >
        <slot slot="prefix"/>
        <div
          slot="postfix"
          class="relative flex items-center justify-center rounded-none"
        >
          <button
            v-tooltip.bottom="'Match whole word'"
            v-if="!query.useRegex"
            :class="[
              { ['opacity-100']: query.matchWholeWord },
              { [$style.active]: query.matchWholeWord }
            ]"
            data-e2e="AppInputText-Match whole word"
            class="py-0 px-2 font-mono leading-none text-grey-text cursor-pointer bg-transparent border-none active:text-color-high-contrast opacity-75 h-full mb-0"
            tabindex="-1"
            @click="toggleMatchWholeWord"
          >
            |Aa|
          </button>
          <button
            v-tooltip.bottom="'Use regex'"
            :class="[
              { ['opacity-100']: query.useRegex },
              { [$style.active]: query.useRegex }
            ]"
            data-e2e="AppInputText-Use regex"
            class="py-0 px-3 font-mono leading-none text-grey-text cursor-pointer bg-transparent border-none active:text-color-high-contrast opacity-75 h-full mb-0"
            tabindex="-1"
            @click="toggleRegex"
          >
            .*
          </button>
          <AppButton
            v-tooltip.bottom="'Click to run the search (enter)'"
            :class="$style.searchButton"
            data-v-step="search-confirm"
            icon="search"
            class="rounded-none h-full mb-0 opacity-75"
            @click="activate({ step: 1, focus: true })"
          />
        </div>
      </AppInputText>
      <div
        v-show="isOpen"
        :class="$style.searchResultsList"
        class="absolute w-full p-3 text-grey-text bg-grey border z-10 border-primary border-t-0 rounded shadow-md rounded-t-none -mt-1"
        @mousedown.prevent
        @click.prevent
      >
        <p
          v-if="options.length"
          :class="$style.dropdownDescription"
          class="py-1 px-0 m-0 mb-2 text-base font-normal"
        >
          {{ currentStepIndex ? 'What are you searching for?' : 'Previous searched queries' }}
        </p>
        <ul
          ref="scrollContainer"
          :class="$style.dropdownList"
          data-v-step="search-options"
          class="mb-0 overflow-auto"
        >
          <li
            v-if="query.text.trim() && currentStepIndex === 0"
            :class="[
              $style.dropdownItem,
              { [$style.focused]: currentOptionIndex === -1 }
            ]"
            class="relative py-2 px-3 mb-3 text-grey-text cursor-pointer bg-grey-lighter border rounded"
            @mouseenter="currentOptionIndex = -1"
            @mousedown.prevent="confirm(-1)"
          >
            <AppHighlight
              :body="`Search for ${query.text}`"
              :matcher="query.text"
              :class-name="'font-semibold' + $style.appHighlight"
            />
            <AppIcon
              v-if="currentOptionIndex === -1"
              :class="$style.optionConfirm"
              class="absolute text-xl"
              icon="level-down"
            />
          </li>
          <li
            v-for="(option, index) in options"
            :key="index"
            :class="[
              $style.dropdownItem,
              { [$style.focused]: currentOptionIndex === index }
            ]"
            :data-v-step="`search-option-${index}`"
            class="relative py-2 px-3 mb-3 text-grey-text cursor-pointer bg-grey-lighter border rounded"
            @mouseenter="currentOptionIndex = index"
            @mousedown.prevent="confirm(index)"
          >
            <AppHighlight
              v-if="currentStepIndex === 0"
              :body="option"
              :matcher="query.text"
              :class-name="'font-semibold' + $style.appHighlight"
            />
            <template v-else>
              <strong class="$text-grey-text-high-contrast">
                {{ option.name }}
              </strong>
              | {{ option.secondaryLabel }}
            </template>
            <AppIcon
              v-if="currentOptionIndex === index"
              :class="$style.optionConfirm"
              class="absolute text-xl"
              icon="level-down"
            />
          </li>
        </ul>
        <p
          :class="$style.dropdownInstructions"
          class="flex py-0 px-3 m-0 text-sm"
        >
          <span class="my-0 mx-3" >
            <AppIcon
              class="$text-grey-text-high-contrast"
              icon="arrow-up ml-0 mr-1"
            />
            <AppIcon
              class="$text-grey-text-high-contrast"
              icon="arrow-down mr-1"
            />
            to navigate
          </span>
          |
          <span class="my-0 mx-3">
            <strong
              :class="$style.strong"
              class="ml-0 mr-1"
            >
              TAB
            </strong> to autocomplete
          </span>
          |
          <span class="my-0 mx-3" >
            <AppIcon
              :class="$style.strong"
              class="ml-0 mr-1"
              icon="level-down"
              style="transform: rotate(90deg);
"
            />
            to select
          </span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron'
import { searchGetters, searchActions } from '@state/helpers'

export default {
  data() {
    return {
      isActive: false,
      searchHistoryRequested: false,
      selectedSearchSuggestion: null,
      steps: ['searchSuggestions', 'searchIntents'],
      currentOptionIndex: -1,
      currentStepIndex: 0
    }
  },
  computed: {
    ...searchGetters,
    advancedSearchIcon() {
      return this.isAdvancedOpen ? 'minus' : 'plus'
    },
    currentStep() {
      return this.steps[this.currentStepIndex]
    },
    options() {
      return this[this.currentStep]
    },
    currentOption() {
      return this.options[this.currentOptionIndex]
    },
    searchSuggestions() {
      // Trim the query, so that leading or ending
      // whitespace is not included.
      const currentQueryText = this.query.text.trim()

      const suggestions = this.recentQueries
        // Just get the text of each recent query
        .map(recentQuery => recentQuery.text)
        // Reverse the order, so that newest queries
        // are first in the array
        .reverse()
        .filter(
          (recentQueryText, index, self) =>
            // Do not include the current query
            recentQueryText !== currentQueryText &&
            // Include all texts that start with the same characters
            // as the current query text unless we want to show all results
            // by toggling with alt key
            recentQueryText.includes(currentQueryText) &&
            // Only include texts are not already included
            self.indexOf(recentQueryText) === index
        )

      // If the current query is not empty
      if (currentQueryText) {
        // Sort the suggestions by query length,
        // in ascending order
        suggestions.sort((a, b) => a.length - b.length)
      }

      // Return all suggestions in history
      return suggestions
    },
    isOpen() {
      return (
        this.isActive && (this.searchHistoryRequested || this.query.text.trim())
      )
    }
  },
  watch: {
    options(options) {
      if (this.currentOptionIndex >= options.length) {
        this.currentOptionIndex = options.length - 1
      }
    },
    currentOptionIndex(newIndex, oldIndex) {
      const container = this.$refs.scrollContainer
      const listItemHeight = 51

      if (
        container.scrollTop < listItemHeight * (newIndex - 4) &&
        oldIndex !== -1
      ) {
        container.scrollTop = container.scrollTop + listItemHeight
      } else if (
        container.scrollTop > listItemHeight * newIndex ||
        oldIndex === -1
      ) {
        container.scrollTop = listItemHeight * newIndex
      }
    }
  },
  created() {
    ipcRenderer.on('focusSearchInput', () => this.activate({ focus: true }))
    ipcRenderer.on('run-deep-link-search', (event, args) => {
      this.updateQuery({ text: args.query })
      this.confirm()
      this.currentOptionIndex = this.options.findIndex(
        intent => intent.name.toLowerCase() === args.intent.toLowerCase()
      )
      this.search(this.options[this.currentOptionIndex])
    })
  },
  mounted() {
    // Focus the input immediately, after it's first rendered
    this.activate({ focus: true })
  },
  methods: {
    ...searchActions,
    async focusSearchInput(event) {
      this.$nextTick(() => {
        const { input } = this.$refs.searchInput.$refs
        input.focus()
        input.select()
      })
    },
    activate({ step = 0, focus = false }) {
      if (this.isActive) return
      this.searchHistoryRequested = false
      this.isActive = true
      this.currentStepIndex = step
      this.currentOptionIndex = step - 1
      if (focus) this.focusSearchInput()
    },
    deactivate() {
      this.isActive = false
      this.currentStepIndex = 0
      this.$refs.searchInput.$refs.input.blur()
    },
    toggleRegex() {
      this.updateQuery({ useRegex: !this.query.useRegex })
    },
    toggleMatchWholeWord() {
      this.updateQuery({ matchWholeWord: !this.query.matchWholeWord })
    },
    autocomplete() {
      switch (this.currentStep) {
        case this.steps[0]:
          if (this.currentOption) {
            this.chooseSearchSuggestion(this.currentOption)
          }
          this.currentOptionIndex = -1

          break

        default:
          console.warn('No autocomplete for this step')
      }
    },
    prev() {
      const startingIndex = this.currentStepIndex - 1
      if (this.currentOptionIndex > startingIndex) {
        this.currentOptionIndex--
      } else {
        this.currentOptionIndex = this.options.length - 1
      }
    },
    next() {
      this.isActive = true
      this.searchHistoryRequested = true
      const startingIndex = this.currentStepIndex - 1
      if (this.currentOptionIndex < this.options.length - 1) {
        this.currentOptionIndex++
      } else {
        this.currentOptionIndex = startingIndex
      }
    },
    confirm(index) {
      if (index || index === 0) this.currentOptionIndex = index

      switch (this.currentStep) {
        case this.steps[0]:
          if (this.currentOption) {
            this.chooseSearchSuggestion(this.currentOption)
          }
          this.promptForIntent()

          if (this.matchingRecentQuery) {
            this.currentOptionIndex = this.searchIntents.findIndex(
              searchIntent =>
                searchIntent.key ===
                this.matchingRecentQuery.selectedSearchIntentKey
            )
          } else {
            this.currentOptionIndex = 0
          }
          break

        case this.steps[1]:
          this.search(this.currentOption)
          break

        default:
          console.warn('Missing step?')
      }
    },
    promptForIntent() {
      this.currentStepIndex = 1
      this.currentOptionIndex =
        this.options.findIndex(
          intent => intent.name === this.selectedSearchIntent.name
        ) || 0
    },
    search(option) {
      this.updateSearchIntent(option.name)
      this.updateSelectedSearchIntent(option.name)

      if (this.query.text.trim()) {
        this.$emit('search')
      }
      this.currentStepIndex = 0
      this.isActive = false
    },
    chooseSearchSuggestion(suggestion) {
      this.updateQuery({ text: suggestion })
    }
  }
}
</script>

<style lang="scss" module>
@import '~@branding';

.search-button {
  background: var(--top-bar-bg);
  transition: $fade-transition;
}

.dropdown-description {
  color: var(--search-dropdown-text-color);

  &:focus {
    outline: none;
  }
}

.dropdown-instructions {
  color: var(--search-dropdown-text-color);
}

.search-container {
  input:focus {
    background: none;
  }
}

.option-confirm {
  top: $grid-padding / 2;
  right: $grid-padding * 1.5;

  &::before {
    display: block;
    transform: rotate(90deg);
  }
}

.dropdown-list {
  max-height: 320px;
}

.strong {
  color: $app-prominent-text-color;
}

.app-highlight {
  color: $app-prominent-text-color;
}

.dropdown-item {
  &:hover,
  &.focused {
    color: var(--search-dropdown-highlighted-text-color);
    background: var(--search-dropdown-highlighted-bg);

    .app-highlight,
    .strong {
      color: var(--search-dropdown-highlighted-text-color);
    }
  }
}

.active {
  background: var(--app-bg) !important;
}

.search-results-list {
  top: 100%;
}
</style>
