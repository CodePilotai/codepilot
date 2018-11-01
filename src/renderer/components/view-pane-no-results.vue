<template>
  <!--
  Show embedded CodePilot page in the view pane
  when there are no results.
  -->
  <div class="h-full">
    <webview
      v-if="hasInternetConnection"
      :src="sourceURL"
      class="h-full"
    />
  </div>
</template>
<script>
import { internetConnectionGetters, searchGetters } from '@state/helpers'
export default {
  computed: {
    ...internetConnectionGetters,
    ...searchGetters,
    sourceURL() {
      return this.selectedSearchIntentKey === 'docsResults'
        ? `https://devdocs.io/#q=${this.query.text}`
        : 'https://codepilot.ai/what-is-codepilot-ai/?utm_source=codepilot-app'
    }
  }
}
</script>
