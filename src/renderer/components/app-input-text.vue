<template>
  <div>
    <AppInputTextLabel
      v-if="label"
      :for="inputId"
      :minimized="!!(isFocused || value || forceLabelMinimized)"
    >
      {{ label }}
    </AppInputTextLabel>
    <div class="flex flex-no-shrink flex-grow mb-0">
      <div
        :class="focusedClasses"
        class="appearance-none flex w-full bg-grey-darker text-grey-text border rounded"
      >
        <slot name="prefix"/>
        <input
          ref="input"
          v-bind="$attrs"
          :value="inputValue"
          :id="inputId"
          :type="type"
          :class="$style.input"
          class="appearance-none block font-mono w-full bg-grey-darker text-grey-text py-3 px-4 rounded"
          v-on="listeners"
        >
        <slot name="postfix"/>
      </div>
    </div>
  </div>
</template>

<script>
import AppIcon from './app-icon'
import cuid from 'cuid'
export default {
  components: {
    AppIcon
  },
  inheritAttrs: false,
  props: {
    value: {
      type: [String, Number],
      default: ''
    },
    label: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'text'
    },
    id: {
      type: String,
      default: ''
    },
    forceLabelMinimized: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      inputId: this.id ? this.id : cuid(),
      isFocused: false,
      inputValue: this.value
    }
  },
  computed: {
    focusedClasses() {
      if (this.isFocused) {
        return [
          'border-primary',
          'bg-grey-lighter',
          'shadow',
          this.$style.focused
        ]
      } else {
        return ['border-grey-darkest']
      }
    },
    listeners() {
      const handleEvent = (eventName, callback, manualEmit = false) => {
        return event => {
          // Prevent input events from triggering global keyboard shortcuts.
          event.stopPropagation()
          // If we don't manually handle emitting the event in the callback,
          // emit the component event now.
          if (!manualEmit) {
            this.$emit(eventName, event)
          }
          // Run the custom callback, if one is defined (e.g. if we want
          // fine-grained control over how the event is emitted or we
          // want to define a coexisting, internal handler for an event).
          if (callback) {
            callback(event)
          }
        }
      }
      return {
        ...this.$listeners,
        input: handleEvent(
          'input',
          event => {
            const newValue = event.target.value.trim()
            if (newValue !== this.value.toString().trim()) {
              this.$emit('input', newValue)
            }
          },
          true
        ),
        keypress: handleEvent('keypress'),
        keyup: handleEvent('keyup'),
        keydown: handleEvent('keydown'),
        focus: handleEvent('focus', () => {
          // eslint-disable-next-line vue/no-side-effects-in-computed-properties
          this.isFocused = true
        }),
        blur: handleEvent('blur', () => {
          // eslint-disable-next-line vue/no-side-effects-in-computed-properties
          this.isFocused = false
        }),
        change: handleEvent(
          'change',
          event => {
            this.$emit('change', event.target.value.trim())
          },
          true
        )
      }
    }
  },
  watch: {
    value(newValue) {
      if (newValue !== this.inputValue.toString().trim()) {
        this.inputValue = newValue
      }
    }
  }
}
</script>

<style lang="scss" module>
@import '~@branding';

.input-controls-wrapper {
  transition: $fade-transition;
}

.focused {
  border-color: var(--primary-color);
  outline: none;
}

.input {
  &::-webkit-input-placeholder {
    color: $app-text-color;
    opacity: config('opacity.75');
  }

  &:focus {
    outline: none;
  }

  &[disabled] {
    color: $app-disabled-text-color;
    cursor: not-allowed;
    opacity: config('opacity.50');
  }
}
</style>
