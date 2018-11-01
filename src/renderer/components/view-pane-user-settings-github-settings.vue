<template>
  <div>
    <div class="mr-3">
      <h3>GitHub Settings</h3>
      <p>
        Sign In to GitHub for better results.
      </p>
    </div>
    <div class="mb-8">
      <h2>GitHub</h2>
      <div v-if="!githubUserInfo">
        <p data-e2e="ViewPaneUserSettingsGithubSettings-signInText">Sign in to your GitHub.com account to search your repositories as well as other public repositories.</p>
        <AppButton
          data-e2e="ViewPaneUserSettingsGithubSettings-signInButton"
          @click="updateGitHubSignInModalShown(true)"
        >
          <span v-if="signInLoading">
            <AppSpinner/> Signing in
          </span>
          <span v-else>
            Sign in to GitHub
          </span>
        </AppButton>
        <!-- to enable GitHub auth for e2e testing -->
        <div v-if="isE2EEnvironment">
          <AppInputText
            v-model="e2eData.user"
            data-e2e="GithubSettings-user"
          />
          <AppInputText
            v-model="e2eData.password"
            data-e2e="GithubSettings-password"
            @keyup.enter="githubBasicSignIn(e2eData)"
          />
        </div>
      </div>
      <div
        v-else
        class="flex items-center"
      >
        <img
          :src="githubUserInfo.avatarUrl"
          :class="$style.githubAvatarImage"
          class="w-24 rounded"
        >
        <div class="px-8">
          <p data-e2e="ViewPaneUserSettingsGithubSettings-githubUsername"> {{ githubUserInfo.name }} </p>
          <p data-e2e="ViewPaneUserSettingsGithubSettings-githubLogin"> @{{ githubUserInfo.login }} </p>
        </div>
        <AppButton
          data-e2e="ViewPaneUserSettingsGithubSettings-signOutButton"
          @click="revokeGithubAccess">Sign Out</AppButton>
      </div>
    </div>

    <div class="mb-8">
      <h3>GitHub Enterprise</h3>
      <div v-if="!githubEnterpriseUserInfo">
        <p data-e2e="ViewPaneUserSettingsGithubSettings-enterpriseSignInText">Sign in to your GitHub Enterprise account to search your companies private repos.</p>
        <AppButton
          data-e2e="ViewPaneUserSettingsGithubSettings-signInEnterpriseButton"
          @click="updateGitHubEnterpriseSignInModalShown(true)"
        >
          <span>
            Sign in to GitHub Enterprise
          </span>
        </AppButton>

        <AppLink @click="updateGitHubEnterpriseInstructionsShown(true)">
          Configuration instructions
        </AppLink>

      </div>
      <div
        v-else
        class="flex items-center"
      >
        <img
          ref="githubEnterpriseUserImage"
          :class="$style.githubAvatarImage"
          :src="githubEnterpriseUserInfo.avatarUrl"
          class="w-24 rounded"
          @error="handleEnterpriseAvatarError()"
        >
        <div class="px-8">
          <p data-e2e="ViewPaneUserSettingsGithubSettings-githubEnterpriseUsername"> {{ githubEnterpriseUserInfo.name }} </p>
          <p data-e2e="ViewPaneUserSettingsGithubSettings-githubEnterpriseLogin"> @{{ githubEnterpriseUserInfo.login }} </p>
        </div>
      </div>
    </div>

    <div
      v-if="githubUserInfo"
      class="flex flex-col flex-no-wrap w-full mt-8"
    >
      <h2>GitHub rate limits</h2>
      <div
        :class="$style.restLimit"
        class="relative flex flex-col p-0 mb-3"
      >
        <div class="flex flex-col justify-start leading-none">
          <table class="w-full text-left">
            <tr>
              <th>Name:</th>
              <th>Remaining:</th>
              <th>Total:</th>
              <th>Resets:</th>
            </tr>
            <ViewPaneUserSettingsGithubSettingsLimitRow
              :rate-data="rateLimits.restApi"
              rate-name="REST API"
            />
            <ViewPaneUserSettingsGithubSettingsLimitRow
              :rate-data="rateLimits.core"
              rate-name="Core"
            />
            <ViewPaneUserSettingsGithubSettingsLimitRow
              :rate-data="rateLimits.graphql"
              rate-name="GraphQL"
            />
            <ViewPaneUserSettingsGithubSettingsLimitRow
              :rate-data="rateLimits.search"
              rate-name="Search"
            />
          </table>
        </div>
      </div>
    </div>
    <AppButton
      v-if="githubUserInfo"
      @click="getRemainingRateLimits"
    >
      Refresh
    </AppButton>
  </div>
</template>

<script>
import ghePlaceholderImage from '@assets/images/ghe-placeholder-icon.png'
import {
  interfaceActions,
  githubAuthGetters,
  githubAuthActions
} from '@state/helpers'
import ViewPaneUserSettingsGithubSettingsLimitRow from './view-pane-user-settings-github-settings-limit-row'

export default {
  components: {
    ViewPaneUserSettingsGithubSettingsLimitRow
  },
  data() {
    return {
      e2eData: {
        user: '',
        password: ''
      }
    }
  },
  computed: {
    ...githubAuthGetters,
    isE2EEnvironment() {
      return process.env.SPECTRON
    }
  },
  created() {
    this.getRemainingRateLimits()
  },
  methods: {
    ...interfaceActions,
    ...githubAuthActions,
    handleEnterpriseAvatarError() {
      this.$refs.githubEnterpriseUserImage.src = ghePlaceholderImage
    }
  }
}
</script>

<style lang="scss" module>
@import '~@branding';

.github-avatar-image {
  box-shadow: $app-box-shadow-subtle;
}

.rest-limit {
  color: var(--button-text-color);
}
</style>
