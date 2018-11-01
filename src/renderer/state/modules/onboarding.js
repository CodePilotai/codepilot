import settings from 'electron-settings'

const stages = ['start', 'select-folder', 'set-toggle-hotkey', 'complete']

export default {
  state: {
    currentStage: settings.get('onboarding.currentStage') || stages[0],
    customerChoseToGoPro: false
  },
  getters: {
    currentOnboardingStageIndex(state) {
      return stages.indexOf(state.currentStage)
    },
    prevOnboardingStage(state, getters) {
      return stages[getters.currentOnboardingStageIndex - 1]
    },
    nextOnboardingStage(state, getters) {
      return stages[getters.currentOnboardingStageIndex + 1]
    },
    onboardingIsComplete(state) {
      const lastStage = stages[stages.length - 1]
      return state.currentStage === lastStage
    },
    onboardingPages(state) {
      return stages.slice(0, stages.length - 1)
    }
  },
  mutations: {
    SET_CURRENT_STAGE(state, newValue) {
      state.currentStage = newValue
    },
    SET_CUSTOMER_CHOSE_TO_GO_PRO(state, newValue) {
      state.customerChoseToGoPro = newValue
    }
  },
  actions: {
    updateOnboardingStage({ commit, state, getters }, stageRequest) {
      if (stageRequest === 'prev' && getters.prevOnboardingStage) {
        commit('SET_CURRENT_STAGE', getters.prevOnboardingStage)
      } else if (stageRequest === 'next' && getters.nextOnboardingStage) {
        commit('SET_CURRENT_STAGE', getters.nextOnboardingStage)
      } else if (
        typeof stageRequest === 'string' &&
        stages.indexOf(stageRequest) !== -1
      ) {
        commit('SET_CURRENT_STAGE', stageRequest)
      } else if (
        typeof stageRequest === 'number' &&
        stageRequest >= 0 &&
        stageRequest < stages.length
      ) {
        const targetStage = stages[stageRequest]
        commit('SET_CURRENT_STAGE', targetStage)
      } else {
        throw new Error('Invalid onboarding stage request: ' + stageRequest)
      }
      settings.set('onboarding.currentStage', state.currentStage)
    },
    updateCustomerChoseToGoPro({ commit }, newValue) {
      commit('SET_CUSTOMER_CHOSE_TO_GO_PRO', newValue)
    }
  }
}
