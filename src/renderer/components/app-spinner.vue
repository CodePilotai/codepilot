<template>
  <div
    v-show="loading"
    :class="$style.appSpinner"
    class="inline-block"
  >
    <div :class="classes"/>
    <div :class="classes"/>
    <div :class="classes"/>
  </div>
</template>

<script>
// Forked from https://github.com/greyby/vue-spinner/blob/master/src/SyncLoader.vue
export default {
  name: 'AppSpinner',
  props: {
    loading: {
      type: Boolean,
      default: true
    },
    type: {
      type: String,
      default: 'Label'
    },
    size: {
      type: String,
      default: 'small'
    }
  },
  computed: {
    classes() {
      return {
        small: [
          'inline-block w-1 h-1 m-0 rounded-full',
          this.$style.appSpinnerCircle
        ],
        large: [
          'inline-block w-2 h-2 mr-1 rounded-full',
          this.$style.appSpinnerCircle
        ]
      }[this.size]
    }
  }
}
</script>

<style lang="scss" module>
@import '~@branding';
$animation-duration: 0.6s;
$animation-delay: 0.07s;

.app-spinner {
  transform: translateY(-30%);
}

.app-spinner-circle {
  background-color: $spinner-default-color;
  animation-name: appSpinnerKeyframes;
  animation-duration: $animation-duration;
  animation-timing-function: ease-in-out;
  animation-delay: $animation-delay * 2;
  animation-iteration-count: infinite;
  animation-fill-mode: both;

  &:first-child {
    animation-delay: $animation-delay * 1;
  }

  &:last-child {
    animation-delay: $animation-delay * 3;
  }
}

@keyframes appSpinnerKeyframes {
  33% {
    transform: translateY(90%);
  }

  66% {
    transform: translateY(-90%);
  }

  100% {
    transform: translateY(0);
  }
}
</style>
