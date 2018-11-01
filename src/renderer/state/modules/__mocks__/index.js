import camelCase from 'lodash/camelCase'
import path from 'path'
import fs from 'fs'

const modules = {}

fs
  .readdirSync(path.join(__dirname, '..'))
  .filter(fileName => fileName !== 'index.js' && /\.js$/.test(fileName))
  .forEach(fileName => {
    modules[camelCase(fileName.replace(/\.js/, ''))] = require(path.join(
      '..',
      fileName
    )).default
  })

export default modules
