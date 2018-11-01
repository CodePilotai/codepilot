<template>
  <SearchResultsItem
    v-bind="boundSublistData"
    v-on="$listeners"
  >
    <AppIcon
      slot="icon"
      class="w-6 m-0 text-2xl"
      icon="stack-overflow"
    />
    <template slot="title">
      {{ result.title }}
    </template>
    <div slot="meta">
      <AppTag
        v-for="(tag, index) of result.tags"
        :key="tag + index"
      >
        {{ tag }}
      </AppTag>
      <div class="flex mt-1"/>
    </div>

  </SearchResultsItem>
</template>

<script>
import SearchResultsItem from './search-results-item'
import formatDate from '@helpers/format-date'
import formatRelativeDate from '@helpers/format-relative-date'
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
    boundSublistData() {
      return { ...this.$props, ...this.$attrs }
    },
    htmlBody() {
      const body = markdownRenderer.render(
        this.result.formattedBody.substring(0, 200)
      )
      const lines = body.split(/\n/)
      return lines.slice(0, 4).join('\n')
    },
    lastUpdatedDate() {
      return this.result.last_activity_date
    }
  },
  methods: {
    formatDate,
    formatRelativeDate
  }
}
</script>
