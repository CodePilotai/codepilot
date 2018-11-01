import Vue from 'vue'

import App from './app'
import store from './state/store'
import './directives'

import camelCase from 'lodash/camelCase'
import upperFirst from 'lodash/upperFirst'
import Vuelidate from 'vuelidate'
import 'vue-octicon/icons'
import VueTour from 'vue-tour'

const requireComponent = require.context(
  './components',
  false,
  /app-[\w-]+\.vue$/
)
requireComponent.keys().forEach(fileName => {
  const componentConfig = requireComponent(fileName)
  const componentName = upperFirst(
    camelCase(fileName.replace(/^\.\//, '').replace(/\.\w+$/, ''))
  )
  Vue.component(componentName, componentConfig.default || componentConfig)
})

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.config.productionTip = false

Vue.use(Vuelidate)
Vue.use(VueTour)

if (process.env.NODE_ENV !== 'production') {
  Vue.mixin({
    mounted() {
      checkForAntiPatterns(this)
    },
    updated() {
      checkForAntiPatterns(this)
    }
  })
}

/* eslint-disable no-new */
new Vue({
  store,
  render: h => h(App)
}).$mount('#app')

function checkForAntiPatterns(self) {
  self.$nextTick(() => {
    if (!self.$el.tagName) return

    const anchorTags = Array.from(self.$el.getElementsByTagName('A'))
    for (const anchorTag of anchorTags) {
      if (anchorTag.getAttribute('href')) {
        const vm = findClosestComponentRootEl(anchorTag)
        if (vm !== self) continue
        const componentPath = vm.$options.__file

        // HACK: Prevent the alert from triggering for TheChat.
        // The alert is triggered because TheChat is transitioning the message list to channel list.
        // if (vm.$options._componentTag === 'TheChat') return
        if (!/app-embedded-html.vue$/.test(componentPath)) {
          window.alert(
            `CRITICAL WARNING! Found an anchor element with an href attribute in ${componentPath}, which will break the app when users click on the link. This was probably caused by either using v-html instead of the AppEmbeddedHtml component, or by using a raw anchor element instead of the AppLink component.`
          )
          return
        }
      }
    }
  })

  function findClosestComponentRootEl(element) {
    if (!element) return null
    if (element.__vue__) return element.__vue__
    return findClosestComponentRootEl(element.parentElement)
  }
}
