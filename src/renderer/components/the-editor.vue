<template>
  <MonacoEditor
    ref="editor"
    key="editor"
    :theme="editorTheme"
    :value="value"
    :language="language"
    :class="$style.editor"
    :options="monacoOptions"
    @change="$emit('change', $event)"
    @mouseUp="setSelectedText"
  />
</template>

<script>
import electron, { clipboard } from 'electron'
import MonacoEditor from 'vue-monaco'
import {
  interfaceGetters,
  osIntegrationGetters,
  editorGetters,
  editorActions,
  searchActions,
  searchGetters
} from '@state/helpers'

export default {
  components: {
    MonacoEditor
  },
  props: {
    value: {
      type: String,
      default: ''
    },
    language: {
      type: String,
      default: 'js'
    }
  },
  data() {
    return {
      amdRequire: window.__amdRequire,
      themesConfigured: false,
      selectedText: ''
    }
  },
  computed: {
    ...interfaceGetters,
    ...editorGetters,
    ...osIntegrationGetters,
    ...searchGetters,
    // https://microsoft.github.io/monaco-editor/api/interfaces/monaco.editor.ieditorconstructionoptions.html
    monacoOptions() {
      let options = {}

      // ===
      // Layout
      // ===

      // Might have a severe performance impact
      options.automaticLayout = true
      // Word wrap should make it easier to scan code as you arrow down through results
      options.wordWrap = this.editorIsWordWrap
      // Don't create space for large line numbers until we need it
      options.lineNumbersMinChars = 1
      // Leave space to create line highlights
      options.lineDecorationsWidth = parseFloat(this.$style._gridPadding) * 2
      // Remove the possibility to cmd+click links in code
      // It resulted in an error and opening a new empty window
      options.links = false
      // ===
      // Typography
      // ===
      // Had to disable this rule, as in this case it’s not a side-effect
      // this.codeFontSize and this.codeFontFamily are primitives
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      options.fontFamily = this.interfaceVariables['--code-font-family']
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      options.fontSize = this.codeFontSize
      options.lineHeight =
        options.fontSize * parseFloat(this.$style._baseLineHeight)
      options.minimap = { enabled: this.minimapIsEnabled }

      return options
    },
    editorTheme() {
      return this.themesConfigured ? this.currentThemeKey : 'vs-dark'
    }
  },
  beforeCreate() {
    // workaround monaco-css not understanding the environment
    self.module = undefined
    // workaround monaco-typescript not understanding the environment
    self.process.browser = true
  },
  created() {
    window.addEventListener('copy', this.codePilotCopy)
    window.addEventListener('cut', this.codePilotCopy)
  },
  mounted() {
    this.getMonaco()
  },
  beforeDestroy() {
    window.removeEventListener('copy', this.codePilotCopy)
    window.removeEventListener('cut', this.codePilotCopy)
  },
  methods: {
    ...editorActions,
    ...searchActions,
    defineThemes() {
      let theme = require('@themes/atom-dark')
      window.monaco.editor.defineTheme('atom-dark', {
        base: 'vs-dark',
        inherit: true,
        rules: [{ background: theme['app-bg'].substring(1) }],
        colors: {
          'editor.background': theme['app-bg'],
          'editor.selectionHighlightBackground': theme['syntax-highlighted-bg']
        }
      })

      theme = require('@themes/atom-light')
      window.monaco.editor.defineTheme('atom-light', {
        base: 'vs',
        inherit: true,
        rules: [{ background: theme['app-bg'].substring(1) }],
        colors: {
          'editor.background': theme['app-bg'],
          'editor.selectionHighlightBackground': theme['syntax-highlighted-bg']
        }
      })
      this.themesConfigured = true
    },
    codePilotCopy(event) {
      let license

      // Abort if the user has not enabled commenting copied code
      if (!this.commentCodeOnCopy) return true

      // Abort if there's no selected result
      if (!this.editorFocused) return true

      // Get the selected text
      const selectedText = window.getSelection().toString()

      // Abort if no text was selected
      if (!selectedText) return true

      event.preventDefault()

      // Do not annotate comments in json code
      if (this.language === 'json') return true

      if (this.selectedResult.context) {
        if (this.selectedResult.context.repo) {
          license = this.selectedResult.context.repo.license
        }
      }

      const [startTag, endTag] = getCommentType(this.selectedResult)
      const decoratedText = addCodePilotComments({
        file: this.selectedResult,
        text: selectedText,
        license: license,
        startTag,
        endTag
      })

      // HACK: Needed to ensure we write to the clipboard after Monaco
      setTimeout(() => {
        clipboard.writeText(decoratedText)
      }, 1)
    },
    getMonaco() {
      const monacoEditor = this.$refs.editor.getMonaco()
      if (monacoEditor) {
        this.updateEditor({
          editor: monacoEditor,
          classes: {
            lineDecorationClass: 'line-decoration',
            lineHighlightClass: 'line-highlight',
            inlineHighlightClass: 'inline-highlight'
          }
        })

        monacoEditor.addAction({
          id: 'search',
          label: 'Search Selected Text',
          keybindings: [
            window.monaco.KeyMod.CtrlCmd | window.monaco.KeyCode.KEY_P
          ],
          contextMenuGroupId: '0_navigation',
          contextMenuOrder: 0.3,
          run: () => this.runSearchOnSelectedText()
        })

        this.defineThemes()
      } else {
        setTimeout(this.getMonaco, 50)
      }
    },
    setSelectedText() {
      const monacoEditor = this.$refs.editor.getMonaco()
      this.selectedText = monacoEditor
        .getModel()
        .getValueInRange(monacoEditor.getSelection())
    },
    runSearchOnSelectedText() {
      if (this.selectedText && this.selectedText !== this.query.text) {
        this.updateQuery({ text: this.selectedText })
        this.runSearch()
      }
    }
  }
}

