<template lang="html">
  <div class="absolute overflow-hidden pin">
    <div
      :class="$style.progressBarIndicator"
      class="absolute pin-b pin-l w-full h-px"
    />
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss" module>
@import '~@branding';

.progress-bar-indicator {
  background: var(--progress-bar-color);
  animation-name: progressBarKeyframes;
  animation-duration: 1.4s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  animation-fill-mode: both;
}

@keyframes progressBarKeyframes {
  0% {
    transform: translateX(-100%);
  }

  100% {
    transform: translateX(100%);
  }
}
</style>
