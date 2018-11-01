const find = require('lodash/find')
const utils = require('../utils')
const path = require('path')
const searchFolder = 'fixtures/search-folder/vue-source'
process.env.E2E_SEARCH_PATH = path.join(__dirname, `../${searchFolder}`)
describe('StackOverflow search', function() {
  beforeEach(utils.beforeEach)
  afterEach(utils.afterEach)
  it('Searches StackOverflow without any errors in console', function() {
    const { client } = this.app
    return (
      client
        .click('[data-e2e="OnboardingStage-wizard-start"]')
        .click('[data-e2e="OnboardingStage-select-folder-button"]')
        .click('[data-e2e="OnboardingStage-skip-hotkey"]')
        .setValue('[data-e2e="TheSearchBar-input"]', 'data')
        .setValue('[data-e2e="TheSearchBar-input"]', 'data')
        // Hit enter
        .keys(['Enter'])
        .keys(['Down arrow'])
        .keys(['Enter'])
        // get render process logs
        .getRenderProcessLogs()
        .then(logs => {
          // check to see if the logs contain an error
          expect(find(logs, { level: 'ERROR' })).to.equal(undefined)
        })
    )
  })
  it('Searches StackOverflow for "Passing props" and returns results', function() {
    const { client } = this.app
    return (
      client
        .click('[data-e2e="OnboardingStage-wizard-start"]')
        .click('[data-e2e="OnboardingStage-select-folder-button"]')
        .click('[data-e2e="OnboardingStage-skip-hotkey"]')
        .setValue('[data-e2e="TheSearchBar-input"]', 'Passing props')
        .setValue('[data-e2e="TheSearchBar-input"]', 'Passing props')
        // Hit enter
        .keys(['Enter'])
        .keys(['Down arrow'])
        .keys(['Enter'])
        .getText('[data-e2e="SearchResultsFormatListGroup-Stack Overflow"]')
        .then(resultDisplay => expect(resultDisplay).to.not.equal('0 results'))
    )
  })
})
