const utils = require('../utils')
const path = require('path')
const searchFolder = 'fixtures/search-folder/vue-source'
process.env.E2E_SEARCH_PATH = path.join(__dirname, `../${searchFolder}`)

// Settings must be cleared when Onboarding UI tests are run

describe('Onboarding UI', function() {
  beforeEach(utils.beforeEach)
  afterEach(utils.afterEach)

  it('Clicking "Click to Continue" button loads select folder onboarding step', function() {
    const { client } = this.app
    return client
      .click('[data-e2e="OnboardingStage-wizard-start"]')
      .isExisting('[ data-e2e="OnboardingWizardSelectFolder-title"]')
      .then(tagline => {
        expect(tagline).to.equal(true)
      })
  })

  it('Selecting dev languages and clicking "next" button loads select folder onboarding phase', function() {
    const { client } = this.app
    return client
      .click('[data-e2e="OnboardingStage-wizard-start"]')
      .getText('[data-e2e="OnboardingWizardSelectFolder-title"]')
      .then(title => {
        expect(title).to.equal('Local Search')
      })
  })
  it('Clicking "Select my code folder" button loads set hotkey onboarding phase', function() {
    const { client } = this.app
    return client
      .click('[data-e2e="OnboardingStage-wizard-start"]')
      .click('[data-e2e="OnboardingStage-select-folder-button"]')
      .getText('[data-e2e="OnboardingWizardSetToggleHotkey-title"]')
      .then(title => {
        expect(title).to.equal('Set Toggle Hotkey')
      })
  })
})
