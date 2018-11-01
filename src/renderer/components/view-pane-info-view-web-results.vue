<template>
  <div class="flex">
    <AppPinButton
      :result="currentResult"
      :force-show="true"
      class="-ml-2 h-12 p-2 pl-0 justify-center"
    />
    <AppButton
      v-tooltip.bottom="'Go back'"
      :disabled="!controls.canGoBack"
      class="mr-3 mb-0"
      icon="arrow-left"
      @click="$emit('navigate', 'goBack')"
    />
    <AppButton
      v-tooltip.bottom="'Go forward'"
      :disabled="!controls.canGoForward"
      icon="arrow-right"
      class="mr-3"
      @click="$emit('navigate', 'goForward')"
    />
    <AppButton
      v-tooltip:below="'Refresh the page'"
      icon="undo"
      class="mr-3"
      @click="reload"
    />
    <AppInputText
      :value="url"
      class="flex-grow mr-0"
      @keyup.enter="handleUrlChange"
    />
  </div>
</template>

<script>
export default {
  props: {
    selectedResult: {
      type: Object,
      required: true
    },
    webview: {
      type: [HTMLObjectElement, HTMLElement],
      required: true
    },
    controls: {
      type: Object,
      required: true
    },
    url: {
      type: String,
      required: true
    }
  },
  computed: {
    currentResult() {
      return {
        ...this.selectedResult,
        key: this.url,
        url: this.url,
        selectedBranch: {
          ...this.selectedResult.selectedBranch,
          key: this.url,
          url: this.url
        }
      }
    }
  },
  methods: {
    reload() {
      this.webview.reload()
    },
    handleUrlChange(event) {
      if (event.target) {
        this.$emit('navigate', event.target.value)
      }
    }
  }
}
</script>
