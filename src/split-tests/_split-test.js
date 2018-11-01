import path from 'path'
import settings from 'electron-settings'
import sample from 'lodash/sample'
import isEqual from 'lodash/isEqual'
import camelCase from 'lodash/camelCase'

export default ({ key, hypotheses }) => {
  const keyPath = camelCase(path.basename(key))
  // Where in settings the test will be saved
  const testPath = `splitTest.${keyPath}`
  // Check if we've already saved this test
  const savedTest = settings.get(testPath)
  // If we've saved the test, using the same hypotheses...
  if (savedTest && isEqual(savedTest.hypotheses, hypotheses)) {
    // Return the value that was saved, ensuring that
    // each user will always see the same result.
    return savedTest.hypothesis
  } else {
    // Pick a random hypothesis
    const hypothesis = chooseHypothesis({ key, hypotheses })
    // Save random value for this test in settings
    settings.set(testPath, { hypotheses, hypothesis })

    // Return the random hypothesis
    return hypothesis
  }
}

// Guarantees that all exported hypotheses contain
// a valid `name` and `value` property.
function chooseHypothesis({ key, hypotheses }) {
  const hypothesis = {}
  const hypothesesIsArray = Array.isArray(hypotheses)

  hypothesis.name = sample(
    hypothesesIsArray ? hypotheses : Object.keys(hypotheses)
  )

  if (hypothesesIsArray) {
    hypothesis.value = hypothesis.name
  } else {
    hypothesis.value = hypotheses[hypothesis.name]
  }

  return hypothesis
}
