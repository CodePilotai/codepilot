const find = require('lodash/find')
const utils = require('../utils')
const path = require('path')
const registrationData = require('../sharedTestData/registrationData')
const githubAuth = registrationData.githubLoginData
const searchFolder = 'fixtures/search-folder/vue-source'
process.env.E2E_SEARCH_PATH = path.join(__dirname, `../${searchFolder}`)

describe.skip('Github Code Search', function() {
  beforeEach(utils.beforeEach)
  afterEach(utils.afterEach)
  it('Searches Github for console.log without any console errors', function() {
    const { client } = this.app
    return (
      client

        .click('[data-e2e="OnboardingStage-wizard-start"]')

        .click('[data-e2e="OnboardingStage-select-folder-button"]')
        .click('[data-e2e="OnboardingStage-skip-hotkey"]')

        .waitUntil(function() {
          return client.click('[data-e2e="TheSearchBar-goToUserSettings"]')
        }, 10000)
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
        .setValue('[ data-e2e="TheSearchBar-input"]', 'console.log')
        .keys(['Enter'])
        .keys(['Enter'])
        // get render process logs
        .waitUntil(function() {
          return client.getRenderProcessLogs()
        }, 10000)
        .then(logs => {
          // check to see if the logs contain an error
          expect(find(logs, { level: 'ERROR' })).to.equal(undefined)
        })
    )
  })
  it('Searches Github Enterprise for Vue.use without any console errors', function() {
    const { client } = this.app
    return (
      client

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
        .setValue('[ data-e2e="TheSearchBar-input"]', 'Vue.use')
        .keys(['Enter'])
        .keys(['Enter'])
        // get render process logs
        .waitUntil(function() {
          return client.getRenderProcessLogs()
        }, 10000)
        .then(logs => {
          // check to see if the logs contain an error
          expect(find(logs, { level: 'ERROR' })).to.equal(undefined)
        })
    )
  })
})
