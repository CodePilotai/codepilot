const utils = require('../utils')

describe('Launch', function() {
  beforeEach(utils.beforeEach)
  afterEach(utils.afterEach)

  it('shows the correct starting application title', function() {
    return this.app.client.getTitle().then(title => {
      expect(title).to.equal('CodePilot.ai')
    })
  })
})
