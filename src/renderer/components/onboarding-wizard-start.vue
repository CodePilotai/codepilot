<template>
  <OnboardingStage
    quote="Never memorize something you can look up"
    quote-author="Albert Einstein"
    data-e2e-button-title="wizard-start"
    button-title="Click to Continue"
    @button-click="updateOnboardingStage('next')"
  >
    <GlobalEvents @keydown.enter="updateOnboardingStage('next')" />
    <img
      slot="hero"
      src="~@assets/images/codepilot-ai-logo.svg"
    >
    <template slot="header">
      <h1 data-e2e="OnboardingWizardStart-title">CodePilot.ai</h1>
    </template>
    <h2 class="flex justify-center">Quickly find solutions to your coding problems</h2>
    <p>Tip: If you have any issues or feedback, click the smiley face</p>
  </OnboardingStage>
</template>

<script>
import OnboardingStage from './onboarding-stage'
import { interfaceGetters, onboardingActions } from '@state/helpers'
import GlobalEvents from 'vue-global-events'
export default {
  components: {
    OnboardingStage,
    GlobalEvents
  },
  computed: {
    ...interfaceGetters
  },
  methods: {
    ...onboardingActions
  }
}
</script>
