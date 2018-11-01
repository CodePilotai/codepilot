<template>
  <div
    id="app"
    class="flex flex-col bg-grey"
  >
    <AppTitleBar/>
    <div class="flex flex-col py-1 overflow-hidden w-screen h-screen">
      <TheGlobalModal/>
      <template v-if="onboardingIsComplete">
        <TheSearchBar/>
        <PinsCollection v-if="searchIsFullWindow"/>
        <TheGlobalNotification/>
        <TheMainContainer/>
      </template>
      <TheOnboardingWizard v-else/>
      <TheUserTutorials/>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import TheSearchBar from './components/the-search-bar'
import TheMainContainer from './components/the-main-container'
import TheOnboardingWizard from './components/the-onboarding-wizard'
import TheGlobalModal from './components/the-global-modal'
import TheGlobalNotification from './components/the-global-notification'
import TheUserTutorials from './components/the-user-tutorials'
import PinsCollection from './components/pins-collection'

import {
  searchGetters,
  searchActions,
  shortcutActions,
  osIntegrationGetters,
  osIntegrationActions,
  githubAuthActions,
  internetConnectionActions,
  notificationActions,
  onboardingGetters,
  interfaceGetters,
  interfaceActions,
  githubAuthGetters,
  userProfileActions,
  customSearchSourcesActions,
  pinsActions
} from '@state/helpers'

import { ipcRenderer as ipc, webFrame } from 'electron'

export default {
  components: {
    TheSearchBar,
    TheMainContainer,
    TheOnboardingWizard,
    TheGlobalModal,
    TheGlobalNotification,
    TheUserTutorials,
    PinsCollection
  },
  computed: {
    ...searchGetters,
    ...osIntegrationGetters,
    ...onboardingGetters,
    ...interfaceGetters,
    ...githubAuthGetters
  },
  watch: {
    interfaceVariables: {
      handler() {
        document.body.setAttribute(
          'style',
          new Vue({
            render: h => h('div', { style: this.interfaceVariables })
          }).$mount().$el.style.cssText
        )
      },
      immediate: true
    },
    githubAccessToken: {
      handler(token) {
        if (token) this.getRemainingRateLimits()
      },
      immediate: true
    }
  },
  created() {
    // Added this before everything else. That way if notifications
    // are actually present this go round (i.e. internet connection
    // warning) then it still gets handled.
    this.initUserProfiles()
    this.initNotifications()
    this.initShortcuts()
    this.initOsIntegrations()
    this.initInternetConnectionChecker()
    this.initSelectedResultStream()
    this.reinitializeCustomSources()
    this.updateUserOSAndTimezone()
    this.detectScreenResolution()
    ipc.on('goToSettings', () => {
      this.displayViewPaneSettings()
    })
    this.updateQuery({
      text: '',
      includeOnly: '',
      exclude: '',
      useRegex: false,
      matchWholeWord: false
    })
    webFrame.setZoomFactor(this.zoomFactor)
    ipc.on('zoomIn', () => {
      this.updateZoomFactor('zoomIn')
    })
    ipc.on('zoomOut', () => {
      this.updateZoomFactor('zoomOut')
    })
    ipc.on('resetZoom', () => {
      this.updateZoomFactor('resetZoom')
    })
  },
  methods: {
    ...searchActions,
    ...notificationActions,
    ...shortcutActions,
    ...osIntegrationActions,
    ...githubAuthActions,
    ...internetConnectionActions,
    ...interfaceActions,
    ...userProfileActions,
    ...customSearchSourcesActions,
    ...pinsActions
  }
}
</script>

<!--
This should be the ONLY global CSS in the
entire project and should use element
selectors almost exclusively.
-->
<style lang="scss">
$fa-font-path: '~font-awesome/fonts';

@tailwind preflight;
// The ~ prefix means we're referencing
// a package in node_modules.
@import '~file-icons-js/css/style.css';
@import '~highlight.js/styles/atom-one-dark.css';
@import '~font-awesome/scss/font-awesome';
@import '~@branding';

@tailwind utilities;

@import '~@assets/fonts/lato';
@import '~@assets/styles/button';
@import '~@assets/styles/multiselect';
@import '~@assets/styles/tour';

*,
*::before,
*::after {
  box-sizing: border-box;
  line-height: $base-line-height;
}

html,
body,
#app {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

body {
  @apply font-sans;

  font-size: $base-font-size;
  color: $app-text-color;
  cursor: default;
  user-select: none;
}

#app {
  transition: $fade-transition;
}

h1,
h2,
h3,
h4,
h5,
h6 {
  margin-top: $grid-padding * 2;
  margin-bottom: $grid-padding;
  font-weight: normal;
  color: $app-heading-text-color;

  &:first-child {
    margin-top: 0;
  }
}

p {
  margin: 0 0 $grid-padding;
}

hr {
  width: 100%;
  margin: $grid-padding * 2 0;
  border: none;
  border-bottom: 3px solid var(--selectable-selected-bg);
}

a {
  color: $app-link-text-color;
  text-decoration: none;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
}

ul {
  padding: 0;
  margin: 0 0 $grid-padding;
  list-style-type: none;
}

img {
  max-width: 100%;
  -webkit-user-drag: none;
}

// https://webkit.org/blog/363/styling-scrollbars/
$minimized-scrollbar-width: 0;

::-webkit-scrollbar-track {
  border-radius: 0;
}

::-webkit-scrollbar-thumb {
  @apply bg-scroll-color;
}

::-webkit-scrollbar-button,
::-webkit-scrollbar-track-piece,
::-webkit-scrollbar-corner,
::-webkit-resizer {
  display: none;
}

::-webkit-scrollbar {
  @apply bg-transparent w-scroll-width;

  // stylelint-disable-next-line selector-pseudo-class-no-unknown
  &:window-inactive {
    display: none;
  }
}

// stylelint-disable-next-line selector-class-pattern
.NOT-YET-IMPLEMENTED {
  box-shadow: inset 0 0 0 2px red !important;
}

.row {
  display: flex;
  flex-shrink: 0;
  margin: 0 $grid-padding / -2 $grid-padding;
}

form .row {
  margin-bottom: 0;
}

.column {
  width: 100%;
  margin: 0 0.25rem;
}

// Show buttons next to each other whenever
button.column {
  margin: 0;

  &:first-child {
    margin-left: 0.25rem;
  }

  &:last-child {
    margin-right: 0.25rem;
  }
}

.no-outline {
  outline: none;

  &:focus {
    outline: none;
  }
}

.overflow-overlay {
  overflow: overlay;
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>
