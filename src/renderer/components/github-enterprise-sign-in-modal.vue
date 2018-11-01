<template>
  <AppModal
    title="GitHub Enterprise SignIn"
    @close="updateGitHubEnterpriseSignInModalShown(false)"
  >
    <div v-if="!githubEnterpriseHostAddressValidated">
      <AppInputText
        v-model="enterpriseHostAddress"
        data-e2e="GitHubEnterpriseSignInModal-enterpriseHostAddress"
        placeholder="Ex: https://github.mysite.com/"
        label="GitHub Enterprise Address"
      />
      <div class="flex mt-4">
        <AppButton
          class="w-1/2"
          @click="updateGitHubEnterpriseSignInModalShown(false)"
        >
          Cancel
        </AppButton>
        <AppButton
          :disabled="!enterpriseHostAddress"
          data-e2e="GitHubEnterpriseSignInModal-validateHostAddressButton"
          class="w-1/2 ml-3"
          type="success"
          @click="attemptToSetEnterpriseHostname"
        >
          Confirm
        </AppButton>
      </div>
    </div>
    <div v-else>
      <AppInputText
        :value="githubEnterpriseAccessToken"
        data-e2e="GitHubEnterpriseSignInModal-personalAccessToken"
        label="GitHub Enterprise Personal Access Token"
        @input="updateGitHubEnterprisePersonalAccessToken"
      />
      <AppButton
        class="mx-1 mt-4"
        @click="updateGitHubEnterpriseHostAddressValidated(false)"
      >
        Back
      </AppButton>
      <AppButton
        data-e2e="GitHubEnterpriseSignInModal-validatePersonalAccessToken"
        class="mx-1 mt-4"
        type="success"
        @click="validatePersonalAccessTokenAndCloseModal"
      >
        Finish
      </AppButton>
    </div>

    <p
      v-if="userFeedbackMessage"
      class="m-2 text-sm"
    >
      <span data-e2e="GitHubEnterpriseSignInModal-userFeedbackMessage">{{ userFeedbackMessage }}</span>
    </p>
  </AppModal>
</template>

<script>
import request from 'superagent'
import formatEnterpriseUrl from '@helpers/format-enterprise-url'
import {
  githubAuthGetters,
  githubAuthActions,
  interfaceActions
} from '@state/helpers'
export default {
  data() {
    return {
      userFeedbackMessage: '',
      enterpriseHostAddress: '',
      hostAddressValidated: false
    }
  },
  computed: {
    ...githubAuthGetters
  },
  methods: {
    ...githubAuthActions,
    ...interfaceActions,
    async attemptToSetEnterpriseHostname() {
      this.userFeedbackMessage = ''
      // Attempt to format enterprise host address properly
      let validUrl
      try {
        validUrl = formatEnterpriseUrl(this.enterpriseHostAddress)
      } catch (error) {
        // If an error occurs, display feedback to the user
        this.userFeedbackMessage = error.message
        return
      }

      process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0

      // Check hostAddress to ensure that it is reachable
      this.fetchMetadata(validUrl)
        .then(response => {
          this.updateGitHubEntepriseHostAddress(validUrl)
          this.updateGitHubEnterpriseHostAddressValidated(true)
        })
        .catch(error => {
          console.error(error)
          this.userFeedbackMessage = error.message
        })
    },
    fetchMetadata(endpoint) {
      return request
        .get(endpoint + '/api/v3/meta')
        .then(response => response.body)
    },
    async validatePersonalAccessTokenAndCloseModal() {
      await this.getCurrentAuthenticatedUser(this.githubEnterpriseHostAddress)
        .then(() => {
          this.updateGitHubEnterpriseSignInModalShown(false)
        })
        .catch(error => {
          console.error(error.message)
          this.userFeedbackMessage = error.message
        })
    }
  }
}
</script>
