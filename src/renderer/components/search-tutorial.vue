<template>
  <div class="z-50">
    <div
      v-if="isRunning"
      class="fixed pin z-40 block"
      @click.stop.prevent
      @mousedown.stop.prevent
    />
    <v-tour
      :steps="searchTutorialSteps"
      :options="{ startTimeout: 300 }"
      :callbacks="searchTutorialCallbacks"
      name="searching-tour"
    >
      <template slot-scope="tour">
        <transition name="fade">
          <v-step
            v-for="(step, index) of tour.steps"
            v-if="tour.currentStep === index"
            :key="index"
            :step="step"
            :previous-step="tour.previousStep"
            :next-step="tour.nextStep"
            :stop="tour.stop"
            :is-first="tour.isFirst"
            :is-last="tour.isLast"
            class="z-50"
          >
            <template>
              <div slot="actions">
                <button
                  v-if="!isLastStep(tour.currentStep)"
                  class="text-white bg-grey rounded p-3"
                  @click="tour.stop"
                >
                  Skip Tour
                </button>
                <button
                  v-if="!isLastStep(tour.currentStep)"
                  class="text-white bg-grey rounded p-3 ml-3"
                  @mousedown.stop.prevent="tryNextStep(tour.currentStep)"
                >
                  Next
                </button>
                <button
                  v-if="isLastStep(tour.currentStep)"
                  class="text-white bg-grey rounded p-3"
                  @click="tour.stop"
                >
                  Finish
                </button>
              </div>
            </template>
          </v-step>
        </transition>
      </template>
    </v-tour>
  </div>
</template>

<script>
import {
  searchGetters,
  interfaceActions,
  interfaceGetters,
  tutorialsGetters,
  tutorialsActions
} from '@state/helpers'

const SEARCH_TUTORIAL_STEPS = [
  {
    target: '[data-v-step="search-profile"]',
    content:
      'Welcome to CodePilot!<br/><br/> Let’s get you through your first search. Here’s the dropdown that allows for changing the Developer Profile. You can modify your profile later in the settings. For now we will proceed with the default one.'
  },
  {
    target: '[data-v-step="search-input"]',
    content:
      'Here’s the search input. You can use it to start new searches as well as pick from previous searches. We populated your list with some example queries to get you started.'
  },
  {
    target: '[data-v-step="search-options"]',
    content:
      'This is one of the previous searches. Once you select it, you will proceed to the next step of selecting the intent. You can select the intent using arrow keys.',
    params: {
      placement: 'top'
    }
  },
  {
    target: '[data-v-step="search-option-0"]',
    content:
      'Code.. Use this intent when looking for code examples. <strong>Query should be code</strong>',
    params: {
      placement: 'top'
    }
  },
  {
    target: '[data-v-step="search-option-1"]',
    content:
      'Learn. Use this intent when looking for answers to coding problems. <strong>Query should be natural language</strong>',
    params: {
      placement: 'left'
    }
  },
  {
    target: '[data-v-step="search-option-2"]',
    content:
      'Errors. Use this intent when looking for solutions to errors. <strong>Query can be mixed</strong>',
    params: {
      placement: 'left'
    }
  },
  {
    target: '[data-v-step="search-option-3"]',
    content:
      'Docs<br/><br/>Use this intent when looking for documentation. <strong>Query should be code</strong>',
    params: {
      placement: 'bottom'
    }
  },
  {
    target: '[data-v-step="search-confirm"]',
    content:
      'Then click on the selected option or press Enter key to start searching.'
  },
  {
    target: '[data-v-step="sidebar"]',
    content:
      'Search results list will appear here. Click on a result to see it.',
    params: {
      placement: 'left'
    }
  },
  {
    target: '[data-v-step="viewpane"]',
    content:
      'Before you select a result, you can read more about other CodePilot features here.',
    params: {
      placement: 'right'
    }
  }
]

export default {
  data() {
    return {
      searchTutorialCallbacks: {
        onStop: this.searchTutorialDoneHandler
      },
      isRunning: false
    }
  },
  computed: {
    ...interfaceGetters,
    ...searchGetters,
    ...tutorialsGetters,
    searchTutorialSteps: () => SEARCH_TUTORIAL_STEPS
  },
  mounted() {
    if (this.searchIsFullWindow) {
      this.isRunning = true
      this.$tours['searching-tour'].start()
      this.$nextTick(() => {
        const searchInputEl = document.querySelector(
          '[data-v-step="search-input"]'
        )
        searchInputEl.blur()
      })
    }
  },
  methods: {
    ...interfaceActions,
    ...tutorialsActions,
    searchTutorialDoneHandler() {
      this.setTutorialStatus({
        search: true
      })
      this.isRunning = false
    },
    tryNextStep(step) {
      if (step === 1) {
        const searchInputEl = document.querySelector(
          '[data-v-step="search-input"]'
        )
        searchInputEl.blur()
        searchInputEl.dispatchEvent(
          new KeyboardEvent('keydown', {
            bubbles: false,
            key: 'ArrowDown',
            char: 'ArrowDown'
          })
        )
      }
      if (step === 2) {
        const suggestionEl = document.querySelector(
          '[data-v-step="search-option-0"]'
        )
        suggestionEl.dispatchEvent(new MouseEvent('mousedown'))
      }

      if (step === 7) {
        const searchInputEl = document.querySelector(
          '[data-v-step="search-input"]'
        )
        searchInputEl.dispatchEvent(
          new KeyboardEvent('keydown', {
            bubbles: false,
            key: 'Enter',
            char: 'Enter'
          })
        )
      }

      this.$nextTick(() => {
        this.$tours['searching-tour'].nextStep()
      })
    },
    isFirstStep(step) {
      return step === 0
    },
    isLastStep(step) {
      return step === this.$tours['searching-tour'].steps.length - 1
    }
  }
}
</script>
