<template>
  <OnboardingStage
    quote="Innovation is taking two things that already exist and putting them together in a new way."
    quote-author="Tom Freston"
  >

    <template slot="header">
      <AppIcon icon="bolt fa-4x"/>
      <h1 data-e2e="OnboardingWizardSetToggleHotkey-title">Set Toggle Hotkey</h1>
    </template>

    <p>CodePilot.ai doesn't have to take up your precious screen space</p>
    <p>With a hotkey, you can quickly toggle between your full screen editor and CodePilot.ai</p>
    <p>Tip: Choose a hotkey that doesn't require finger gymnastics</p>

    <InputKeyboardShortcutModal
      v-if="capturingShortcut"
      @confirm="confirm"
      @cancel="cancel"
    />

    <div class="flex flex-row flex-no-wrap -mx-2 py-2">
      <AppButton
        class="m-2"
        data-e2e="OnboardingStage-set-hotkey"
        tabindex="1"
        type="main"
        @click="capturingShortcut = true"
        @keydown.enter="capturingShortcut = true"
      >
        Set my hotkey
      </AppButton>

      <AppButton
        class="m-2"
        data-e2e="OnboardingStage-skip-hotkey"
        tabindex="2"
        type="main"
        @click="updateOnboardingStage('next')"
        @keydown.enter="updateOnboardingStage('next')"
      >
        Skip
      </AppButton>
    </div>
  </OnboardingStage>
</template>

<script>
import OnboardingStage from './onboarding-stage'
import InputKeyboardShortcutModal from './input-keyboard-shortcut-modal'
import { onboardingGetters, onboardingActions } from '@state/helpers'

export default {
  components: {
    OnboardingStage,
    InputKeyboardShortcutModal
  },
  data() {
    return {
      capturingShortcut: false
    }
  },
  computed: {
    ...onboardingGetters
  },
  methods: {
    ...onboardingActions,
    confirm() {
      this.capturingShortcut = false
      this.updateOnboardingStage('next')
    },
    cancel() {
      this.capturingShortcut = false
    }
  }
}
</script>
