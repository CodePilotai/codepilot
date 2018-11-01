import { sep } from 'path'
import flatten from 'lodash/flatten'
import DependencyFilterComponent from '@components/dependency-filter'
import IncludeExcludeFilterComponent from '@components/include-exclude-filter'
import ExactMatchFilterComponent from '@components/exact-match-filter'
import LicenseFilterComponent from '@components/license-filter'

function createFilter({ filter, ignoreServices, component }) {
  const test = state => (result, source) => {
    if (ignoreServices.includes(source.service)) return true

    return filter(result, state, source)
  }

  return {
    test,
    component
  }
}

export const createExactMatchFilter = options => {
  return createFilter({
    component: ExactMatchFilterComponent,
    filter: exactMatchFilter,
    ...options
  })
}

export const createIncludeExcludeFilter = options => {
  return createFilter({
    component: IncludeExcludeFilterComponent,
    filter(result, state) {
      return [includeFilter, excludeFilter].every(filter =>
        filter(result, state)
      )
    },
    ...options
  })
}

export const createDependencyFilter = options => {
  return createFilter({
    component: DependencyFilterComponent,
    filter: dependencyFilterTest,
    ...options
  })
}

export const createLicenseFilter = options => {
  return createFilter({
    component: LicenseFilterComponent,
    filter: licenseFilterTest,
    ...options
  })
}

function exactMatchFilter(result, state, source) {
  return !state.onlyExactResults || source.exactFilter(result, state.query)
}

function includeFilter(result, state) {
  if (!state.query.includeOnly.length) return true

  const fileName = result.path.split(sep).pop()

  const includeStrings = getStrings(state.query.includeOnly)

  return includeStrings.length
    ? includeStrings.some(string => fileName.includes(string))
    : true
}

function excludeFilter(result, state) {
  if (!state.query.exclude.length) return true

  const fileName = result.path.split(sep).pop()

  const excludeStrings = getStrings(state.query.exclude)

  return excludeStrings.length
    ? excludeStrings.every(string => !fileName.includes(string))
    : true
}

function dependencyFilterTest(result, state) {
  if (
    state.allowResultsWithoutDeps &&
    !result.packageName &&
    !result.dependencies &&
    !result.devDependencies
  ) {
    return true
  }

  if (!state.githubResultsDependencies.length) return true

  // Combine all dependencies
  const combinedResultDeps = getDependenciesList(
    result.dependencies,
    result.devDependencies
  )

  // Filter and map to get only selected dependency names
  const requiredDeps = state.githubResultsDependencies
    .filter(dep => dep.checked)
    .map(dep => dep.name)

  if (!requiredDeps.length) return true

  // Check if the result contains dependencies
  // either all or at least one
  return state.requireAllDependenciesToBeFound
    ? hasAllDependencies(requiredDeps, combinedResultDeps)
    : hasAtLeastOneDependency(requiredDeps, combinedResultDeps)
}

function licenseFilterTest(result, state) {
  if (state.allowResultsWithoutLicense && !result.repo.license) return true

  if (!state.resultsLicenses.length) return true

  // Filter and map to get only the selected license names
  const requiredLicenses = state.resultsLicenses
    .filter(license => license.checked)
    .map(license => license.name)

  if (!requiredLicenses.length) return true

  return requiredLicenses.includes(result.repo.license)
}

function hasAllDependencies(requiredDeps, resultDeps) {
  return requiredDeps.every(dep => Object.values(resultDeps).includes(dep))
}

function hasAtLeastOneDependency(requiredDeps, resultDeps) {
  return requiredDeps.some(dep => Object.values(resultDeps).includes(dep))
}

function getStrings(query) {
  return query
    .split(',')
    .map(string => string.trim())
    .filter(string => string.length && string !== '.')
}

function getDependenciesList(...dependenciesGroups) {
  return flatten(
    dependenciesGroups.map(dependencies =>
      Object.keys(dependencies || {}).map(
        dependency => `${dependency} ${dependencies[dependency]}`
      )
    )
  )
}
