import settings from 'electron-settings'
let editor

export default {
  state: {
    focused: false,
    classes: {},
    isWordWrap: settings.get('editor.wordWrap') !== false
  },
  mutations: {
    SET_EDITOR(_, newEditor) {
      editor = newEditor
    },
    SET_FOCUSED(state, newFocused) {
      state.focused = newFocused
    },
    SET_CLASSES(state, newClasses) {
      state.classes = newClasses
    },
    SET_IS_WORDWRAP(state, newValue) {
      state.isWordWrap = newValue
    }
  },
  actions: {
    getFocusedEditable({ state, dispatch }) {
      return state.focused
        ? { blur: () => dispatch('editorBlur') }
        : document.querySelector('input:focus') ||
            document.querySelector('textarea:focus')
    },

    updateEditor({ commit, state }, { editor, classes }) {
      commit('SET_EDITOR', editor)
      commit('SET_CLASSES', classes)

      editor.onDidFocusEditor(() => commit('SET_FOCUSED', true))
      editor.onDidBlurEditor(() => commit('SET_FOCUSED', false))
    },

    updateEditorWordWrap({ commit, state }, wordWrap) {
      settings.set('editor.wordWrap', wordWrap)
      commit('SET_IS_WORDWRAP', wordWrap)
    },
    editorCenter({ commit, dispatch, state }, options) {
      if (!editor) return
      if (!options) {
        // https://microsoft.github.io/monaco-editor/api/interfaces/monaco.editor.istandalonecodeeditor.html#revealpositionincenter
        editor.revealPositionInCenter(editor.getPosition())
      }

      if (options.line) {
        if (options.query.length) {
          const selectionRange = new window.monaco.Range(
            options.line.number,
            options.line.column,
            options.line.number,
            options.line.column + options.query.length
          )
          // https://microsoft.github.io/monaco-editor/api/interfaces/monaco.editor.istandalonecodeeditor.html#revealrangeincenter
          editor.revealRangeInCenter(selectionRange)
          dispatch('editorSelect', options)
        } else {
          editor.revealLineInCenter(options.line.number)
        }
      }
    },

    editorMoveCursor({ state }, options) {
      if (!editor) return

      // https://microsoft.github.io/monaco-editor/api/interfaces/monaco.editor.istandalonecodeeditor.html#setposition
      editor.setPosition({
        lineNumber: options.line.number,
        column: options.line.column
      })
    },

    editorSelect({ state }, options) {
      if (!editor) return

      let matches = editor
        .getModel()
        .findMatches(options.query, false, options.useRegex, false, false)

      for (let match in matches) {
        editor.setSelection({
          selectionStartLineNumber: matches[match].range.startLineNumber,
          selectionStartColumn: matches[match].range.startColumn,
          positionLineNumber: matches[match].range.endLineNumber,
          positionColumn: matches[match].range.endColumn
        })
      }
    },

    editorHighlight({ state }, { lines }) {
      let decorations = []

      if (lines) {
        decorations.push(
          ...lines.map(line => {
            return {
              range: new window.monaco.Range(line, 1, line, 1),
              options: {
                isWholeLine: true,
                linesDecorationsClassName: state.classes.lineDecorationClass
              }
            }
          })
        )
      }

      // https:// microsoft.github.io/monaco-editor/api/interfaces/monaco.editor.istandalonecodeeditor.html#deltadecorations
      editor.deltaDecorations([], decorations)
    },

    editorFocus({ state }) {
      if (!editor) return

      if (!state.focused) {
        editor.focus()
      }
    },

    editorBlur({ state }) {
      if (state.focused) {
        document.activeElement.blur()
      }
    },

    editorNextTick() {
      const editorExistedAtStart = !!editor
      return new Promise(resolve => {
        const checkForEditor = () => {
          if (editor) {
            if (editorExistedAtStart) {
              const listener = editor.onDidChangeModelContent(() => {
                listener.dispose()
                resolve()
              })
            } else {
              resolve()
            }
          } else {
            setTimeout(checkForEditor, 50)
          }
        }
        checkForEditor()
      })
    }
  }
}
