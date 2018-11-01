<template>
  <div class="relative w-48">
    <slot name="label"/>
    <button
      ref="button"
      :disabled="disabled"
      class="flex flex-none appearance-none w-full bg-grey-darker border border-grey-darkest text-grey-text py-3 px-4 rounded justify-between cursor-pointer focus:border-primary no-outline focus:shadow focus:rounded-b-none mt-1"
      @focus="open"
      @keydown.tab="close"
      @keydown.space.stop="toggle"
      @keydown.esc="close"
    >
      <slot
        name="selected"
      >
        <span
          v-tooltip.bottom="getLabel(selectedOption)"
          v-if="getLabel(selectedOption) !== getTruncatedLabel(selectedOption)"
        >
          {{ getTruncatedLabel(selectedOption) }}
        </span>
        <span v-else>
          {{ getLabel(selectedOption) }}
        </span>
      </slot>
      <div class="inline-block w-3"/>
      <div class="text-xs vertical-middle h-3" >
        <AppIcon icon="chevron-down"/>
      </div>
    </button>
    <ul
      v-show="isDropdownOpen"
      ref="dropdown"
      :class="$style.optionContainer"
      class="absolute bg-grey-darker text-grey-text p-0 min-w-full m-0 border border-primary z-50 cursor-pointer shadow-md"
    >
      <li
        v-for="option in options"
        :key="option.key"
        :class="['flex items-center justify-between py-3 px-4 min-h-12 hover:bg-grey truncates']"
        @click.stop.prevent="selectOption(option)"
      >
        <slot
          :option="option"
          name="option"
        >
          <span
            v-tooltip.bottom="getLabel(option)"
            v-if="getLabel(option) !== getTruncatedLabel(option)"
          >
            {{ getTruncatedLabel(option) }}
          </span>
          <span v-else>
            {{ getLabel(option) }}
          </span>
        </slot>
        <AppIcon
          v-show="option.key === selectedOption.key"
          class="text-primary"
          icon="check"
        />
      </li>
      <slot
        :close="close"
        name="action"
      />
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    options: {
      type: Array,
      required: true
    },
    value: {
      type: [String, Object, Array],
      default: null
    },
    allowMultiselect: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isDropdownOpen: false
    }
  },
  computed: {
    selectedOption() {
      return (
        this.options.find(
          option =>
            option.key === this.value ||
            (this.value &&
              typeof this.value === 'object' &&
              option.key === this.value.key)
        ) || this.options[0]
      )
    }
  },
  mounted() {
    window.addEventListener('click', this.closeDropdownIfClickOutside)
  },
  beforeDestroy() {
    window.removeEventListener('click', this.closeDropdownIfClickOutside)
  },
  methods: {
    open() {
      this.$nextTick(() => {
        this.$emit('focus')
        this.isDropdownOpen = true
      })
    },
    close() {
      this.$nextTick(() => {
        this.$emit('blur')
        // Only blur the button if it still exists in the DOM
        this.$refs.button && this.$refs.button.blur()
        this.isDropdownOpen = false
      })
    },
    toggle() {
      if (!this.isDropdownOpen) {
        this.open()
      } else {
        this.close()
      }
    },
    selectOption(option) {
      this.$emit('input', option)
      // to allow for multiselect behavior, only close dropdown
      // when allowMultiselect is false
      if (!this.allowMultiselect && !this.disabled) {
        this.close()
      } else {
        this.close()
      }
    },
    closeDropdownIfClickOutside(event) {
      if (this.isDropdownOpen && !this.$el.contains(event.target)) {
        this.close()
      }
    },
    getLabel: option => option.label || option.key,
    getTruncatedLabel(option) {
      const fullLabel = this.getLabel(option)
      const maxLength = 50
      return fullLabel.length > maxLength
        ? fullLabel.slice(0, 50) + '...'
        : fullLabel
    }
  }
}
</script>

<style lang="scss" module>
@import '~@branding';

.option-container {
  top: 100%;
  max-height: 400px;
}
</style>
