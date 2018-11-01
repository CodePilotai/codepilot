<template>
  <div class="bg-grey-lighter rounded-b lg:rounded-b-none lg:rounded-r p-3 flex flex-col justify-between leading-normal mb-2">
    <div class="flex justify-between mb-0">
      <div class="flex items-center">
        <slot name="icon"/>
        <h3 class="m-0 flex items-center">{{ label }}</h3>
      </div>
      <div class="flex items-center">
        <!-- METADATA -->
        <slot
          class="p-2"
          name="metadata"/>
        <slot
          class="ml-1"
          name="action-buttons"/>
      </div>
    </div>
    <p class="mb-1 text-xs text-blue-light whitespace-no-wrap truncate mr-8">{{ url }}</p>
    <p class="mb-0">
      {{ description }}
    </p>
  </div>
</template>
<script>
export default {
  props: {
    label: {
      type: String,
      default: ''
    },
    url: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    }
  }
}
</script>
