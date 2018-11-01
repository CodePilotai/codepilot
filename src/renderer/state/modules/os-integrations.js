import settings from 'electron-settings'
import AutoLaunch from 'auto-launch'

export default {
  state: {
    launchOnStartup: false,
    commentCodeOnCopy: false
  },
  mutations: {
    SET_INTEGRATIONS(state, newIntegrations) {
      for (let property in newIntegrations) {
        state[property] = newIntegrations[property]
      }
    },
    SET_LAUNCH_ON_STARTUP(state, newValue) {
      state.launchOnStartup = newValue
    },
    SET_COMMENT_CODE_ON_COPY(state, newValue) {
      state.commentCodeOnCopy = newValue
    }
  },
  actions: {
    updateLaunchOnStartup({ commit, state }, newValue) {
      // Avoid auto-launch in development
      if (process.env.NODE_ENV === 'production') {
        integrateLaunchOnStartup(newValue)
      }
      commit('SET_LAUNCH_ON_STARTUP', newValue)
      settings.set('osIntegrations', state)
    },
    updateCommentCodeOnCopy({ commit, state }, newValue) {
      commit('SET_COMMENT_CODE_ON_COPY', newValue)
      settings.set('osIntegrations', state)
    },
    initOsIntegrations({ commit, state }) {
      const savedIntegrations = settings.get('osIntegrations')
      if (savedIntegrations) {
        commit('SET_INTEGRATIONS', savedIntegrations)
      }
      // Avoid auto-launch in development
      if (process.env.NODE_ENV === 'production') {
        integrateLaunchOnStartup(state.launchOnStartup)
      }
    }
  }
}

// ===
// Integrations
// ===

const autoLauncher = new AutoLaunch({
  // Note that this does not include ".ai",
  // because some OSes apparently have problems
  // with the dot.
  name: 'CodePilot',
  // We might set isHidden to true later
  // if users are expected to really
  // launch it from a taskbar or keyboard
  // shortcut.
  isHidden: false
})

// https://github.com/Teamwork/node-auto-launch
function integrateLaunchOnStartup(launchOnStartup) {
  autoLauncher.isEnabled().then(isEnabled => {
    if (launchOnStartup && !isEnabled) {
      autoLauncher.enable()
    } else if (!launchOnStartup && isEnabled) {
      autoLauncher.disable()
    }
  })
}
