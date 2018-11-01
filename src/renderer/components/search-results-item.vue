<template>
  <div
    :data-ref="resultRef"
    :class="[
      'cursor-pointer rounded',
      $style.item,
      { [$style.itemSelected]: itemIsSelected }
    ]"
    :style="{
      maxWidth: widthOfSidebar
    }"
    class="p-3 mx-4 my-2 overflow-hidden bg-grey-darker border"
    @click="selectItem"
    @contextmenu.prevent="$emit('contextmenu', result)"
  >
    <div class="flex items-center justify-between mb-2 h-auto text-lg" >
      <slot name="icon"/>
      <div
        :class="$style.itemTitle"
        class="w-full py-0 px-2 leading-normal align-middle"
      >
        <slot name="title"/>
      </div>
      <AppPinButton :result="result"/>
    </div>
    <div :class="metaClasses">
      <slot name="meta"/>
    </div>
    <div
      :class="[
        'mt-2 -mx-4 -mb-2',
        $style.itemContent,
        $style.itemContentExpanded
      ]"
    >
      <slot name="content"/>
    </div>
  </div>
</template>

<script>
import resultBranchRef from '@helpers/result-branch-ref'
import { searchGetters, interfaceGetters, searchActions } from '@state/helpers'
import branding from '@branding'

export default {
  props: {
    result: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...searchGetters,
    ...interfaceGetters,
    itemIsSelected() {
      return (
        this.selectedBranch &&
        this.selectedBranch.key &&
        this.selectedBranch.key.includes(this.result.key)
      )
    },
    boundSublistData() {
      return { ...this.$props, ...this.$attrs }
    },
    isPinned() {
      return this.searchPins.some(pin => pin.key === this.result.key)
    },
    intent() {
      return this.selectedSearchIntentKey
    },
    resultRef() {
      return resultBranchRef(this.result, this.result.branches[0])
    },
    widthOfSidebar() {
      return this.sidebarWidth - 2 * parseInt(branding._gridPadding) + 'px'
    },
    hasMeta() {
      return !!this.$scopedSlots.meta
    },
    metaClasses() {
      if (this.hasMeta) {
        return ['flex', 'm-0', 'mt-2']
      }
    }
  },
  methods: {
    ...searchActions,
    selectItem() {
      this.$emit('select', {
        result: this.result,
        branch: this.result.branches[0]
      })
    }
  }
}
</script>

<style lang="scss" module>
@import '~@branding';

.item {
  transition: $fade-transition;
}

.item-selected {
  border-color: var(--input-focus-border-color);
  box-shadow: config('shadows.default');
}

.item-title {
  color: $app-prominent-text-color;
}

.item-content {
  max-height: 0;
  overflow: hidden;
  word-wrap: break-word;

  h1 {
    font-size: config('textSizes.xl');
  }

  h2,
  h3 {
    margin-top: 0;
    font-size: config('textSizes.lg');
  }

  img {
    max-height: 5rem;
  }
}

.item-content-expanded {
  max-height: 70rem;
}
</style>
