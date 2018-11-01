<template>
  <div
    :class="[
      'flex p-2 my-1 whitespace-no-wrap',
      {'cursor-not-allowed':disabled},
      {'cursor-pointer':!disabled}
    ]"
  >
    <div
      v-tooltip.bottom="helpText"
      class="flex"
      @click="toggle"
    >
      <div
        :class="[
          'flex text-center self-center rounded h-4 w-4 mr-2 no-outline',
          {'bg-primary':checked},
          {'bg-grey-darkest':!checked},
          {'bg-grey-lightest':disabled}
        ]"
        tabindex="0"
        @keyup.space.enter="toggle"
      >
        <AppIcon
          v-show="checked"
          class="text-black text-xs w-full"
          icon="check"
        />
      </div>
      <div
        :class="
          [
            'self-center',
            {'opacity-50':disabled}
        ]"
      >
        {{ label }}
      </div>
    </div>
    <AppLink
      v-if="helpUrl"
      :href="helpUrl"
      class="ml-4"
    >
      Learn More...
    </AppLink>
  </div>
</template>

<script>
export default {
  model: {
    prop: 'checked',
    event: 'change'
  },
  props: {
    checked: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    helpText: {
      type: String,
      default: ''
    },
    helpUrl: {
      type: String,
      default: ''
    }
  },
  methods: {
    toggle() {
      if (!this.disabled) {
        this.$emit('change', !this.checked)
      }
    }
  }
}
</script>
