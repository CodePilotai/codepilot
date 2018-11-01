<template>
  <div class="w-full h-full overflow-hidden">
    <ViewPaneInfo
      v-if="isMounted"
      :webview="$refs.webview"
      :controls="controls"
      :url="url"
      :process-pin="includeUrlAsKey"
      @navigate="navigate"
    />
    <div
      v-if="showFinder"
      :class="$style.webviewFinderContainer"
      class="absolute p-1 pin-r"
    >
      <div class="flex items-center p-1">
        <AppInputText
          ref="finderInput"
          v-model="searchTerm"
          class="m-1"
          type="text"
          placeholder="Find"
        />
        <AppIcon
          class="py-0 px-1 cursor-pointer"
          icon="close"
          @click="closeFinder"
        />
      </div>
    </div>
    <div
      :class="$style.webviewContainer"
      class="h-full"
    >
      <webview
        ref="webview"
        :src="website.url"
        class="h-full"
        @did-navigate-in-page="updateUrl({ url: $event.url, inPage: true })"
        @will-navigate="updateUrl({ url: $event.url, inPage: true })"
        @new-window="updateUrl({ url: $event.url })"
        @dom-ready="setMocks"
        @did-finish-load="setPersonalizationSettings"
      />
    </div>
  </div>
</template>

<script>
import { ipcRenderer as ipc } from 'electron'
import ViewPaneInfo from './view-pane-info'
import {
  interfaceGetters,
  userProfileGetters,
  searchGetters
} from '@state/helpers'

export default {
  components: {
    ViewPaneInfo
  },
  props: {
    website: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isMounted: false,
      url: '',
      history: [],
      historyPointer: 0,
      showFinder: false,
      isWebviewReady: false,
      searchTerm: '',
      devdocsAdjusted: false
    }
  },
  computed: {
    ...interfaceGetters,
    ...userProfileGetters,
    ...searchGetters,
    controls() {
      return {
        canGoBack: this.historyPointer > 0,
        canGoForward: this.history.length > this.historyPointer + 1
      }
    }
  },
  watch: {
    showFinder() {
      if (!this.isWebviewReady) return
      if (!this.showFinder) {
        this.searchTerm = ''
        this.$refs.webview.stopFindInPage('clearSelection')
      }
    },
    searchTerm() {
      if (!this.isWebviewReady) return
      if (!this.searchTerm.length) {
        this.$refs.webview.stopFindInPage('clearSelection')
      } else {
        this.$refs.webview.findInPage(this.searchTerm)
      }
    },
    'website.url': {
      immediate: true,
      handler() {
        this.url = this.website.url
      }
    }
  },
  created() {
    ipc.on('showFinder', this.showFinderHandler)
  },
  mounted() {
    this.history.push(this.url)
    this.isMounted = true
  },
  beforeDestroy() {
    ipc.removeListener('showFinder', this.showFinderHandler)
  },
  methods: {
    setPersonalizationSettings() {
      if (!this.website.url.includes('devdocs.io') || this.devdocsAdjusted)
        return

      this.devdocsAdjusted = true

      const docs = this.selectedProfileDocs.map(doc => doc.replace('@', '~'))
      const docsCompareString = docs.join('/')
      const docsString = `["${docs.join('", "')}"]`

      if (this.currentThemeKey === 'atom-dark') {
        this.$refs.webview.executeJavaScript(`
          if (!window.app.settings.get('dark')) {
            window.app.settings.set('dark', 1)
            window.location = 'https://devdocs.io/?q=${this.query.text}'
          }
        `)
      } else {
        this.$refs.webview.executeJavaScript(`
          if (window.app.settings.get('dark')) {
            window.app.settings.del('dark')
            window.location = 'https://devdocs.io/?q=${this.query.text}'
          }
        `)
      }

      this.$refs.webview.executeJavaScript(`
        const existingDocs = window.app.settings.getDocs()
        const requiredDocs = '${docsCompareString}'.split('/')

        const hasAllDocs = requiredDocs.every(doc => existingDocs.includes(doc))

        if (!hasAllDocs) {
          window.app.settings.setDocs(${docsString})
          window.location = 'https://devdocs.io/?q=${this.query.text}'
        }
      `)
    },
    setMocks() {
      this.$refs.webview.executeJavaScript('window.onbeforeunload = null;')
      this.isWebviewReady = true
    },
    showFinderHandler() {
      this.showFinder = true
      this.focusFinderInput()
    },
    navigate(url) {
      switch (url) {
        case 'goBack':
          if (this.historyPointer > 0) {
            this.historyPointer--
            console.warn('target: ', this.history[this.historyPointer])
            this.$refs.webview.goBack()
            this.updateUrl({
              url: this.history[this.historyPointer],
              fromHistory: true
            })
          }
          break
        case 'goForward':
          if (this.historyPointer < this.history.length) {
            this.historyPointer++
            this.$refs.webview.goForward()
            this.updateUrl({
              url: this.history[this.historyPointer],
              fromHistory: true
            })
          }
          break
        default:
          this.historyPointer++
          this.updateUrl({ url })
      }
    },
    updateUrl({ url, inPage, fromHistory }) {
      if (this.url === url) return
      this.url = url
      if (fromHistory) return

      // Override history if needed
      if (this.historyPointer < this.history.length - 1) {
        this.history = this.history.slice(0, this.historyPointer)
      } else {
        this.historyPointer++
      }

      this.history.push(url)

      if (!inPage) {
        this.$refs.webview.loadURL(url)
      }
    },
    includeUrlAsKey(result) {
      return {
        ...result,
        url: this.url,
        key: this.url,
        name: this.$refs.webview.getTitle()
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
      this.searchTerm = ''
    }
  }
}
</script>

<style lang="scss" module>
@import '~@branding';

.webview-container {
  background: $app-white-color;
}

.webview-finder-container {
  background-color: var(--top-bar-bg);
  box-shadow: $grid-padding / 2 $grid-padding / 2 $grid-padding #888;
}
</style>
