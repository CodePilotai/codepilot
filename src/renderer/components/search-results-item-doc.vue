<template>
  <SearchResultsItem
    v-bind="boundSublistData"
    v-on="$listeners"
  >
    <AppIconFile
      slot="icon"
      class="text-lg"
      icon-class="markdown-icon"
    />
    <template slot="title">
      {{ result.title }}
    </template>
    <AppEmbeddedHtml
      slot="content"
      :html="htmlBody"
      :url="result.url"
      class="px-3"
    />
  </SearchResultsItem>
</template>

<script>
import SearchResultsItem from './search-results-item'
import { searchGetters } from '@state/helpers'
import markdownRenderer from '@helpers/markdown-renderer'

export default {
  components: {
    SearchResultsItem
  },
  props: {
    result: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...searchGetters,
    boundSublistData() {
      return { ...this.$props, ...this.$attrs }
    },
    htmlBody() {
      const body = markdownRenderer.render(this.result.body.substring(0, 200))
      const lines = body.split(/\n/)
      return lines.slice(0, 4).join('\n')
    }
  }
}
</script>
