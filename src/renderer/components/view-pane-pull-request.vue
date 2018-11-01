<template>
  <div
    class="overflow-hidden"
    @contextmenu.prevent="$emit('contextmenu', $event)"
  >
    <ViewPaneInfo/>
    <AppFinder>
      <div class="p-6">
        <h1>Pull Request: {{ pr.title }}</h1>
        <AppEmbeddedHtml
          :html="htmlBody"
          :url="pr.url"
        />
        <div
          v-for="comment of pr.comments"
          :key="comment.id"
        >
          <hr>
          <h2> Comment: {{ comment.author }} </h2>
          <AppEmbeddedHtml
            :html="renderBody(comment.body)"
            :url="pr.url"
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
    pr: {
      type: Object,
      required: true
    }
  },
  computed: {
    htmlBody() {
      return markdownRenderer.render(this.pr.body)
    }
  },
  methods: {
    renderBody(body) {
      return markdownRenderer.render(body)
    }
  }
}
</script>
