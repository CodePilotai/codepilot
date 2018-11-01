<template>
  <AppModal
    title="GitHub Sign In"
    @close="updateGitHubSignInModalShown(false)"
  >
    <div class="flex mt-4">
      <AppButton
        class="w-1/2"
        @click="updateGitHubSignInModalShown(false)"
      >
        Cancel
      </AppButton>
      <AppButton
        data-e2e="GitHubSignInModal-login"
        type="success"
        class="w-1/2 ml-3"
        @click="githubBrowserSignIn"
      >
        Sign in to GitHub
      </AppButton>
    </div>
  </AppModal>
</template>

<script>
import { interfaceActions, githubAuthActions } from '@state/helpers'
export default {
  methods: {
    ...githubAuthActions,
    ...interfaceActions
  }
}
</script>
