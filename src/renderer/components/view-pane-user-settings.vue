<template>
  <div class="w-full h-full flex flex-col">
    <div class="w-full">
      <header class="w-full py-2 px-4 bg-grey">
        <div class="flex">
          <h1 class="mb-0 flex items-center w-48">
            Settings
          </h1>
          <ImportExportSettings class="sm:ml-auto xl:-ml-3 xl:mr-auto mr-3"/>
          <AppButton
            icon="times"
            @click="revertToPrevViewable"
          />
        </div>
        <div>CodePilot.ai {{ appVersion }}</div>
      </header>
    </div>

    <main class="flex rounded border-t border-grey-dark flex mt-2 min-h-full bg-grey-dark overflow-scroll">
      <div class="flex flex-col w-12 md:w-48 h-full sticky pin-t">
        <button
          v-for="setting in settings"
          :key="setting.key"
          :active="activeTab === setting.key"
          :data-e2e="'ViewPaneUserSettings-' + setting.name"
          :class="[
            'bg-grey-dark mb-3 text-left text-grey-text no-outline pl-2 pr-3 py-3 w-48 flex-no-shrink',
            {'border border-t-0 border-r-0 border-l-0 border-b-2 border-primary bg-grey':activeTab === setting.key}
          ]"
          @click="activeTab = setting.key"
        >
          <AppIcon
            v-tooltip.right="setting.name"
            :icon="setting.icon"
            class="ml-2 mr-4 w-4 text-lg text-center"
          />
          {{ setting.name }}
        </button>
      </div>
      <div class="p-4 bg-grey w-full h-full">
        <component :is="activeSettingsTabPaneComponent" />
      </div>
    </main>
  </div>
</template>

<script>
import kebabCase from 'lodash/kebabCase'
import { interfaceGetters, interfaceActions } from '@state/helpers'
import store from '@state/store'
import ImportExportSettings from '@components/import-export-settings'

export default {
  components: { ImportExportSettings },
  data() {
    return {
      appVersion: process.env.APP_VERSION,
      activeTab:
        store.state.interface.viewPaneState.activeTab || 'app-settings',
      settings: {
        appSettings: {
          name: 'App Settings',
          key: 'app-settings',
          icon: 'window-maximize'
        },
        searchSettings: {
          name: 'Search Settings',
          key: 'search-settings',
          icon: 'search'
        },
        customSearchSources: {
          name: 'Custom Sources',
          key: 'custom-sources',
          icon: 'cloud'
        },
        uiSettings: {
          name: 'UI Settings',
          key: 'ui-settings',
          icon: 'font'
        },
        githubSettings: {
          name: 'GitHub Settings',
          key: 'github-settings',
          icon: 'github'
        },
        userProfile: {
          name: 'Profiles',
          key: 'user-profile',
          icon: 'users'
        },
        docs: {
          name: 'Docs',
          key: 'docs',
          icon: 'book'
        }
      }
    }
  },
  computed: {
    ...interfaceGetters,
    activeSettingsTabPaneComponent() {
      const activeTab = kebabCase(this.activeTab.toLowerCase())
      try {
        return require(`./view-pane-user-settings-${activeTab}`).default
      } catch (e) {}
    }
  },
  watch: {
    viewPaneState(newState) {
      if (newState.activeTab) {
        this.activeTab = newState.activeTab
      }
    }
  },
  methods: {
    ...interfaceActions,
    toggleSettings() {
      this.toggleSidebarExpanded()
      this.revertToPrevViewable()
      this.revertToPrevSidebarWidth()
    }
  }
}
</script>
