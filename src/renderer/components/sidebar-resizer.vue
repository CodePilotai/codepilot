<template>
  <div
    :class="[
      'absolute pin-y w-2 h-full',
      $style.resizeArea
    ]"
    @mousedown="startResize"
    @dblclick="resizeSidebar"
  >
    <GlobalEvents @keydown.ctrl.shift.b="resizeSidebar" />

    <div
      :class="[
        'absolute pin-y z-20 overflow-hidden flex items-center',
        $style.arrowWrapper,
        $style['arrow-location-' + resizerArrowPosition],
        {
          [$style.expandedTransform]: arrowVisible && sidebarState === 'expanded'
        }
      ]"
    >
      <div
        :class="[
          'w-8 h-12 leading-loose cursor-pointer flex items-center justify-center',
          $style.arrow,
          $style['arrow-' + resizerArrowPosition],
          { [$style.arrowVisible]: arrowVisible },
          { ['visible opacity-100']: arrowVisible },
          { [$style.arrowInvisible]: !arrowVisible }

        ]"
        @click="resizeSidebar"
      >
        <AppIcon :icon="'chevron-' + resizerArrowPosition"/>
      </div>
    </div>
  </div>
</template>

<script>
import { interfaceGetters, interfaceActions } from '@state/helpers'
import GlobalEvents from 'vue-global-events'

export default {
  components: { GlobalEvents },
  props: {
    arrowVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      resizeData: null
    }
  },
  computed: {
    ...interfaceGetters,
    resizerArrowPosition() {
      // decide left or right arrow based on state of sdebar
      return this.sidebarState === 'expanded' ? 'left' : 'right'
    },
    sidebarState() {
      if (this.screenResolution)
        return this.sidebarWidth === this.screenResolution.width * 0.3
          ? 'expanded'
          : 'normal'
    }
  },
  beforeDestroy() {
    this.endResize()
  },
  methods: {
    ...interfaceActions,
    startResize(event) {
      this.resizeData = {
        startingX: event.clientX,
        startingWidth: this.sidebarWidth
      }
      window.addEventListener('mousemove', this.onResize)
      window.addEventListener('mouseup', this.endResize)
    },
    onResize(event) {
      this.updateSidebarWidth({
        width:
          this.resizeData.startingWidth -
          (this.resizeData.startingX - event.clientX),
        animate: false
      })
    },
    endResize() {
      window.removeEventListener('mousemove', this.onResize)
      window.removeEventListener('mouseup', this.endResize)
    },
    resizeSidebar() {
      this.toggleSidebarExpanded()
    }
  }
}
</script>

<style lang="scss" module>
@import '~@branding';

.resize-area {
  left: calc(100% - 0.5 * #{$sidebar-resizer-width});
  width: $sidebar-resizer-width;
  cursor: ew-resize;
}

.arrow-wrapper {
  pointer-events: none;
  transition: all $sidebar-arrow-transition-duration ease;

  &.arrow-location-right {
    left: 0.5 * $sidebar-resizer-width;
  }

  &.arrow-location-left {
    left: calc(-3 * #{$grid-padding} - 0.5 * #{$sidebar-resizer-width});
  }
}

.arrow {
  border: $app-border;

  &.arrow-left {
    margin-left: calc(
      -0.5 * #{$grid-padding} + 1.5 * #{$sidebar-resizer-width}
    );
    background: var(--app-bg);
    border-right-color: transparent;
    border-radius: 100% 0 0 100%;
  }

  &.arrow-right {
    background: var(--sidebar-bg);
    border-left-color: transparent;
    border-radius: 0 100% 100% 0;
  }

  &.arrow-visible {
    pointer-events: all;
    transition: 0;
  }

  &.arrow-invisible {
    visibility: config('invisible');
    opacity: config('opacity.0');
    transition: opacity $sidebar-arrow-transition-duration ease;
  }
}
</style>
