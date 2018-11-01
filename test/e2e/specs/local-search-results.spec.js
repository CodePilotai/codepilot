const find = require('lodash/find')
const path = require('path')
const utils = require('../utils')
const searchFolder = 'fixtures/search-folder/vue-source'
process.env.E2E_SEARCH_PATH = path.join(__dirname, `../${searchFolder}`)
describe('Local search', function() {
  beforeEach(utils.beforeEach)
  afterEach(utils.afterEach)
  it('Local search runs without any console errors', function() {
    const { client } = this.app
    return (
      client
        .click('[data-e2e="OnboardingStage-wizard-start"]')
        .click('[data-e2e="OnboardingStage-select-folder-button"]')
        .click('[data-e2e="OnboardingStage-skip-hotkey"]')
        .setValue('[data-e2e="TheSearchBar-input"]', 'data')
        .setValue('[data-e2e="TheSearchBar-input"]', 'data')
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

  it('Searching vue-source for word "data" yields 2 results', function() {
    const { client } = this.app
    return (
      client
        .click('[data-e2e="OnboardingStage-wizard-start"]')
        .click('[data-e2e="OnboardingStage-select-folder-button"]')
        .click('[data-e2e="OnboardingStage-skip-hotkey"]')
        .setValue('[data-e2e="TheSearchBar-input"]', 'data')
        .setValue('[data-e2e="TheSearchBar-input"]', 'data')
        .keys(['Enter'])
        .keys(['Enter'])
        .waitUntil(() =>
          client.getText(
            '[data-e2e="SearchResultsFormatListGroup-Local"]',
            4000
          )
        )
        // Confirm that there are 2 results for `data` in vue-source directory
        .then(resultDisplay => {
          expect(resultDisplay).to.equal('Local - 2 results')
        })
    )
  })

  it('Displaying "result" when 1 result is found', function() {
    const { client } = this.app
    return (
      client
        .click('[data-e2e="OnboardingStage-wizard-start"]')
        .click('[data-e2e="OnboardingStage-select-folder-button"]')
        .click('[data-e2e="OnboardingStage-skip-hotkey"]')
        .setValue('[data-e2e="TheSearchBar-input"]', 'computed')
        .setValue('[data-e2e="TheSearchBar-input"]', 'computed')
        // Hit enter
        .keys(['Enter'])
        .keys(['Enter'])
        .waitUntil(() =>
          client.getText(
            '[data-e2e="SearchResultsFormatListGroup-Local"]',
            4000
          )
        )
        .then(resultsDisplay => {
          expect(resultsDisplay).to.equal('Local - 1 result')
        })
    )
  })

  it('Regex search for valid hex values yields 2 results', function() {
    const { client } = this.app
    return client
      .click('[data-e2e="OnboardingStage-wizard-start"]')
      .click('[data-e2e="OnboardingStage-select-folder-button"]')
      .click('[data-e2e="OnboardingStage-skip-hotkey"]')
      .setValue('[data-e2e="TheSearchBar-input"]', '#?([a-f0-9]{6})')
      .setValue('[data-e2e="TheSearchBar-input"]', '#?([a-f0-9]{6})')
      .click('[data-e2e="AppInputText-Use regex"]')
      .click('[ data-e2e="TheSearchBar-searchInput"]')
      .keys(['Enter'])
      .keys(['Enter'])
      .waitUntil(() =>
        client.getText('[data-e2e="SearchResultsFormatListGroup-Local"]', 4000)
      )
      .then(resultsDisplay => {
        expect(resultsDisplay).to.equal('Local - 2 results')
      })
  })
})
