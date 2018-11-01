<template>
  <OnboardingStage
    :button-title="testTexts.buttonText"
    quote="Happiness is nothing more than good health and a bad memory."
    quote-author="Albert Schweitzer"
    data-e2e-button-title="select-folder-button"
    @button-click="selectFolder"
  >
    <GlobalEvents @keydown.enter.prevent="selectFolder"/>
    <template slot="header">
      <AppIcon icon="search fa-4x"/>
      <h1 data-e2e="OnboardingWizardSelectFolder-title">Local Search</h1>
    </template>

    <AppEmbeddedHtml
      :html="testTexts.instructions"
      url="https://codepilot.ai/"
    />
  </OnboardingStage>
</template>

<script>
import OnboardingStage from './onboarding-stage'
import changeFolderDialog from '@helpers/change-folder-dialog'
import textLengthTest from '@split-tests/onboarding-wizard-select-folder-text-length'
import GlobalEvents from 'vue-global-events'
import {
  onboardingGetters,
  onboardingActions,
  searchGetters,
  searchActions
} from '@state/helpers'

export default {
  components: {
    OnboardingStage,
    GlobalEvents
  },
  computed: {
    ...onboardingGetters,
    ...searchGetters,
    testTexts: () => textLengthTest.value
  },
  methods: {
    ...onboardingActions,
    ...searchActions,
    selectFolder() {
      const defaultPath = this.$electron.remote.app.getPath('home')
      changeFolderDialog({
        title: 'Select a folder to search',
        buttonTitle: 'Choose Folder',
        defaultPath,
        callback: folderPaths => {
          if (folderPaths) {
            this.updateQuery({
              projectDirectories: folderPaths
            })
            this.updateOnboardingStage('next')
          }
        }
      })
    }
  }
}
</script>
