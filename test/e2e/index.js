'use strict'

const path = require('path')

// Download chromedriver if it's not already installed
const electronChromedriverPath = path.resolve(
  __dirname,
  '../../node_modules/electron-chromedriver'
)
const electronChromedriverBinPath = path.resolve(
  electronChromedriverPath,
  'bin'
)

const fs = require('fs')
if (!fs.existsSync(electronChromedriverBinPath)) {
  const execSync = require('child_process').execSync
  const downloadChromedriverPath = path.resolve(
    electronChromedriverPath,
    'download-chromedriver.js'
  )
  execSync(`node ${downloadChromedriverPath}`)
}

// Attach Chai APIs to global scope
const { expect } = require('chai')
global.expect = expect

// Require all JS files in `./specs` for Mocha to consume
require('require-dir')('./specs')
