const path = require('path')
const utils = require('../utils')
const searchFolder = 'fixtures/search-folder/vue-source'
process.env.E2E_SEARCH_PATH = path.join(__dirname, `../${searchFolder}`)
describe('Minified File Search', function() {
  beforeEach(utils.beforeEach)
  afterEach(utils.afterEach)
  it("Should return no Local results for query 'function'", function() {
    const { client } = this.app
    return client
      .click('[data-e2e="OnboardingStage-wizard-start"]')
      .click('[data-e2e="OnboardingStage-select-folder-button"]')
      .click('[data-e2e="OnboardingStage-skip-hotkey"]')
      .setValue('[data-e2e="TheSearchBar-input"]', 'function')
      .setValue('[data-e2e="TheSearchBar-input"]', 'function')
      .keys(['Enter'])
      .keys(['Enter'])
      .waitUntil(
        () =>
          client.getText(
            '[data-e2e="SearchResultsFormatListGroup-Personal Repo"]'
          ),
        4000
      )
      .then(searchResultsCountText => {
        expect(searchResultsCountText).to.equal('Personal Repo - 0 results')
      })
  })
})
