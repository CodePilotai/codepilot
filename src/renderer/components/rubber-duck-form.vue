<template>
  <div>
    <div class="my-0 mx-auto text-center max-w-md">
      <div
        v-for="index in rubberDuckFormStepSlots.length"
        :key="index"
        :class="[
          $style.dot,
          { [$style.visited]: index <= currentFormSlotIndex + 1},
          { [$style.current]: index === currentFormSlotIndex + 1}
        ]"
        class="inline-block w-3 h-3 m-3 border-2 border-solid rounded-full"
      />
    </div>

    <div>
      <slot :name="'formStep-'+ currentFormSlotIndex"/>
    </div>
    <div class="flex p-1 mt-2">
      <AppButton
        class="mr-2 w-1/4"
        @click="updateRubberDuckModalShown(false)"
      >Close</AppButton>
      <AppButton
        :disabled="currentFormSlotIndex === 0"
        class="mr-2 w-1/4"
        @click="currentFormSlotIndex--"
      >Previous</AppButton>
      <AppButton
        :disabled="currentFormSlotIndex + 1 === rubberDuckFormStepSlots.length"
        class="mr-2 w-1/4"
        @click="currentFormSlotIndex++"
      >Next</AppButton>
      <AppButton
        class="w-1/4"
        @click="rubberDuckSessionComplete()"
      >Done</AppButton>
    </div>
  </div>
</template>
<script>
import { interfaceActions, pinsGetters } from '@state/helpers'

export default {
  data() {
    return {
      currentFormSlotIndex: 0
    }
  },
  computed: {
    ...pinsGetters,
    rubberDuckFormStepSlots() {
      return Object.keys(this.$slots).filter(slotName =>
        slotName.includes('formStep-')
      )
    }
  },
  watch: {
    'currentRubberDuckSession.key': {
      handler(keyValue) {
        this.currentFormSlotIndex = 0
      }
    }
  },
  methods: {
    ...interfaceActions,
    rubberDuckSessionComplete() {
      this.updateRubberDuckModalShown(false)
    }
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
