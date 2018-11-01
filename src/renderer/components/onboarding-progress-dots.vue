<template>
  <div>
    <div
      v-for="index in onboardingPages.length"
      :key="index"
      :class="[
        $style.dot,
        { [$style.visited]: index <= currentOnboardingStageIndex + 1},
        { [$style.current]: index === currentOnboardingStageIndex + 1}
      ]"
      class="inline-block w-3 h-3 m-3 border-2 border-solid rounded-full"
    />
  </div>
</template>

<script>
import { onboardingGetters } from '@state/helpers'

export default {
  computed: {
    ...onboardingGetters
  }
}
</script>

<style lang="scss" module>
@import '~@branding';

.dot {
  border-color: $onboarding-progress-dots-border-color;

  &.visited {
    border-color: $onboarding-progress-dots-visited-border-color;
  }

  &.current {
    background: $onboarding-progress-dots-visited-border-color;
  }
}
</style>
