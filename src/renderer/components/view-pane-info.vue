<template>
  <div
    v-if="InfoComponent"
    :class="$style.container"
    class="flex flex-no-shrink items-center p-2 bg-grey-darker border-b border-solid"
  >
    <AppPinButton :result="selectedResult"/>
    <component
      :is="InfoComponent"
      :selected-result="selectedResult"
      v-bind="$attrs"
      class="px-2 w-full"
      v-on="$listeners"
    />
  </div>
</template>

<script>
import { searchGetters, searchActions } from '@state/helpers'
import kebabCase from 'lodash/kebabCase'

export default {
  computed: {
    ...searchGetters,
    // Use the appropriate file info component if one exists
    InfoComponent() {
      const sourceKey = kebabCase(this.selectedResult.source.toLowerCase())
      try {
        return require(`./view-pane-info-${sourceKey}`).default
      } catch (e) {}
    }
  },
  methods: {
    ...searchActions
  }
}
</script>

<style lang="scss" module>
@import '~@branding';

.container {
  border-bottom: $app-border;
}
</style>
