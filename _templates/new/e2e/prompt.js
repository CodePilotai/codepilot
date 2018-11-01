module.exports = [
  {
    type: 'input',
    name: 'name',
    message: 'Name:',
    validate(value) {
      if (!value.length) {
        return 'e2e tests must have a name.'
      }
      return true
    }
  }
]
