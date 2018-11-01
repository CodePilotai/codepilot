<template>
  <div
    ref="scrollableContainer"
    :class="$style.onboardingContainer"
    class="h-full m-6"
  >
    <div class="my-0 mx-auto max-w-md" >
      <component
        :is="CurrentStageComponent"
        :key="currentOnboardingStage"
      />
    </div>
  </div>
</template>

<script>
import { onboardingGetters, onboardingActions } from '@state/helpers'
export default {
  inheritAttrs: false,
  computed: {
    ...onboardingGetters,
    CurrentStageComponent() {
      return require(`./onboarding-wizard-${this.currentOnboardingStage}`)
        .default
    }
  },
  created() {
    window.addEventListener('keydown', this.stageKeyboardNavigate)
  },
  beforeDestroy() {
    window.removeEventListener('keydown', this.stageKeyboardNavigate)
  },
  methods: {
    ...onboardingActions,
    stageKeyboardNavigate(event) {
      if (event.key === 'ArrowLeft' && this.prevOnboardingStage) {
        this.updateOnboardingStage('prev')
      }
      if (event.key === 'ArrowRight' && this.nextOnboardingStage) {
        this.updateOnboardingStage('next')
      }
    }
  }
}
</script>

<style lang="scss" module>
@import '~@branding';

.onboarding-container {
  overflow: overlay;
}

.inner-container {
  max-width: $onboarding-max-container-width;
}
</style>
