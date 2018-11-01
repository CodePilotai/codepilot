<template>
  <OnboardingStage
    quote="Every once in a while, a new technology, an old problem, and a big idea turn into an innovation."
    quote-author="Dean Kamen"
    data-e2e-button-title="continue"
    button-title="Continue"
    @button-click="updateOnboardingStage('next')"
  >
    <GlobalEvents @keydown.enter="updateOnboardingStage('next')" />
    <template slot="header">
      <AppIcon icon="cog fa-4x"/>
      <h1 data-e2e="OnboardingWizardOptionalSettings-title">Optional Settings</h1>
    </template>
    <OptionalSettings/>
  </OnboardingStage>
</template>

<script>
import OnboardingStage from './onboarding-stage'
import OptionalSettings from './optional-settings'
import { onboardingActions } from '@state/helpers'
import GlobalEvents from 'vue-global-events'

export default {
  components: {
    OnboardingStage,
    OptionalSettings,
    GlobalEvents
  },
  methods: {
    ...onboardingActions
  }
}
</script>
