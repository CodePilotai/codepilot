<template>
  <div class="flex flex-col h-full">
    <main
      :class="$style.main"
      class="my-8 mx-auto max-w-md"
    >
      <div class="flex justify-center">
        <slot name="hero"/>
      </div>
      <header
        :class="$style.header"
        class="my-0 mx-auto text-center max-w-md"
      >
        <slot name="header"/>
        <OnboardingProgressDots/>
      </header>
      <slot/>
      <AppButton
        v-if="buttonTitle"
        :data-e2e="'OnboardingStage-' + dataE2eButtonTitle"
        :disabled="buttonDisabled"
        class="my-4"
        type="main"
        @click="$emit('button-click', $event)"
      >
        {{ buttonTitle }}
      </AppButton>
      <footer class="flex justify-center">
        <div
          :class="$style.quote"
          class="items-center my-8 mx-auto text-sm italic"
        >
          <div
            v-if="codepilotTip"
          >
            {{ codepilotTip }}
          </div>
          <div
            v-if="quote"
          >
            "{{ quote }}"
          </div>
          <div
            v-if="quoteAuthor"
            class="flex justify-end"
          >
            - {{ quoteAuthor }}
          </div>
        </div>
      </footer>
      <!-- <div class="flex items-center">
        <ImportExportSettings
          :only-import="true"
          class="mr-3 -ml-3"
        />
        Import existing CodePilot settings and skip the onboarding.
      </div> -->
    </main>
  </div>
</template>

<script>
import { onboardingGetters, onboardingActions } from '@state/helpers'
import OnboardingProgressDots from './onboarding-progress-dots'
import ImportExportSettings from '@components/import-export-settings'

export default {
  components: {
    OnboardingProgressDots,
    ImportExportSettings
  },
  props: {
    buttonDisabled: {
      type: Boolean,
      default: false
    },
    buttonTitle: {
      type: String,
      default: ''
    },
    quote: {
      type: String,
      default: ''
    },
    quoteAuthor: {
      type: String,
      default: ''
    },
    dataE2eButtonTitle: {
      type: String,
      default: ''
    },
    codepilotTip: {
      type: String,
      default: ''
    }
  },
  computed: {
    ...onboardingGetters
  },
  methods: {
    ...onboardingActions
  }
}
</script>

<style lang="scss" module>
@import '~@branding';

.header,
.main {
  h1 {
    margin-top: config('margin.2');
  }
}
</style>
