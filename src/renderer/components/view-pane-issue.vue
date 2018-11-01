<template>
  <div
    class="overflow-hidden"
    @contextmenu.prevent="$emit('contextmenu', $event)"
  >
    <ViewPaneInfo/>
    <AppFinder>
      <div class="p-6">
        <h1>Issue: {{ issue.title }}</h1>
        <AppEmbeddedHtml
          :html="htmlBody"
          :url="issue.url"
        />
        <div
          v-for="comment of issue.comments"
          :key="comment.id"
        >
          <hr>
          <h1> Comment: {{ comment.author }} </h1>
          <AppEmbeddedHtml
            :html="renderBody(comment.body)"
            :url="issue.url"
          />
        </div>
      </div>
    </AppFinder>
  </div>
</template>

<script>
import ViewPaneInfo from './view-pane-info'
import markdownRenderer from '@helpers/markdown-renderer'

export default {
  components: {
    ViewPaneInfo
  },
  props: {
    issue: {
      type: Object,
      required: true
    }
  },
  computed: {
    htmlBody() {
      return markdownRenderer.render(this.issue.body)
    }
  },
  methods: {
    renderBody(body) {
      return markdownRenderer.render(body)
    }
  }
}
</script>
