<template>
  <div>
    <AppInputCheckbox
      v-if="platform !== 'linux'"
      :checked="launchOnStartup"
      label="Launch CodePilot.ai on startup (recommended)"
      help-text="Save a step and have CodePilot.ai start automatically"
      @change="updateLaunchOnStartup"
    />
    <AppInputCheckbox
      :checked="commentCodeOnCopy"
      label="Enable paste comments"
      help-text="Comments the code you copy/paste so you know where the code originated"
      @change="updateCommentCodeOnCopy"
    />
  </div>
</template>

<script>
import { osIntegrationGetters, osIntegrationActions } from '@state/helpers'

export default {
  data() {
    return {
      platform: process.platform
    }
  },
  computed: {
    ...osIntegrationGetters
  },
  methods: {
    ...osIntegrationActions
  }
}
</script>
