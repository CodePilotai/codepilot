<template>
  <button
    class="bg-grey-lighter text-white rounded w-full text-left p-2 items-center no-outline"
    v-on="$listeners"
  >
    <div class="flex">
      <AppIcon
        :icon="icon"
        class="text-3xl w-12 flex self-center justify-center"
      />
      <div>
        <div>{{ title }}</div>
        <div class="opacity-75">
          {{ description }}
          <slot/>
        </div>
      </div>
    </div>
  </button>
</template>

<script>
export default {
  inheritAttrs: false,
  props: {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      required: true
    }
  }
}
</script>
