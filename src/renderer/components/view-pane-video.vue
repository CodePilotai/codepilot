<template>
  <div>
    <ViewPaneInfo/>
    <div class="flex flex-col justify-center h-full overflow-hidden">
      <webview
        :src="`https://www.youtube.com/embed/${video.id}?autoplay=0&origin=http://example.com`"
        class="self-center border-0 w-3/4 h-4/5 mt-4"
        @new-window="openExternalWindow({ url : $event.url })"
      />
      <p class="p-8">{{ video.description }}</p>
    </div>
  </div>
</template>

<script>
import { searchGetters, editorActions } from '@state/helpers'
import ViewPaneInfo from './view-pane-info'
import { shell } from 'electron'

export default {
  components: {
    ViewPaneInfo
  },
  props: {
    video: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...searchGetters
  },
  methods: {
    ...editorActions,
    openExternalWindow({ url }) {
      shell.openExternal(url)
    }
  }
}
</script>
