const requireDirective = require.context('.', false, /\.js$/)
requireDirective.keys().forEach(key => {
  if (key !== './index.js') {
    requireDirective(key)
  }
})
