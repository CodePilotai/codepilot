<template>
  <div class="flex justify-between self-center items-center h-10">
    <div
      v-tooltip.bottom="'Click to open this repo in your browser'"
      class="flex my-0 mx-1 overflow-hidden "
    >
      <AppIcon
        source="octicon"
        icon="repo"
        class="mr-1"
      />
      <AppLink
        :href="file.repo"
        class="truncate"
      >
        {{ file.name }}
      </AppLink>
    </div>

    <div class="flex my-0 mx-2">
      <AppIcon
        icon="file"
        class="mr-1"
      />
      <AppLink
        v-tooltip.bottom="'Click to open this file in your browser'"
        :href="file.url"
      >
        {{ file.filename }}
      </AppLink>
    </div>

    <!-- Temporary empty div to allow desired layout, this can be replaced with additional info later -->
    <div/>
  </div>
</template>

<script>
export default {
  props: {
    selectedResult: {
      type: Object,
      required: true
    }
  },
  computed: {
    file() {
      return this.selectedResult
    }
  }
}
</script>
