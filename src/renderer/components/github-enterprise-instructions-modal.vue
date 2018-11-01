<template>
  <AppModal
    title="GitHub Enterprise Configuration Instructions"
    @close="updateGitHubEnterpriseInstructionsShown(false)"
  >
    <p
      class="m-2 text-sm"
    >
      <ul>
        <li>Step 1 - Sign in to GitHub Enterprise</li>
        <li>Step 2 - GitHub Enterprise URL</li>
        <li>Step 3 - GitHub Enterprise SignIn</li>
        <p>You will be asked for a personal access token, to generate and associate a token you must navigate to your companies GitHub Enterprise URL.</p>
        <li>Step 4 - Create Personal Access Token</li>
        <p>Using your web browser navigate to the same URL you used for the GitHub Enterprise URL in Step 2.<br>
          Go to your Profile and select Developer Settings. Once you select Developer Setting you will be able to select Personal Access Tokens</p>
        <li>Step 5 - Create Personal Access Token</li>
        <p>Generate your Personal Access Token and set the name of the Token to “CodePilot.ai”<br>
          Set the scopes of the token - Repo and User - and then save the scopes.</p>
        <li>Step 6 - Copy the token to CodePilot.ai</li>
        <p>Complete the process by pasting the token into CodePilot.ai.</p>
      </ul>
    </p>
  </AppModal>
</template>

<script>
import { interfaceActions } from '@state/helpers'

export default {
  methods: {
    ...interfaceActions
  }
}
</script>
