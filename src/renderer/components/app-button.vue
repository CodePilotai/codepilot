<template>
  <button
    :class="[
      ['type-' + type],
      {
        ['button-active']: active,
        ['icon']: icon
      }
    ]"
    class="button"
    @click="onClick"
  >
    <div class="flex justify-start leading-none">
      <div
        v-if="icon"
        class="flex flex-col justify-center"
      >
        <AppIcon
          :icon="icon"
          class="my-0 w-4 block text-center leading-none"
        />
      </div>
      <div class="w-full">
        <slot/>
      </div>
    </div>
  </button>
</template>

<script>
export default {
  props: {
    icon: {
      type: String,
      default: ''
    },
    active: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: '',
      // This validation will make Vue display a warning in development
      // if a button is ever passed an invalid type.
      validate(value) {
        return (
          [
            // The main action on the screen, meant to attract attention.
            // There should only ever be one visible at a time.
            'main',
            'confirm',
            'success',
            'danger',
            'bordered'
          ].indexOf(value) !== -1
        )
      }
    }
  },
  methods: {
    onClick(event) {
      this.$emit('click', event)
    }
  }
}
</script>
