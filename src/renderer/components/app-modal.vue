<template>
  <div
    :class="$style.modalBackdrop"
    class="fixed pin flex flex-col justify-center text-center z-40"
  >
    <GlobalEvents @keyup.esc="$emit('close')"/>
    <div
      :class="$style.modal"
      class="inline-block my-0 mx-auto p-4 text-left rounded w-4/5 max-w-md z-50 shadow-md"
    >
      <div class="flex justify-between">
        <h2 class="mb-0 leading-loose"> {{ title }}</h2>
        <AppButton
          v-tooltip.bottom="'Press \'esc\' to close'"
          icon="times"
          @click="$emit('close')"
        />
      </div>
      <hr>
      <slot/>
    </div>
  </div>
</template>

<script>
import GlobalEvents from 'vue-global-events'

export default {
  components: { GlobalEvents },
  props: {
    title: {
      type: String,
      required: true
    }
  }
}
</script>

<style lang="scss" module>
@import '~@branding';

$modal-min-width: 300px;

.modal-backdrop {
  &::before {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: config('zIndex.0');
    content: '';
    background: var(--app-bg);
    opacity: config('opacity.75');
  }
}

.modal {
  min-width: $modal-min-width;
  background: $sidebar-bg;
}
</style>
