import Vue from 'vue'
import Vuex from 'vuex'
import fs from 'fs'
import path from 'path'

// ===
// Utility functions
// ===

// https://vue-test-utils.vuejs.org/en/
import vueTestUtils from '@vue/test-utils'
// https://lodash.com/
import _ from 'lodash'
_.mixin({
  pascalCase: _.flow(
    _.camelCase,
    _.upperFirst
  )
})

// ===
// Environment Variables
// ===

const envVars = require('../../env-variables.config').renderer
for (const envVarKey in envVars) {
  const envVarName = envVarKey.replace(/^process\.env\./, '')
  process.env[envVarName] = envVars[envVarKey]
}

// ===
// Universal Mocks
// ===

jest.mock('@state/modules', () => require('@state/modules/__mocks__/index.js'))

// ===
// Configure Vue
// ===

// Don't warn about not using the production build of Vue, as
// we care more about the quality of errors than performance
// for tests.
Vue.config.productionTip = false

// ===
// Register global components
// ===

const globalComponentFiles = fs
  .readdirSync(path.join(__dirname, '../../src/renderer/components'))
  .filter(fileName => /^app-.+\.vue$/.test(fileName))

for (const fileName of globalComponentFiles) {
  const componentName = _.pascalCase(fileName.match(/^(app-.+)\.vue$/)[1])
  const componentConfig = require('../../src/renderer/components/' + fileName)
  Vue.component(componentName, componentConfig.default || componentConfig)
}

// ===
// Patch all components with a global mixin
// ===

Vue.mixin({
  created() {
    // HACK: Set a fallback for the `$style` until vue-jest
    // includes better support for CSS modules.
    this.$style = this.$style || {}
    this.$electron = require('./__mocks__/electron').default
  }
})

// ===
// Mock window properties not handled by jsdom
// ===

Object.defineProperty(window, 'localStorage', {
  value: (function() {
    let store = {}
    return {
      getItem: function(key) {
        return store[key] || null
      },
      setItem: function(key, value) {
        store[key] = value.toString()
      },
      clear: function() {
        store = {}
      }
    }
  })()
})

// Global test constants

global.testConstants = {
  githubEnterpriseHostAddress: '',
  githubApiToken: '',
  githubEnterpriseToken: '',
  youtubeToken: ''
}

// ===
// Global helpers
// ===

// https://vue-test-utils.vuejs.org/en/api/mount.html
global.mount = vueTestUtils.mount

// https://vue-test-utils.vuejs.org/en/api/shallowMount.html
global.shallowMount = vueTestUtils.shallowMount

// A helper for creating Vue component mocks
global.createComponentMocks = ({ store, style, mocks, stubs }) => {
  // Use a local version of Vue, to avoid polluting the global
  // Vue and thereby affecting other tests.
  // https://vue-test-utils.vuejs.org/en/api/createLocalVue.html
  const localVue = vueTestUtils.createLocalVue()
  const returnOptions = { localVue }

  // https://vue-test-utils.vuejs.org/en/api/options.html#stubs
  returnOptions.stubs = stubs || {}
  // https://vue-test-utils.vuejs.org/en/api/options.html#mocks
  returnOptions.mocks = mocks || {}

  // Converts a `store` option shaped like:
  //
  // store: {
  //   someModuleName: {
  //     state: { ... },
  //     getters: { ... },
  //     actions: { ... },
  //   },
  //   anotherModuleName: {
  //     getters: { ... },
  //   },
  // },
  //
  // to a store instance, with each module NOT namespaced by
  // default, just like in our app.
  if (store) {
    localVue.use(Vuex)
    returnOptions.store = new Vuex.Store({
      modules: Object.keys(store)
        .map(moduleName => {
          const storeModule = store[moduleName]
          return {
            [moduleName]: {
              state: storeModule.state || {},
              getters: storeModule.getters || {},
              actions: storeModule.actions || {},
              namespaced: !!storeModule.namespaced
            }
          }
        })
        .reduce((moduleA, moduleB) => Object.assign({}, moduleA, moduleB), {})
    })
  }

  // If a `style` object is provided, mock some styles.
  if (style) {
    returnOptions.mocks.$style = style
  }

  return returnOptions
}

global.createModuleStore = (vuexModule, options = {}) => {
  vueTestUtils.createLocalVue().use(Vuex)
  const store = new Vuex.Store(_.cloneDeep(vuexModule))
  if (vuexModule.actions && vuexModule.actions.init) {
    store.dispatch('init')
  }
  return store
}

global.createSearchRunner = searchFile => {
  const search = require(searchFile.replace(/\.unit/, '')).default
  return query => {
    const results = []
    return new Promise((resolve, reject) => {
      search(query).subscribe({
        next: data => {
          if (Array.isArray(data.results)) {
            results.push(...data.results)
          } else {
            results.push(data.results)
          }
        },
        complete: () => {
          resolve(results)
        }
      })
    })
  }
}
