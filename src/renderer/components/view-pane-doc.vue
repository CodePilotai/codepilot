<template>
  <div
    class="flex flex-col h-full"
    @contextmenu.prevent="$emit('contextmenu', $event)"
  >
    <ViewPaneInfo/>
    <AppFinder>
      <div class="p-6">
        <AppEmbeddedHtml
          :html="body"
          :url="doc.url"
        />
      </div>
    </AppFinder>
  </div>
</template>

<script>
import { editorActions } from '@state/helpers'
import ViewPaneInfo from './view-pane-info'
import MarkdownIt from 'markdown-it'

const md = new MarkdownIt()

export default {
  components: {
    ViewPaneInfo
  },
  props: {
    doc: {
      type: Object,
      required: true
    }
  },
  computed: {
    body() {
      return md.render(this.doc.body)
    }
  },
  methods: {
    ...editorActions
  }
}
</script>
