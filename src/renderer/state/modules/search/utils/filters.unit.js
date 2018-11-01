import {
  createExactMatchFilter,
  createIncludeExcludeFilter,
  createDependencyFilter,
  createLicenseFilter
} from './filters'
import ExactMatchFilterComponent from '@components/exact-match-filter'
import DependencyFilterComponent from '@components/dependency-filter'
import LicenseFilterComponent from '@components/license-filter'
import IncludeExcludeFilterComponent from '@components/include-exclude-filter'

describe('@state/modules/search/utils/filters', () => {
  const state = {
    query: {
      text: 'vue',
      includeOnly: '.vue',
      exclude: ''
    },
    onlyExactResults: true,
    allowResultsWithoutDeps: false,
    requireAllDependenciesToBeFound: true,
    githubResultsDependencies: [
      { checked: true, name: 'vue ^2.5.0' },
      { checked: false, name: 'axios ^1.0' },
      { checked: true, name: 'vue-multiselect ^2.0' }
    ]
  }

  const codeSource = {
    service: 'code',
    exactFilter: (file, query) => file.body.includes(query.text)
  }

  const result = {
    body: 'has vue',
    path: 'catalog/name.vue',
    packageName: 'vue-app',
    dependencies: {
      vue: '^2.5.0',
      'vue-multiselect': '^2.0'
    },
    devDependencies: {
      webpack: '4.0.0'
    }
  }

  describe('createExactMatchFilter', () => {
    const filter = createExactMatchFilter({
      ignoreServices: ['web']
    })
    const filterWithState = filter.test(state)

    it('should return a valid filter structure', () => {
      expect(filter.component).toEqual(ExactMatchFilterComponent)
      expect(filter.test).toBeInstanceOf(Function)
    })

    it('should return true for results containing the query', () => {
      expect(filterWithState(result, codeSource)).toEqual(true)
    })

    it('should return false for results not containing the query', () => {
      expect(filterWithState(result, codeSource)).toEqual(true)
    })

    it('should return true for ignored services', () => {
      const webSource = {
        service: 'web',
        exactFilter: jest.fn()
      }
      expect(filterWithState(result, webSource)).toEqual(true)
      expect(webSource.exactFilter).toHaveBeenCalledTimes(0)
    })
  })

  describe('createLicenseFilter', () => {
    const filter = createLicenseFilter({
      ignoreServices: ['web']
    })

    const noLicenseResult = {
      body: 'has vue',
      repo: {
        license: null
      }
    }

    it('should return a valid filter structure', () => {
      expect(filter.component).toEqual(LicenseFilterComponent)
    })

    describe('when allowResultsWithoutLicense is true', () => {
      const filterWithModifiedState = filter.test({
        ...state,
        allowResultsWithoutLicense: true
      })

      it('should return true for results not containing license information', () => {
        expect(filterWithModifiedState(noLicenseResult, codeSource)).toEqual(
          true
        )
      })
    })
  })

  describe('createDependencyFilter', () => {
    const filter = createDependencyFilter({
      ignoreServices: ['web']
    })
    const filterWithState = filter.test(state)

    const missingDepsResult = {
      body: 'has vue',
      packageName: 'vue-app',
      dependencies: {
        'vue-multiselect': '^2.0'
      },
      devDependencies: {
        webpack: '4.0.0'
      }
    }

    const noDepsResult = {
      body: 'has vue',
      packageName: null,
      dependencies: null,
      devDependencies: null
    }

    it('should return a valid filter structure', () => {
      expect(filter.component).toEqual(DependencyFilterComponent)
    })

    describe('when allowResultsWithoutDeps is true', () => {
      const filterWithModifiedState = filter.test({
        ...state,
        allowResultsWithoutDeps: true,
        requireAllDependenciesToBeFound: false
      })

      it('should return true for results not containing deps information', () => {
        expect(filterWithModifiedState(noDepsResult, codeSource)).toEqual(true)
      })
    })

    describe('when requireAllDependenciesToBeFound is true', () => {
      it('should return true for results containing all selected deps', () => {
        expect(filterWithState(result, codeSource)).toEqual(true)
      })

      it('should return false for results not containing all selected deps', () => {
        expect(filterWithState(missingDepsResult, codeSource)).toEqual(false)
      })
    })

    describe('when requireAllDependenciesToBeFound is false', () => {
      const filterWithModifiedState = filter.test({
        ...state,
        requireAllDependenciesToBeFound: false
      })

      it('should return true for results containing all selected deps', () => {
        expect(filterWithModifiedState(result, codeSource)).toEqual(true)
      })

      it('should return true for results containing at least 1 selected dep', () => {
        expect(filterWithModifiedState(missingDepsResult, codeSource)).toEqual(
          true
        )
      })

      it('should return false for results not containing at least 1 selected dep', () => {
        expect(filterWithModifiedState(noDepsResult, codeSource)).toEqual(false)
      })
    })
  })

  describe('createIncludeExcludeFilter', () => {
    const filter = createIncludeExcludeFilter({
      ignoreServices: ['web']
    })
    const filterWithState = filter.test(state)

    it('should return a valid filter structure', () => {
      expect(filter.component).toEqual(IncludeExcludeFilterComponent)
    })

    describe('when includeOnly exists', () => {
      it('should return true for results that include the includeOnly query in filename', () => {
        expect(filterWithState(result, codeSource)).toEqual(true)
      })

      it('should return false for results that do not include the includeOnly query in filename', () => {
        const modifiedResult = {
          ...result,
          path: 'catalog/file.js'
        }

        expect(filterWithState(modifiedResult, codeSource)).toEqual(false)
      })
    })

    describe('when exclude exists', () => {
      const filterWithModifiedState = filter.test({
        ...state,
        query: {
          ...state.query,
          includeOnly: '',
          exclude: '.vue'
        }
      })

      it('should return false for results that include the exclude query in filename', () => {
        expect(filterWithModifiedState(result, codeSource)).toEqual(false)
      })

      it('should return true for results that do not include the includeOnly query in filename', () => {
        const modifiedResult = {
          ...result,
          path: 'catalog/file.js'
        }

        expect(filterWithModifiedState(modifiedResult, codeSource)).toEqual(
          true
        )
      })
    })
  })
})
