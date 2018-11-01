const path = require('path')
const utils = require('../utils')
const registrationData = require('../sharedTestData/registrationData')
const searchFolder = 'fixtures/search-folder/vue-source'
const githubAuth = registrationData.githubLoginData
process.env.E2E_SEARCH_PATH = path.join(__dirname, `../${searchFolder}`)

describe.skip('Github Auth', function() {
  beforeEach(utils.beforeEach)
  afterEach(utils.afterEach)

  it('Logs authenticated user into GitHub.com', function() {
    const { client } = this.app
    return client

      .click('[data-e2e="OnboardingStage-wizard-start"]')

      .click('[data-e2e="OnboardingStage-select-folder-button"]')
      .click('[data-e2e="OnboardingStage-skip-hotkey"]')

      .click('[data-e2e="TheSearchBar-goToUserSettings"]')
      .execute(() => {
        document
          .querySelector('[data-e2e="ViewPaneUserSettings-GitHub Settings"]')
          .dispatchEvent(new Event('click'))
      })

      .setValue('[data-e2e="GithubSettings-user"]', githubAuth.user)
      .setValue('[data-e2e="GithubSettings-password"]', githubAuth.password)
      .keys(['Enter'])
      .waitUntil(
        () =>
          client.getText(
            '[data-e2e="ViewPaneUserSettingsGithubSettings-githubLogin"]'
          ),
        2000
      )
      .then(username => {
        expect(username).to.not.equal('')
      })
  })
  it('Logs authenticated user out of GitHub.com', function() {
    const { client } = this.app
    return client

      .click('[data-e2e="OnboardingStage-wizard-start"]')

      .click('[data-e2e="OnboardingStage-select-folder-button"]')
      .click('[data-e2e="OnboardingStage-skip-hotkey"]')

      .click('[data-e2e="TheSearchBar-goToUserSettings"]')
      .execute(() => {
        document
          .querySelector('[data-e2e="ViewPaneUserSettings-GitHub Settings"]')
          .dispatchEvent(new Event('click'))
      })
      .setValue('[data-e2e="GithubSettings-user"]', githubAuth.user)
      .setValue('[data-e2e="GithubSettings-password"]', githubAuth.password)
      .keys(['Enter'])
      .waitUntil(
        () =>
          client.getText(
            '[data-e2e="ViewPaneUserSettingsGithubSettings-githubUsername"]'
          ),
        2000
      )
      .waitUntil(
        () =>
          client.click(
            '[data-e2e="ViewPaneUserSettingsGithubSettings-signOutButton"]'
          ),
        5000
      )
      .waitUntil(
        () =>
          client.getText(
            '[data-e2e="ViewPaneUserSettingsGithubSettings-signInText"]'
          ),
        5000
      )
      .then(text => {
        expect(text).to.equal(
          'Sign in to your GitHub.com account to search your repositories as well as other public repositories.'
        )
      })
  })
  it('Authenticates GitHub Enterprise user with personal access token', function() {
    const { client } = this.app
    return client
      .click('[data-e2e="PrivacyPolicyModal-agree"]')
      .click('[data-e2e="OnboardingStage-wizard-start"]')

      .click('[data-e2e="OnboardingStage-select-folder-button"]')
      .click('[data-e2e="OnboardingStage-skip-hotkey"]')

      .click('[data-e2e="TheSearchBar-goToUserSettings"]')
      .execute(() => {
        document
          .querySelector('[data-e2e="ViewPaneUserSettings-GitHub Settings"]')
          .dispatchEvent(new Event('click'))
      })

      .click(
        '[data-e2e="ViewPaneUserSettingsGithubSettings-signInEnterpriseButton"]'
      )
      .setValue(
        '[data-e2e="GitHubEnterpriseSignInModal-enterpriseHostAddress"]',
        githubAuth.enterpriseHostAddress
      )
      .click(
        '[data-e2e="GitHubEnterpriseSignInModal-validateHostAddressButton"]'
      )
      .setValue(
        '[data-e2e="GitHubEnterpriseSignInModal-personalAccessToken"]',
        githubAuth.enterpriseAccessToken
      )
      .click(
        '[data-e2e="GitHubEnterpriseSignInModal-validatePersonalAccessToken"]'
      )

      .waitUntil(
        () =>
          client.getText(
            '[data-e2e="ViewPaneUserSettingsGithubSettings-githubEnterpriseLogin"]'
          ),
        2000
      )
      .then(username => {
        expect(username).to.not.equal('')
      })
  })
})
