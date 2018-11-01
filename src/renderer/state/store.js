import Vue from 'vue'
import Vuex from 'vuex'

import modules from './modules'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules,
  strict: process.env.NODE_ENV !== 'production'
})

// Automatically run the `init` action for every module,
// if one exists.
const initActionExists = Object.keys(modules).some(moduleName => {
  const { actions } = modules[moduleName]
  return actions && actions.init
})
if (initActionExists) {
  store.dispatch('init')
}

export default store