const languageCommentHash = {
  markdown: ['<!--', '-->'],
  html: ['<!--', '-->'],
  javascript: ['//'],
  css: ['/*', '*/'],
  coffeescript: ['#'],
  livescript: ['#'],
  ruby: ['#'],
  python: ['#'],
  'objective-c': ['//'],
  php: ['//'],
  shell: ['#']
}
const defaultComments = ['/*', '*/']

function getCommentType(selectedResult) {
  return languageCommentHash[selectedResult.language.name] || defaultComments
}

function addCodePilotComments({ file, license, text, startTag, endTag }) {
  let trimmedText = text.trim()
  let licenseComment = license
    ? `License: ${license}`
    : `No license available...`

  // Just return the text if the selection is not multi-line
  if (trimmedText.split('\n').length === 1) {
    return text
  }

  const appName = electron.remote.app.getName()
  return [
    commentLine(
      `Source: ${file.relativePath} via ${file.source} from ${appName}`
    ),
    commentLine(licenseComment),
    trimmedText,
    commentLine(`End of code from ${appName}`)
  ].join('\n')

  function commentLine(lineText) {
    let newLineText = `${startTag} ${lineText}`
    if (endTag) {
      newLineText += ` ${endTag}`
    }
    return newLineText
  }
}
</script>

<style lang="scss" module>
@import '~@branding';

.editor {
  width: 100%;
  height: 100%;

  :global {
    // hide linting squiggly line
    .redsquiggly {
      display: none;
    }

    // stylelint-disable-next-line selector-class-pattern
    .overflowingContentWidgets {
      position: absolute;
      top: 0;
    }

    .selected-text {
      color: $app-text-color !important;
      background-color: var(--selectable-selected-bg) !important;
    }

    $line-decoration-width: $grid-padding / 4;

    .line-decoration {
      width: $line-decoration-width !important;
      margin-left: ($grid-padding + $line-decoration-width) / 2;
      background: var(--selectable-selected-bg);
    }

    .line-highlight {
      // If we want to permanently highlight a whole line
    }

    .inline-highlight {
      // If we want to make a permanent inline highlight
    }

    .margin-view-overlays,
    .monaco-editor-background {
      background: var(--app-bg);
    }
  }
}
</style>
