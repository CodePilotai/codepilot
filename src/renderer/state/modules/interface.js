import { webFrame } from 'electron'
import branding from '@branding'
import settings from 'electron-settings'
import mapKeys from 'lodash/mapKeys'

function getThemeVariables(themeName) {
  if (!themeName) return {}

  try {
    const theme = require(`@themes/${themeName}.json`)
    return mapKeys(theme, (val, key) => `--${key}`)
  } catch (e) {
    console.warn('No matching theme found.')
    return {}
  }
}

const themes = [
  {
    label: 'Atom Dark Theme',
    key: 'atom-dark',
    aliases: ['atom']
  },
  {
    label: 'Atom Light Theme',
    key: 'atom-light'
  }
]
function getCurrentThemeKey() {
  const savedThemeKey = settings.get('interface.theme')
  // Check for a matching theme by key or alias
  const validTheme = themes.find(
    theme =>
      theme.key === savedThemeKey ||
      (theme.aliases && theme.aliases.includes(savedThemeKey))
  )
  return validTheme
    ? // Return a valid theme key if one was previously saved
      validTheme.key
    : // Otherwise return the key of the first theme in the list
      themes[0].key
}

export default {
  state: {
    screenResolution: null,
    sidebar: {
      width: parseInt(branding._sidebarDefaultWidth),
      expansionState: 'normal',
      sidebarAnimating: false,
      prevWidth: null,
      tabs: ['Results', 'Pins'],
      activeTab: 'Results'
    },
    githubSignInModalShown: false,
    githubEnterpriseSignInModalShown: false,
    githubEnterpriseInstructionsShown: false,
    trialEndingModalShown: false,
    appPinModalShown: false,
    rubberDuckModalShown: false,
    viewable: { type: 'noResults' },
    prevViewable: null,
    codeFontSize:
      settings.get('interface.codeFontSize') ||
      parseFloat(branding._baseFontSize),
    codeFontFamily:
      settings.get('interface.codeFontFamily') ||
      String(branding._codeFontStackDefault),
    currentThemeKey: getCurrentThemeKey(),
    themes,
    zoomFactor: settings.get('interface.zoomFactor') || 1,
    minimapIsEnabled: true,
    viewPaneState: {}
  },
  getters: {
    sidebarIsVisible(state, getters, rootState) {
      return true
    },
    interfaceVariables(state) {
      const fontFamily =
        state.codeFontFamily === branding._codeFontStackDefault
          ? state.codeFontFamily
          : `${state.codeFontFamily}, ${branding._codeFontStackDefault}`

      const themeVariables = getThemeVariables(state.currentThemeKey)
      themeVariables['--input-font'] += `, ${fontFamily}`

      return {
        '--code-font-size': state.codeFontSize + 'px',
        '--code-font-family': fontFamily,
        '--selectable-highlighted-bg': branding._selectableHighlightedBg,
        ...themeVariables
      }
    }
  },
  mutations: {
    SET_GITHUB_SIGN_IN_MODAL_SHOWN(state, newValue) {
      state.githubSignInModalShown = newValue
    },
    SET_GITHUB_ENTERPRISE_SIGN_IN_MODAL_SHOWN(state, newValue) {
      state.githubEnterpriseSignInModalShown = newValue
    },
    SET_GITHUB_ENTERPRISE_INSTRUCTIONS_SHOWN(state, newValue) {
      state.githubEnterpriseInstructionsShown = newValue
    },
    SET_TRIAL_ENDING_MODAL_SHOWN(state, newValue) {
      state.trialEndingModalShown = newValue
    },
    SET_APP_PIN_MODAL_SHOWN(state, newValue) {
      state.appPinModalShown = newValue
    },
    SET_RUBBER_DUCK_MODAL_SHOWN(state, newValue) {
      state.rubberDuckModalShown = newValue
    },
    SET_SIDEBAR_WIDTH(state, newValue) {
      state.sidebar.prevWidth = state.sidebar.width
      state.sidebar.width = newValue
    },
    SET_VIEWABLE(state, newValue) {
      if (state.viewable.type !== newValue.type)
        state.prevViewable = state.viewable
      state.viewable = newValue
    },
    SET_CODE_FONT_SIZE(state, size) {
      state.codeFontSize = size
    },
    SET_CODE_FONT_FAMILY(state, fontFamily) {
      state.codeFontFamily = fontFamily
    },
    SET_CURRENT_THEME_KEY(state, themeKey) {
      state.currentThemeKey = themeKey
    },
    SET_SIDEBAR_ANIMATING(state, newValue) {
      state.sidebar.sidebarAnimating = newValue
    },
    SET_ZOOM_FACTOR(state, newValue) {
      state.zoomFactor = newValue
    },
    SET_VIEW_PANE_STATE(state, newState) {
      state.viewPaneState = newState
    },
    TOGGLE_MINIMAP_ENABLED(state) {
      state.minimapIsEnabled = !state.minimapIsEnabled
    },
    SET_SIDEBAR_ACTIVE_TAB(state, newTab) {
      state.sidebar.activeTab = newTab
    },
    UPDATE_SCREEN_RESOLUTION(state, newResolution) {
      state.screenResolution = newResolution
    }
  },
  actions: {
    toggleMinimapEnabled({ commit }) {
      commit('TOGGLE_MINIMAP_ENABLED')
    },
    detectScreenResolution({ commit }) {
      commit('UPDATE_SCREEN_RESOLUTION', {
        width: window.screen.width,
        height: window.screen.height
      })
    },
    revertToPrevViewable({ commit, state }) {
      commit('SET_VIEWABLE', state.prevViewable)
    },
    revertToPrevSidebarWidth({ commit, state }) {
      commit('SET_SIDEBAR_WIDTH', state.sidebar.prevWidth)
    },
    updateZoomFactor({ commit, state }, proposedAction) {
      if (proposedAction === 'zoomIn' && state.zoomFactor < 1.5) {
        commit('SET_ZOOM_FACTOR', state.zoomFactor + 0.1)
      } else if (proposedAction === 'zoomOut' && state.zoomFactor > 0.5) {
        commit('SET_ZOOM_FACTOR', state.zoomFactor - 0.1)
      } else if (proposedAction === 'resetZoom') {
        commit('SET_ZOOM_FACTOR', 1)
      }
      webFrame.setZoomFactor(state.zoomFactor)
      settings.set('interface.zoomFactor', state.zoomFactor)
    },
    updateGitHubSignInModalShown({ commit }, modalShown) {
      commit('SET_GITHUB_SIGN_IN_MODAL_SHOWN', modalShown)
    },
    updateGitHubEnterpriseSignInModalShown({ commit }, modalShown) {
      commit('SET_GITHUB_ENTERPRISE_SIGN_IN_MODAL_SHOWN', modalShown)
    },
    updateGitHubEnterpriseInstructionsShown({ commit }, modalShown) {
      commit('SET_GITHUB_ENTERPRISE_INSTRUCTIONS_SHOWN', modalShown)
    },
    updateRubberDuckModalShown({ commit }, modalShown) {
      commit('SET_RUBBER_DUCK_MODAL_SHOWN', modalShown)
    },
    updateTrialEndingModalShown({ commit }, modalShown) {
      commit('SET_TRIAL_ENDING_MODAL_SHOWN', modalShown)
    },
    updateAppPinModalShown({ commit }, modalShown) {
      commit('SET_APP_PIN_MODAL_SHOWN', modalShown)
    },
    updateSidebarWidth({ commit, state }, proposedValue) {
      commit('SET_SIDEBAR_ANIMATING', proposedValue.animate)
      if (proposedValue.width > state.screenResolution.width * 0.3) {
        commit('SET_SIDEBAR_WIDTH', state.screenResolution.width * 0.3)
      } else if (proposedValue.width < state.screenResolution.width * 0.15) {
        if (proposedValue.width < state.screenResolution.width * 0.08)
          commit('SET_SIDEBAR_WIDTH', parseInt(branding._gridPadding))
        else commit('SET_SIDEBAR_WIDTH', state.screenResolution.width * 0.15)
      } else {
        commit('SET_SIDEBAR_WIDTH', proposedValue.width)
      }
    },
    toggleSidebarExpanded({ commit, state }) {
      commit('SET_SIDEBAR_ANIMATING', true)
      if (state.sidebar.width === state.screenResolution.width * 0.3) {
        commit('SET_SIDEBAR_WIDTH', parseInt(branding._gridPadding))
      } else if (state.sidebar.width === parseInt(branding._gridPadding)) {
        commit('SET_SIDEBAR_WIDTH', state.screenResolution.width * 0.15)
      } else {
        commit('SET_SIDEBAR_WIDTH', state.screenResolution.width * 0.3)
      }
    },
    updateViewable({ commit, state, rootState }, newViewable) {
      commit('SET_VIEWABLE', newViewable)
    },
    updateCodeFontSize({ commit }, rawSize) {
      const size = Math.abs(
        parseFloat(rawSize) || parseFloat(branding._baseFontSize)
      )
      settings.set('interface.codeFontSize', size)
      commit('SET_CODE_FONT_SIZE', size)
    },
    updateCodeFontFamily({ commit }, rawFamily) {
      const fontFamily = rawFamily || branding._codeFontStackDefault
      settings.set('interface.codeFontFamily', fontFamily)
      commit('SET_CODE_FONT_FAMILY', fontFamily)
    },
    updateTheme({ commit }, themeOrKey) {
      const themeKey = themeOrKey.key || themeOrKey
      settings.set('interface.theme', themeKey)
      commit('SET_CURRENT_THEME_KEY', themeKey)
    },
    displayViewPaneSettings({ dispatch }) {
      dispatch('updateSearchIsFullWindow', false)
      dispatch('updateViewable', { type: 'settings' })
      dispatch('updateViewPaneState', {})
    },
    updateViewPaneState({ commit }, newState) {
      commit('SET_VIEW_PANE_STATE', newState)
    },
    toggleView({ state, dispatch, commit }, { type }) {
      dispatch('updateSearchIsFullWindow', false)
      if (state.viewable.type === type) {
        commit('SET_VIEWABLE', { type: 'result' })
      } else {
        commit('SET_VIEWABLE', { type })
      }
    },
    updateSidebarActiveTab({ commit }, newTab) {
      commit('SET_SIDEBAR_ACTIVE_TAB', newTab)
    }
  }
}
