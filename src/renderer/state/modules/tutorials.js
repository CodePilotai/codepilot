import settings from 'electron-settings'

const INCOMPLETE_TUTORIALS = {
  filters: false,
  search: false
}

export default {
  state: {
    tutorialsCompleted: process.env.SPECTRON
      ? { filters: true, search: true }
      : settings.get('tutorials')
        ? {
            ...INCOMPLETE_TUTORIALS,
            ...settings.get('tutorials')
          }
        : INCOMPLETE_TUTORIALS
  },
  mutations: {
    SET_TUTORIALS_STATUS(state, newStatus) {
      state.tutorialsCompleted = {
        ...state.tutorialsCompleted,
        ...newStatus
      }
      settings.set('tutorials', state.tutorialsCompleted)
    }
  },
  actions: {
    setTutorialStatus({ state, commit }, newStatus) {
      commit('SET_TUTORIALS_STATUS', newStatus)
    },
    resetTutorials({ commit }) {
      commit('SET_TUTORIALS_STATUS', INCOMPLETE_TUTORIALS)
    }
  }
}
