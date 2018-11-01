const electron = require('electron')
const { Application } = require('spectron')
const path = require('path')

const timeout = 40000

module.exports = {
  beforeEach() {
    this.timeout(timeout)
    this.app = new Application({
      path: electron,
      // entry point to begin electron process
      args: [
        path.resolve(__dirname, '../../dist_electron/bundled/background.js')
      ],
      startTimeout: timeout,
      waitTimeout: timeout
    })

    return this.app.start().then(() => {
      this.app.client.timeouts('implicit', timeout)
    })
  },
  afterEach() {
    this.timeout(timeout)
    if (this.app && this.app.isRunning()) {
      return this.app.stop()
    }
  }
}
