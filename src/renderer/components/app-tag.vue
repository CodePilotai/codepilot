<template>
  <div
    :class="$style.tag"
    :style="tagStyles"
    class="inline-block py-0 px-2 m-1 text-xs font-semibold text-grey-text lowercase whitespace-no-wrap vertical-middle rounded"
  >
    <slot/>
  </div>
</template>

<script>
export default {
  props: {
    color: {
      type: String,
      default: 'var(--button-selected-bg)'
    }
  },
  computed: {
    tagStyles() {
      if (this.color.includes('var(')) {
        return {
          'background-color': this.color,
          color: '#fff'
        }
      } else {
        return {
          'background-color': `#${this.color}`,
          color: this.getLabelColor(this.color)
        }
      }
    }
  },
  methods: {
    getLabelColor(hex) {
      // 8947848 is #888888 in decimal
      return parseInt(hex, 16) > 8947848 ? '#000' : '#fff'
    }
  }
}
</script>

<style lang="scss" module>
@import '~@branding';

.tag {
  background: var(--tag-background);
}
</style>
