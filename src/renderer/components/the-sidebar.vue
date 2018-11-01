<template>
  <div
    v-if="viewable.type !== 'settings'"
    class="relative z-10"
  >
    <div
      v-if="sidebarIsVisible"
      id="TheSidebar-el"
      :class="[
        $style.sidebar,
        { [$style.animated]: sidebarAnimating }
      ]"
      :style="{
        width: sidebarWidth + 'px',
        minWidth: sidebarWidth + 'px'
      }"
      data-v-step="sidebar"
      class="flex flex-col h-full bg-grey-dark overflow-hidden"
      @mouseenter="showResizer"
      @mouseleave="hideResizer"
    >
      <div class="relative flex h-full pt-1">
        <div class="flex flex-col w-full">
          <TheSearchResults/>
        </div>
      </div>
      <SidebarResizer :arrow-visible="sidebarHovered" />
    </div>
  </div>
</template>

<script>
import TheSearchResults from './the-search-results'
import SearchResultsFeedback from './search-results-feedback'
import SidebarResizer from './sidebar-resizer'
import {
  interfaceGetters,
  interfaceActions,
  searchGetters
} from '@state/helpers'

export default {
  components: {
    TheSearchResults,
    SearchResultsFeedback,
    SidebarResizer
  },
  data() {
    return {
      sidebarHovered: false,
      hoverTimeout: null
    }
  },
  computed: {
    ...interfaceGetters,
    ...searchGetters
  },
  methods: {
    ...interfaceActions,
    showResizer(event) {
      this.sidebarHovered = true
      clearTimeout(this.hoverTimeout)
    },
    hideResizer(event) {
      this.hoverTimeout = setTimeout(() => {
        this.sidebarHovered = false
      }, 2500)
    }
  }
}
</script>

<style lang="scss" module>
@import '~@branding';

.sidebar {
  width: $sidebar-default-width;
  transition: $fade-transition;

  &.animated {
    transition: all $sidebar-transition-duration;
  }
}
</style>
