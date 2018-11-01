const services = require('./services.config')

const sharedVars = {
  'process.env.SPECTRON': process.env.SPECTRON
}

// Any environment variables that you will need to access in electron's main process (any files under 'src/main')
// get exported here.
module.exports.main = {
  ...sharedVars
}

// Any environment variables that you will need to access in electron's renderer process (any files under 'src/renderer')
// get exported here.
module.exports.renderer = {
  ...sharedVars,
  'process.env.YOUTUBE_ACTIVE': services.youtube.active,
  'process.env.YOUTUBE_API_KEY': process.env.YOUTUBE_API_KEY
    ? '"' + process.env.YOUTUBE_API_KEY + '"'
    : services.youtube.key,
  'process.env.GITHUB_ACTIVE': services.github.active,
  'process.env.GITHUB_CLIENT_ID': process.env.GITHUB_CLIENT_ID
    ? '"' + process.env.GITHUB_CLIENT_ID + '"'
    : services.github.client,
  'process.env.GITHUB_CLIENT_SECRET': process.env.GITHUB_CLIENT_SECRET
    ? '"' + process.env.GITHUB_CLIENT_SECRET + '"'
    : services.github.secret,
  'process.env.STACKOVERFLOW_ACTIVE': services.stackoverflow.active,
  'process.env.STACKOVERFLOW_API_KEY': process.env.STACKOVERFLOW_API_KEY
    ? '"' + process.env.STACKOVERFLOW_API_KEY + '"'
    : services.stackoverflow.key,
  'process.env.SEARCHCODE_ACTIVE': services.searchcode.active,
  'process.env.LOCAL_ACTIVE': services.local.active,
  'process.env.RANKER_ACTIVE': services.ranker.active
}
