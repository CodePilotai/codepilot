const path = require('path')

function resolveSrc(_path) {
  return path.join(__dirname, _path)
}

const aliases = {
  '@assets': 'src/renderer/assets',
  '@components': 'src/renderer/components',
  '@split-tests': 'src/split-tests',
  '@branding': 'src/renderer/branding.scss',
  '@helpers': 'src/renderer/helpers',
  '@state': 'src/renderer/state',
  '@search': 'src/search',
  '@services': 'src/services',
  '@themes': 'src/themes'
}

module.exports = {
  webpack: {},
  jest: {}
}

for (const alias in aliases) {
  const aliasTo = aliases[alias]
  module.exports.webpack[alias] = resolveSrc(aliasTo)
  if (/\.s?css$/.test(aliasTo)) {
    module.exports.jest[`^${alias}$`] =
      '<rootDir>/test/unit/__mocks__/empty-object'
  } else {
    const aliasHasExtension = /\.\w+$/.test(aliasTo)
    module.exports.jest[`^${alias}$`] = aliasHasExtension
      ? `<rootDir>/${aliasTo}`
      : `<rootDir>/${aliasTo}/index.js`
    module.exports.jest[`^${alias}/(.*)$`] = `<rootDir>/${aliasTo}/$1`
  }
}
