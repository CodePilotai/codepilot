<template>
  <SearchResultsItem
    v-bind="boundSublistData"
    v-on="$listeners"
  >
    <AppIcon
      slot="icon"
      icon="git-pull-request"
      source="octicon"
      class="mr-1 text-2xl"
    />
    <template slot="title">
      {{ result.title }}
      <AppTag
        v-for="label of result.labels"
        :key="label.id"
        :color="label.color"
      >
        {{ label.name }}
      </AppTag>
    </template>
    <div slot="meta">
      <div class="flex flex-no-shrink items-center h-6 mt-1 mr-3 mb-0 ml-0 font-semibold leading-normal">
        <AppIcon
          icon="github"
          class="mr-1 text-base"
        />
        {{ `${result.repoOwner}/${result.repoName}` }}
      </div>
      <div class="flex">
        <div
          v-tooltip.left="'Pull request was created ' + formatRelativeDate(result.updatedAt)"
          v-if="result.updatedAt"
          class="flex flex-no-shrink items-center h-6 mt-1 mr-3 mb-0 ml-0 font-semibold leading-normal"
        >
          <AppIcon
            icon="clock-o"
            class="mr-1 text-base"
          />
          {{ formatDate(result.updatedAt) }}
        </div>
        <div class="flex flex-no-shrink items-center h-6 mt-1 mr-3 mb-0 ml-0 font-semibold leading-normal" >
          <AppIcon
            icon="comments"
            class="mr-1 text-base"
          />
          {{ result.comments.length }}
        </div>
      </div>
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
      const body = markdownRenderer.render(this.result.body.substring(0, 200))
      const lines = body.split(/\n/)
      return lines.slice(0, 4).join('\n')
    }
  },
  methods: {
    formatDate,
    formatRelativeDate
  }
}
</script>
