<template>
  <div class="bg-grey-lighter rounded-b lg:rounded-b-none lg:rounded-r p-3 flex flex-col justify-between leading-normal mb-2">
    <div class="flex justify-between mb-2">
      <div class="flex items-center">
        <CustomSourceIcon :url="url"/>
        <h3 class="m-0">{{ label }}</h3>
      </div>
      <div class="flex">
        <!-- METADATA -->
        <div class="p-2">
          <slot name="installs"/>
        </div>
        <div class="ml-1">
          <slot name="action-buttons"/>
        </div>
      </div>
    </div>
    <p class="mb-1 text-xs text-blue-light whitespace-no-wrap truncate mr-8">{{ url }}</p>
    <p class="mb-0">
      {{ description }}
    </p>
  </div>
</template>
<script>
import CustomSourceIcon from './custom-source-icon'
export default {
  components: { CustomSourceIcon },
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
