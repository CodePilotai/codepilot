<template>
  <div
    v-if="resultIsPinnable"
    class="flex flex-col items-center"
  >
    <AppIcon
      v-tooltip.right="pinTooltipText"
      :class="[
        'text-sm px-3 py-1 rounded cursor-pointer border hover:border-primary',
        { 'text-white bg-primary border-primary': isPinned },
        { 'bg-green-dark border-green-dark hover:border-green-darker': isPinned && resultOrPin.isSolution }
      ]"
      icon="thumb-tack"
      @click.stop.prevent="handleClick"
    />
  </div>
</template>

<script>
import { pinsActions, interfaceActions, pinsGetters } from '@state/helpers'

export default {
  props: {
    result: {
      type: Object,
      required: true
    },
    forceShow: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...pinsGetters,
    resultIsPinnable() {
      return this.forceShow || this.result.type !== 'website'
    },
    pinTooltipText() {
      return this.result.pin ? 'Unpin/edit this pin' : 'Pin this result'
    },
    isPinned() {
      return this.pinnedResults.find(pin => pin.key === this.result.key)
    },
    resultOrPin() {
      return this.isPinned || this.result
    }
  },
  methods: {
    ...pinsActions,
    ...interfaceActions,
    handleClick() {
      if (!this.isPinned) {
        this.addResultPin(this.result)
      } else {
        // if result already has a pin, update the current selected pin result
        // this handles cases where user clicks on pin from main page
        this.updateCurrentSelectedPinResult(this.resultOrPin)
      }

      this.updateAppPinModalShown(true)
    }
  }
}
</script>

<style lang="scss" module>
@import '~@branding';
</style>
