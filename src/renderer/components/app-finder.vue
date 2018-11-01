<template>
  <div class="relative">
    <div
      v-if="showFinder"
      class="shadow-md absolute flex flex-grow pin-t pin-r justify-between bg-grey p-2 mr-3 z-40"
    >
      <AppInputText
        ref="finderInput"
        v-model="findPageSearch"
        data-e2e="finder-input"
        placeholder="Find"
      />
      <AppIcon
        class="relative self-end pin-r pl-2 self-center"
        icon="close"
        @click="closeFinder"
      />
    </div>
    <div ref="findContent">
      <slot/>
    </div>
  </div>
</template>
<script>
import findAndReplaceDOMText from 'findandreplacedomtext'
import { ipcRenderer as ipc } from 'electron'

export default {
  data() {
    return {
      findPageSearch: '',
      showFinder: false
    }
  },
  watch: {
    findPageSearch(newSearch) {
      this.highlightEmbeddedHtml(newSearch)
    }
  },
  created() {
    ipc.on('showFinder', this.showFinderHandler)
  },
  beforeDestroy() {
    ipc.removeListener('showFinder', this.showFinderHandler)
  },
  methods: {
    showFinderHandler() {
      this.showFinder = true
      this.focusFinderInput()
    },
    highlightEmbeddedHtml(newSearch) {
      const embeddedHtmlWrappers = this.$refs.findContent.querySelectorAll(
        '[class^="app-embedded-html__embedded-html"]'
      )

      for (const wrapper of embeddedHtmlWrappers) {
        const existingHighlights = wrapper.querySelectorAll(
          '.' + this.$style.highlight
        )
        for (const highlight of existingHighlights) {
          highlight.outerHTML = highlight.innerHTML
        }
        if (newSearch.length === 0) {
          continue
        }
        findAndReplaceDOMText(wrapper, {
          find: newSearch,
          wrap: 'span',
          wrapClass: this.$style.highlight
        })
      }
    },
    focusFinderInput() {
      this.$nextTick(() => {
        if (!this.$refs.finderInput) return
        const { input } = this.$refs.finderInput.$refs
        input.focus()
        input.select()
      })
    },
    closeFinder() {
      this.showFinder = false
      this.findPageSearch = ''
    }
  }
}
</script>

<style lang="scss" module>
@import '~@branding';

.highlight {
  color: var(--selectable-color);
  background: var(--selectable-selected-bg);
}
</style>
