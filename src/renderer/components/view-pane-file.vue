<template>
  <div class="flex flex-col h-full">
    <ViewPaneInfo/>
    <div
      :class="$style.editorWrapper"
      class="flex-grow h-full pl-3 bg-grey"
    >
      <TheEditor
        v-if="file.text"
        :value="file.text"
        :language="file.language.name"
      />
    </div>
  </div>
</template>

<script>
import get from 'lodash/get'
import { searchGetters, editorActions } from '@state/helpers'
import ViewPaneInfo from './view-pane-info'
import TheEditor from './the-editor'

export default {
  components: {
    TheEditor,
    ViewPaneInfo
  },
  props: {
    file: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...searchGetters,
    selectedFileLine() {
      return get(this, 'file.selectedBranch.file.line')
    }
  },
  watch: {
    'file.text'(newText) {
      if (!newText) return
      this.initEditorFile()
    },
    selectedFileLine(newLine) {
      if (!newLine) return
      this.highlightLineMatch()
    }
  },
  created() {
    this.initEditorFile()
  },
  methods: {
    ...editorActions,
    initEditorFile() {
      this.editorNextTick().then(() => {
        if (this.file.type === 'file') {
          this.highlightLinesWithMatches()
          this.highlightLineMatch()
        }
      })
    },
    highlightLinesWithMatches() {
      this.editorHighlight({
        lines: this.file.branches.map(branch => branch.file.line.number)
      })
    },
    highlightLineMatch() {
      this.editorCenter({
        line: this.selectedFileLine,
        query: this.selectedFileLine.body,
        useRegex: this.query.useRegex
      })
    }
  }
}
</script>

<style lang="scss" module>
@import '~@branding';

.editor-wrapper {
  transition: $fade-transition;
}
</style>
