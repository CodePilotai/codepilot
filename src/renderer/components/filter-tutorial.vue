<template>
  <v-tour
    :steps="filterTutorialSteps"
    :options="{ startTimeout: 300 }"
    :callbacks="filterTutorialCallbacks"
    name="filtering-tour"
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
        >
          <template>
            <div slot="actions">
              <button
                v-if="!isLastStep(tour.currentStep)"
                class="text-white bg-black rounded p-3"
                @click="tour.stop"
              >
                Skip Tour
              </button>
              <button
                v-if="!isFirstStep(tour.currentStep)"
                class="text-white bg-black rounded p-3"
                @click="tour.previousStep"
              >
                Previous
              </button>
              <button
                v-if="!isLastStep(tour.currentStep)"
                class="text-white bg-black rounded p-3"
                @click="tryNextStep(tour.currentStep)"
              >
                Next
              </button>
              <button
                v-if="isLastStep(tour.currentStep)"
                class="text-white bg-black rounded p-3"
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
</template>

<script>
import {
  searchGetters,
  interfaceActions,
  interfaceGetters,
  tutorialsGetters,
  tutorialsActions
} from '@state/helpers'

const FILTER_TUTORIAL_STEPS = [
  {
    target: '[data-v-step="filter-button"]',
    content:
      'Looking for something specific? You can now filter your results. Click here to check all the available filters.'
  },
  {
    target: '[data-v-step="filter-exact-match"]',
    content:
      'Looking only for results that include the exact phrase that you searched for? Check this checkbox.',
    params: {
      placement: 'bottom'
    }
  },
  {
    target: '[data-v-step="[filter-extension]"]',
    content:
      'Only interested in results matching specific extension? Use the inputs to include or exclude file names and extensions.',
    params: {
      placement: 'bottom'
    }
  },
  {
    target: '[data-v-step="filter-dependencies"]',
    content: 'Trying to find projects that depend on certain libraries?',
    params: {
      placement: 'bottom'
    }
  },
  {
    target: '[data-v-step="filter-license"]',
    content:
      'Care about the license? Here you can pick the ones that fit into your project.',
    params: {
      placement: 'bottom'
    }
  },
  {
    target: '[data-v-step="sidebar"]',
    content:
      'All filters will be automatically applied on all the results in the sidebar where the filter can be applid.',
    params: {
      placement: 'left'
    }
  }
]

export default {
  data() {
    return {
      filterTutorialCallbacks: {
        onStop: this.filterTutorialDoneHandler
      }
    }
  },
  computed: {
    ...interfaceGetters,
    ...searchGetters,
    ...tutorialsGetters,
    filterTutorialSteps: () => FILTER_TUTORIAL_STEPS
  },
  watch: {
    // Waiting for the first search to complete
    'searchResults.meta.status'(status) {
      if (
        !this.tutorialsCompleted.filters &&
        this.selectedSearchIntent.name === 'Code' &&
        status === 'complete'
      ) {
        this.$tours['filtering-tour'].start()
      }
    },
    'viewable.type'(type) {
      if (this.$tours['filtering-tour'].isRunning && type !== 'filters') {
        this.$tours['filtering-tour'].stop()
      }
    }
  },
  methods: {
    ...interfaceActions,
    ...tutorialsActions,
    filterTutorialDoneHandler() {
      this.setTutorialStatus({
        filters: true
      })
    },
    tryNextStep(step) {
      if (this.viewable.type !== 'filters') {
        this.toggleView({ type: 'filters' })
        // HACK: Ensure that the filter pane has loaded before trying to go to the next step
        setTimeout(() => {
          this.$tours['filtering-tour'].nextStep()
        }, 500)
        return
      }
      this.$tours['filtering-tour'].nextStep()
    },
    isFirstStep(step) {
      return step === 0
    },
    isLastStep(step) {
      return step === this.$tours['filtering-tour'].steps.length - 1
    }
  }
}
</script>
