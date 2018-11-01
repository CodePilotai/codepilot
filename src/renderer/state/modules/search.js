import Vue from 'vue'
import compact from 'lodash/compact'
import groupBy from 'lodash/groupBy'
import flatten from 'lodash/flatten'
import uniq from 'lodash/uniq'
import uniqBy from 'lodash/uniqBy'
import flow from 'lodash/flow'
import orderBy from 'lodash/orderBy'
import settings from 'electron-settings'
import search from '@search'
import branding from '@branding'
import temp from 'temp'
import searchIntents from './search/intents'
import createEmptySourceResults from './search/utils/create-empty-source-results'
import mergeSearchStatuses from './search/utils/merge-search-statuses'
import flattenResults from './search/utils/flatten-results'
import getSourceKeysForResults from './search/utils/get-source-keys-for-results'
import rankResults from './search/utils/rank-results'
import { Observable } from 'rxjs'
import cuid from 'cuid'
import startIpcAdapter from '@search/ipc-adapter'
import escapeHtml from 'escape-html'
// import findLocalProjects from '@search/local-projects'

let searchSubscriptions = []
// Delay to wait in the instance of a super fast search
const synchSearchDelay = 5000
// Constant for a delay as a promise
const delay = time => new Promise(resolve => setTimeout(resolve, time))

const MAX_PAGES_TO_FOLLOW_UP = 3

const defaultSearchSuggestions = [
  { text: 'How to center a DIV', selectedSearchIntentKey: 'learnResults' },
  { text: 'text-overflow: ellipsis', selectedSearchIntentKey: 'codeResults' },
  {
    text: 'How to loop over an array javascript',
    selectedSearchIntentKey: 'learnResults'
  }
]

const resultFileReader = startIpcAdapter('file-reader')

export default {
  state: {
    query: {
      text: '',
      queryId: '',
      matchWholeWord: false,
      useRegex: false,
      projectDirectories:
        (settings.get('search.query') &&
          settings.get('search.query').projectDirectories) ||
        [],
      recentProjectDirectories: [],
      includeOnly: '',
      exclude: '',
      parsed: '',
      types: {
        file: true,
        commit: true,
        issue: true
      },
      selectedSearchIntentKey: searchIntents[0].key
    },
    submittedQuery: {},
    recentQueries:
      settings.get('search.recentQueries') || defaultSearchSuggestions,
    results: createEmptySourceResults(),
    customSources: null,
    searchIntents: sortIntents(
      searchIntents,
      settings.get('search.sourcesOrder')
    ),
    errors: [],
    isFullWindow: true,
    onlyExactResults: false,
    shouldRankResults: settings.get('search.shouldRankResults') || true,
    localProjects: [],
    resultsGroupsScores: {},
    githubResultsDependencies: [],
    resultsLicenses: [],
    allowResultsWithoutLicense: true,
    allowResultsWithoutDeps: true,
    requireAllDependenciesToBeFound: false,
    selectedResult: {}
  },
  getters: {
    matchingRecentQuery: (state, getters) => {
      return state.recentQueries.find(
        recentQuery => recentQuery.text === state.query.text
      )
    },
    filtersActive: (state, getters, rootState) => {
      return (
        getters.selectedTabSearchResults.items.length <
        getters.selectedTabSearchResultsUnfiltered.items.length
      )
    },
    selectedSearchIntent: state => {
      return state.searchIntents.find(
        intent => intent.key === state.query.selectedSearchIntentKey
      )
    },
    selectedTabSearchResultsUnfiltered: (state, getters, rootState) => {
      // Use this getter to get unfiltered results OR pins based on active tab on the sidebar
      const sidebarActiveTab = rootState.interface.sidebar.activeTab

      if (sidebarActiveTab === 'Pins') {
        return {
          items: rootState.pins.results,
          resultsCount: flattenResults(rootState.pins.results).length,
          meta: {
            status: 'complete'
          }
        }
      }

      return getters.searchResultsUnfiltered
    },
    selectedTabSearchResults: (state, getters, rootState) => {
      // Use this getter to get results OR pins based on active tab on the sidebar
      const unfilteredResults = getters.selectedTabSearchResultsUnfiltered

      if (rootState.interface.sidebar.activeTab === 'Pins') {
        return unfilteredResults
      }

      return getters.searchResults
    },
    searchResultsUnfiltered(state, getters, rootState) {
      // Use this getter to get unfiltered results only
      const searchIntent = getters.selectedSearchIntent
      const items = flow(
        sources =>
          sources.map(source => {
            const sourceItems = state.results[source.storeKey].items

            return sourceItems
          }),
        flatten,
        results => uniqBy(results, 'key'),
        results =>
          results.map(
            result =>
              rootState.pins.results.find(
                pinnedResult => pinnedResult.key === result.key
              ) || result
          )
      )(searchIntent.sources)

      const durationInSeconds = searchIntent.sources
        .map(source => state.results[source.storeKey].meta.durationInSeconds)
        .reduce((lastMax, current) => (lastMax > current ? lastMax : current))

      const status = mergeSearchStatuses(
        searchIntent.sources.map(source => source.storeKey),
        state.results
      )

      return {
        items,
        meta: {
          durationInSeconds,
          status
        },
        resultsCount: flattenResults(items).length
      }
    },
    searchResults: (state, getters, rootState) => {
      // Use this getter to get results only
      const searchIntent = getters.selectedSearchIntent
      const unfilteredResults = getters.searchResultsUnfiltered

      const filterTestsWithState = searchIntent.filters.map(filter =>
        filter.test(state)
      )

      const items = unfilteredResults.items.filter(result => {
        const resultSource = searchIntent.sources.find(
          source => source.name === result.source
        )

        return filterTestsWithState.every(test => test(result, resultSource))
      })

      return {
        ...unfilteredResults,
        items,
        resultsCount: flattenResults(items).length
      }
    },
    selectedBranch(state) {
      return state.selectedResult.selectedBranch
    },
    prevResultBranch(state, getters, rootState) {
      let prevResultBranch
      for (const resultsGroup of getters.searchResultsItemsGroups) {
        for (const result of resultsGroup.results) {
          for (const branch of result.branches) {
            if (
              state.selectedResult.key === result.key &&
              state.selectedResult.selectedBranch.key === branch.key
            ) {
              return prevResultBranch
            } else {
              prevResultBranch = {
                ...result,
                selectedBranch: branch
              }
            }
          }
        }
      }
    },
    nextResultBranch(state, getters, rootState) {
      let nextResultBranch
      const reversedSearchResultsItemsGroups = [
        ...getters.searchResultsItemsGroups
      ].reverse()
      for (const resultsGroup of reversedSearchResultsItemsGroups) {
        const reversedResults = [...resultsGroup.results].reverse()
        for (const result of reversedResults) {
          const reversedBranches = [...result.branches].reverse()
          for (const branch of reversedBranches) {
            if (
              state.selectedResult.key === result.key &&
              state.selectedResult.selectedBranch.key === branch.key
            ) {
              return nextResultBranch
            } else {
              nextResultBranch = {
                ...result,
                selectedBranch: branch
              }
            }
          }
        }
      }
    },
    searchResultsItemsGroupsUnfiltered(state, getters, rootState) {
      return groupSearchResults({
        results: getters.selectedTabSearchResultsUnfiltered,
        state,
        getters
      })
    },
    searchResultsItemsGroups(state, getters, rootState) {
      return {
        Results: groupSearchResults({
          results: getters.selectedTabSearchResults,
          state,
          getters
        }),
        Pins: getters.pinnedResultsGroups
      }[rootState.interface.sidebar.activeTab]
    },
    groupContainingSelectedResult(state, getters) {
      for (const resultsGroup of getters.searchResultsItemsGroups) {
        for (const result of resultsGroup.results) {
          if (result.key === state.selectedResult.key) {
            return resultsGroup
          }
        }
      }
    },
    sourcesList(state) {
      return state.searchIntents.reduce((sources, intent) => {
        return sources.concat(intent.sources)
      }, [])
    },
    searchStatus(state, getters) {
      return getters.selectedTabSearchResults.meta.status
    },
    unavailableSearchServices(state, getters, rootState) {
      const unavailableServices = []

      if (!rootState.internetConnection.hasInternetConnection) {
        unavailableServices.push(
          'personalRepos',
          'githubCode',
          'githubIssues',
          'githubCommit',
          'githubPullRequest',
          'stackoverflow',
          'youtube'
        )
      }
      if (!rootState.githubAuth.githubAccessToken) {
        unavailableServices.push(
          'personalRepos',
          'githubCode',
          'githubIssues',
          'githubCommit',
          'githubPullRequest'
        )
      }
      if (!rootState.githubAuth.githubEnterpriseToken) {
        unavailableServices.push('githubEnterpriseCode')
      }

      return unavailableServices
    },
    availableSearchSources(state, getters, rootState) {
      return getters.selectedSearchIntent.sources.filter(source => {
        return !getters.unavailableSearchServices.includes(source.service)
      })
    },
    shouldLoadMoreResultsForSource(state, getter) {
      return source => {
        const sourceResults = state.results[source.storeKey]
        return (
          source.canLoadMoreResults &&
          sourceResults.meta.status === 'complete' &&
          sourceResults.totalPages > sourceResults.lastSearchedPage
        )
      }
    }
  },
  mutations: {
    SET_QUERY(state, newValue) {
      state.query = newValue
    },
    SET_SUBMITTED_QUERY(state, newValue) {
      state.submittedQuery = newValue
    },
    ADD_RECENT_QUERY(state, newValue) {
      // If there are 500 or more items in our array,
      // remove the first element in the array (which
      // should be the oldest).
      if (state.recentQueries.length >= 500) {
        state.recentQueries.shift()
      }
      state.recentQueries.push(newValue)
    },
    SET_SEARCH_RESULTS(state, { storeKey, results }) {
      state.results[storeKey] = {
        ...state.results[storeKey],
        ...results
      }
    },
    PUSH_SEARCH_RESULTS(state, { storeKey, results }) {
      if (Array.isArray(results)) {
        state.results[storeKey].items.push(...results)
      } else {
        state.results[storeKey].items.push(results)
      }
    },
    SET_SELECTED_SEARCH_INTENT(state, newValue) {
      state.query.selectedSearchIntentKey = newValue.key
    },
    ADD_ERROR(state, newError) {
      state.errors.push(newError)
    },
    RESET_ERRORS(state) {
      state.errors = []
    },
    SET_IS_FULL_WINDOW(state, newValue) {
      state.isFullWindow = newValue
    },
    MERGE_QUERY_TYPES(state, typeChanges) {
      state.query.types = {
        ...state.query.types,
        ...typeChanges
      }
    },
    SET_SEARCH_INTENT_FILTER(state, { intentKey, filterLabel, newValue }) {
      state.searchIntents
        .find(searchIntent => searchIntent.key === intentKey)
        .filters.find(
          intentFilter => intentFilter.label === filterLabel
        ).value = newValue
    },
    SET_SEARCH_INTENT(state, newSearchIntent) {
      state.searchIntent = newSearchIntent
    },
    UPDATE_SOURCES_ORDER(state, { index, sources }) {
      state.searchIntents[index].sources = sources
    },
    TOGGLE_EXACT_FILTER(state, isExact) {
      state.onlyExactResults = isExact
    },
    SET_RESPONSE_META_FOR_SOURCE(
      state,
      {
        source,
        totalPages,
        rateLimitRemaining = -1,
        retryAfter = 0,
        lastSearchedPage
      }
    ) {
      state.results[source].totalPages = totalPages
      state.results[source].lastSearchedPage = lastSearchedPage
      if (rateLimitRemaining > -1 && retryAfter) {
        state.results[source].rateLimitRemaining = rateLimitRemaining
        state.results[source].retryAfter = retryAfter
      }
    },

    SET_LOCAL_DEPENDENCIES(state, projects) {
      state.localProjects = projects
    },
    SET_RESULTS_GROUP_SCORES(state, { groupName, scores }) {
      Vue.set(state.resultsGroupsScores, groupName, scores)
    },
    SET_GITHUB_CODE_RESULTS_DEPENDENCIES(state, newValue) {
      state.githubResultsDependencies = newValue
    },
    SET_RESULTS_LICENSES(state, newValue) {
      state.resultsLicenses = newValue
    },
    SET_GITHUB_CODE_DEPENDENCY_CHECKED(state, { names, checked }) {
      state.githubResultsDependencies = state.githubResultsDependencies.map(
        dependency => {
          return names.includes(dependency.name)
            ? { ...dependency, checked }
            : dependency
        }
      )
    },
    SET_LICENSE_FILTER_CHECKED(state, { names, checked }) {
      state.resultsLicenses = state.resultsLicenses.map(license => {
        return names.includes(license.name) ? { ...license, checked } : license
      })
    },
    SET_CUSTOM_SOURCES_SEARCHED(state, customSources) {
      state.customSources = customSources
    },
    UPDATE_SHOULD_RANK_RESULTS(state, newValue) {
      state.shouldRankResults = newValue
    },
    UPDATE_ALLOW_RESULTS_WITHOUT_DEPS(state, newValue) {
      state.allowResultsWithoutDeps = newValue
    },
    UPDATE_ALLOW_RESULTS_WITHOUT_LICENSES(state, newValue) {
      state.allowResultsWithoutLicense = newValue
    },
    UPDATE_DEPENDENCY_FILTER_REQUIREMENTS(state, newValue) {
      state.requireAllDependenciesToBeFound = newValue
    },
    SELECT_RESULT(state, newResult) {
      state.selectedResult = newResult
    },
    SELECT_RESULT_BRANCH(state, newBranch) {
      Vue.set(state.selectedResult, 'selectedBranch', newBranch)
    }
  },
  actions: {
    getLocalPackageJsonData({ state, commit }) {
      // if (!state.query.projectDirectories) return
      // let localProjects = []
      //
      // findLocalProjects(state.query.projectDirectories).subscribe({
      //   next: project => {
      //     localProjects.push(project)
      //   },
      //   complete: () => {
      //     commit('SET_LOCAL_DEPENDENCIES', localProjects)
      //   }
      // })
    },
    updateQuery({ commit, state, dispatch }, queryChanges) {
      const newQuery = {
        ...state.query,
        ...queryChanges
      }

      commit('SET_QUERY', newQuery)
      settings.set('search.query', newQuery)
    },
    async runSearch({ dispatch, commit, state, rootState, getters }) {
      const { query } = state

      // Dispose of any currently running subscriptions
      searchSubscriptions.forEach(subscription => subscription.unsubscribe())
      dispatch('resetGithubResultsDependencies')
      dispatch('updateSidebarActiveTab', 'Results')

      // Never run a search if the query text is blank
      if (!query.text) {
        const searchInput = document.getElementById('SearchForm-searchInput')
        if (searchInput) {
          searchInput.focus()
        }
        return
      }

      // ===
      // ACTUALLY RUNNING THE SEARCH BEYOND THIS POINT
      // ===

      // Give the current query an id
      dispatch('updateQuery', {
        queryId: cuid(),
        query: state.query.text
      })

      // Reset to No Results View to dispose previously selected result in view pane
      dispatch('updateViewable', { type: 'noResults' })

      dispatch('setCustomSources')

      // Blur any focused editables
      const focusedEditable = await dispatch('getFocusedEditable')
      if (focusedEditable) {
        focusedEditable.blur()
      }

      if (state.isFullWindow) {
        await dispatch('updateSearchIsFullWindow', false)
      }

      // Add search value to the recent searches array when the search has been
      commit('SET_SUBMITTED_QUERY', state.query)
      dispatch('addRecentQuery', state.submittedQuery)

      getters.availableSearchSources.forEach(search => {
        // Reset all search results and set pending status
        commit(`SET_SEARCH_RESULTS`, {
          storeKey: search.storeKey,
          results: {
            meta: {
              status: 'pending',
              durationInSeconds: 0
            },
            items: []
          }
        })

        commit('SET_RESPONSE_META_FOR_SOURCE', {
          source: search.storeKey,
          totalPages: 1,
          lastSearchedPage: 0
        })
      })
      commit('RESET_ERRORS')

      // Clean up any temporary files we downloaded from
      // a previous search, before starting a new one.
      const waitForCleanup = () => new Promise(resolve => temp.cleanup(resolve))
      await waitForCleanup()

      // Collect the searches we'd like to run synchronously
      // (one after another) to avoid hitting API abuse limits.
      const synchronousSearches = getters.availableSearchSources.filter(
        source => source.service.includes('githubCode', 'personalRepos')
      )

      // Run all the normal searches asynchronously (simultaneously).
      const asyncSearches = getters.availableSearchSources
        .filter(
          source =>
            !synchronousSearches.find(
              syncSource => syncSource.service === source.service
            )
        )
        .map(source => {
          return dispatch('runSearchForSource', source)
        })

      // Create a query key so that we can bail the current search
      // if the user has since submitted a new query.
      const startingQueryKey = JSON.stringify(state.submittedQuery)

      // Run the synchronous searches one at a time.
      for (const [index, source] of synchronousSearches.entries()) {
        const startAfter = state.results[source.storeKey].retryAfter
        const abuseLimitDelay = startAfter - new Date().getTime()

        if (abuseLimitDelay > 0) {
          await delay(abuseLimitDelay)
        }

        await dispatch('runSearchForSource', source)
        if (index < synchronousSearches.length - 1) {
          await delay(synchSearchDelay)
        }

        // Don't continue with the next source if the
        // user has since submitted a new query.
        const currentQueryKey = JSON.stringify(state.submittedQuery)
        if (startingQueryKey !== currentQueryKey) break
      }
      Promise.all(asyncSearches).then(() => {
        dispatch('updateGithubResultsDependencies')
        dispatch('updateResultsLicenses')
      })
    },
    // Condensed all the search types into this one function,
    // since we're now handling the specific needs for each
    // search engine in the actual search module.
    runSearchForSource(
      { commit, dispatch, state, rootState, getters },
      source
    ) {
      const startTime = performance.now()

      // Set results to pending in case we are paginating
      commit(`SET_SEARCH_RESULTS`, {
        storeKey: source.storeKey,
        results: {
          meta: {
            status: 'pending',
            durationInSeconds:
              state.results[source.storeKey].meta.durationInSeconds
          }
        }
      })

      // Clear resultsGroupsScores for new search
      commit('SET_RESULTS_GROUP_SCORES', {
        groupName: groupNameForSource(source),
        scores: undefined
      })

      const shouldDelay =
        getters.selectedSearchIntent.sources.indexOf(source) === -1 &&
        source.service === 'githubCode'

      const observable = search({
        type: source.service,
        query: {
          ...source.queryMapper(state.submittedQuery, state),
          page: state.results[source.storeKey].lastSearchedPage + 1,
          delay: shouldDelay ? 5000 : 0,
          apiTokens: {
            githubToken: rootState.githubAuth.githubAccessToken,
            githubEnterpriseToken: rootState.githubAuth.githubEnterpriseToken
          }
        }
      })
        // Automatically complete every search after 10 seconds
        .timeoutWith(10000, Observable.empty())

      const subscription = observable.subscribe(
        handleSearchSubscription(source)
      )

      searchSubscriptions.push(subscription)

      return observable.toPromise()

      function handleSearchSubscription() {
        let responseMeta = {
          totalPages: 0,
          rateLimitRemaining: state.results[source.storeKey].rateLimitRemaining,
          retryAfter: 0
        }

        return {
          // Push new partial results to the search result list
          next: data => {
            // Ensure that results are not undefined before trying to work
            // with them to ensure that we do not cause any errors.
            if (!data.results) {
              if (data.responseMeta) {
                responseMeta = data.responseMeta
              } else {
                console.warn('Unhandled stream error')
              }
            } else {
              const timestamp = performance.now()
              if (Array.isArray(data.results)) {
                data.results = data.results.map(el => ({ ...el, timestamp }))
              } else {
                data.results.timestamp = timestamp
              }
              if (data.results.responseMeta) {
                responseMeta = data.results.responseMeta
              }
              commit(`PUSH_SEARCH_RESULTS`, {
                storeKey: source.storeKey,
                results: source.resultsMapper(data.results)
              })
            }
          },
          error: error => {
            commit('ADD_ERROR', error)
            const meta = { durationInSeconds: 0, status: 'failed' }
            commit(`SET_SEARCH_RESULTS`, {
              storeKey: source.storeKey,
              results: { meta }
            })
          },
          complete: () => {
            const endTime = performance.now()
            const durationInSeconds =
              state.results[source.storeKey].meta.durationInSeconds +
              (endTime - startTime) / 1000
            const meta = { durationInSeconds, status: 'complete' }
            // eslint-disable-next-line
            // console.log(source.service + ' ' + meta.status)

            commit(`SET_SEARCH_RESULTS`, {
              storeKey: source.storeKey,
              results: { meta }
            })

            const lastSearchedPage =
              state.results[source.storeKey].lastSearchedPage + 1
            const results = state.results[source.storeKey].items

            commit('SET_RESPONSE_META_FOR_SOURCE', {
              ...responseMeta,
              source: source.storeKey,
              lastSearchedPage
            })

            if (
              results.length < 5 &&
              lastSearchedPage < responseMeta.totalPages &&
              lastSearchedPage < MAX_PAGES_TO_FOLLOW_UP &&
              responseMeta.rateLimitRemaining > 0
            ) {
              dispatch('runSearchForSource', source)
            }

            // ===
            // Post-processing for results groups
            // ===

            dispatch('rankResultsForGroup', groupNameForSource(source))
          }
        }
      }
    },
    updateSelectedSearchIntent({ commit }, intentKeyOrName) {
      const newIntent = searchIntents.find(
        intent =>
          intent.key === intentKeyOrName || intent.name === intentKeyOrName
      )

      commit('SET_SELECTED_SEARCH_INTENT', newIntent)
    },
    updateSearchIsFullWindow({ commit }, newValue) {
      return new Promise(resolve => {
        commit('SET_IS_FULL_WINDOW', newValue)
        setTimeout(resolve, parseInt(branding._topBarTransitionDuration))
      })
    },
    updateQueryTypes({ commit, state }, typesChanges) {
      commit('MERGE_QUERY_TYPES', typesChanges)
      settings.set('search.query', state.query)
    },
    addRecentQuery({ state, commit }, newQuery) {
      commit('ADD_RECENT_QUERY', newQuery)
      settings.set('search.recentQueries', state.recentQueries)
    },
    updateSearchIntent({ commit, dispatch }, newSearchIntent) {
      commit('SET_SEARCH_INTENT', newSearchIntent)
      if (newSearchIntent !== 'All') {
        dispatch('updateSelectedSearchIntent', newSearchIntent)
      }
    },
    updateResultsGroupScores({ commit }, { groupName, scores = [] }) {
      commit('SET_RESULTS_GROUP_SCORES', { groupName, scores })
    },
    toggleExactFilter({ state, commit }, isExact) {
      commit('TOGGLE_EXACT_FILTER', !state.onlyExactResults)
    },
    selectResult({ state, commit }, newResult) {
      if (newResult.type === 'commit') {
        resultFileReader.input({
          file: {
            ...newResult.selectedBranch,
            ...newResult,
            selectedBranch: newResult.selectedBranch
          }
        })
      } else if (
        state.selectedResult &&
        state.selectedResult.key === newResult.key &&
        state.selectedResult.selectedBranch.key !== newResult.selectedBranch.key
      ) {
        commit('SELECT_RESULT_BRANCH', newResult.selectedBranch)
      } else if (newResult.type === 'file') {
        resultFileReader.input({ file: newResult })
      } else {
        commit('SELECT_RESULT', newResult)
      }
    },
    selectSearchResult(
      { state, getters, dispatch, commit },
      { relative, groupName, result, branch }
    ) {
      if (state.isFullWindow) {
        commit('SET_IS_FULL_WINDOW', false)
      }

      if (!relative) {
        dispatch('selectResult', {
          ...result,
          selectedBranch: branch
        })
        return dispatch('updateViewable', { type: 'result' })
      }
      if (relative === 'none') {
        return dispatch('updateViewable', { type: 'searchPending' })
      }

      if (
        relative === 'first' ||
        (relative === 'next' && !getters.nextResultBranch)
      ) {
        for (const resultsGroup of getters.searchResultsItemsGroups) {
          for (const result of resultsGroup.results) {
            dispatch('selectResult', {
              ...result,
              selectedBranch: result.branches[0]
            })
            return dispatch('updateViewable', { type: 'result' })
          }
        }
      }

      if (relative === 'firstInGroup') {
        const result = getters.searchResultsItemsGroups.find(
          group => group.name === groupName
        ).results[0]

        if (result) {
          dispatch('selectResult', {
            ...result,
            selectedBranch: result.branches[0]
          })
          return dispatch('updateViewable', { type: 'result' })
        }
      }

      if (relative === 'prev' && getters.prevResultBranch) {
        dispatch('selectResult', getters.prevResultBranch)
        return dispatch('updateViewable', { type: 'result' })
      }

      if (relative === 'next' && getters.nextResultBranch) {
        dispatch('selectResult', getters.nextResultBranch)
        return dispatch('updateViewable', { type: 'result' })
      }
    },
    updateSourcesOrder({ state, commit }, payload) {
      commit('UPDATE_SOURCES_ORDER', payload)
    },
    saveSourceOrder({ state }, newOrder) {
      settings.set('search.sourcesOrder', newOrder)
    },
    updateShouldRankResults({ state, commit, dispatch }, newValue) {
      commit('UPDATE_SHOULD_RANK_RESULTS', newValue)
      settings.set('search.shouldRankResults', state.shouldRankResults)
      dispatch('rankAllResultsGroups')
    },
    rankResultsForGroup({ state, getters }, groupName) {
      // Abort if the user has disabled results ranking or it’s disabled
      if (!process.env.RANKCER_ACTIVE || !state.shouldRankResults) return

      const resultsGroupUnfiltered = getters.searchResultsItemsGroupsUnfiltered.find(
        group => group.name === groupName
      )

      if (
        // Abort if there are no results in the group
        resultsGroupUnfiltered.results.length === 0 ||
        // Abort if the entire group is not actually complete
        resultsGroupUnfiltered.status !== 'complete' ||
        // Abort if the results group is not rankable
        !resultsGroupUnfiltered.isRankable
      )
        return

      new Promise((resolve, reject) => {
        // Time out after 10 seconds.
        setTimeout(reject, 10000)
        // Send the results to the ranker and update the codepilot scores.
        rankResults({
          query: state.submittedQuery.text,
          results: resultsGroupUnfiltered.results
        }).then(resolve)
      })
        .then(scores => {
          // Save the result scores, which is an object of result keys
          // and their corresponding scores.
          resultsGroupUnfiltered.updateScores(scores)
        })
        .catch(() => {
          // Update scores with no values, so that we know ranking is
          // complete, instead of the search appearing to forever hang.
          resultsGroupUnfiltered.updateScores()
        })
    },
    rankAllResultsGroups({ getters, dispatch }) {
      getters.searchResultsItemsGroupsUnfiltered.forEach(group => {
        dispatch('rankResultsForGroup', group.name)
      })
    },
    updateGithubResultsDependencies({ getters, commit }) {
      const potentialDeps = getters.selectedTabSearchResultsUnfiltered.items.filter(
        result => result.dependencies || result.devDependencies
      )

      // Merge both production and development dependencies into a single
      // object that we can reference later.
      const allDependencies = collectDependencyInformation(potentialDeps)

      // Empty array we will add dependencies to later.
      const filterableDependencies = Object.keys(allDependencies).map(
        dependencyName => ({
          name: allDependencies[dependencyName],
          checked: false
        })
      )

      commit('SET_GITHUB_CODE_RESULTS_DEPENDENCIES', filterableDependencies)
    },
    updateResultsLicenses({ getters, commit }) {
      const resultsLicenses = uniq(
        compact(
          getters.selectedTabSearchResultsUnfiltered.items.map(result => {
            if (result.repo) return result.repo.license
            else return null
          })
        )
      )
      const filterableLicenses = resultsLicenses.map(license => ({
        name: license,
        checked: false
      }))
      commit('SET_RESULTS_LICENSES', filterableLicenses)
    },
    resetGithubResultsDependencies({ commit }) {
      commit('SET_GITHUB_CODE_RESULTS_DEPENDENCIES', [])
    },
    setGithubCodeDependencyChecked({ commit }, { names, checked }) {
      commit('SET_GITHUB_CODE_DEPENDENCY_CHECKED', { names, checked })
    },
    setLicenseFilterChecked({ commit }, { names, checked }) {
      commit('SET_LICENSE_FILTER_CHECKED', { names, checked })
    },
    updateResultsWithoutDeps({ commit }, areAllowed) {
      commit('UPDATE_ALLOW_RESULTS_WITHOUT_DEPS', areAllowed)
    },
    updateResultsWithoutLicenses({ commit }, areAllowed) {
      commit('UPDATE_ALLOW_RESULTS_WITHOUT_LICENSES', areAllowed)
    },
    updateDependencyFilterRequirements({ commit }, allAreRequired) {
      commit('UPDATE_DEPENDENCY_FILTER_REQUIREMENTS', allAreRequired)
    },
    setCustomSources({ commit, rootState, dispatch }) {
      // Combine both the installed custom sources as well as the
      // user added custom sources before setting the custom sources
      // searched.
      const customSourcesToSearch = [
        ...rootState.customSearchSources.userAddedCustomSources,
        ...rootState.userProfile.profiles[
          rootState.userProfile.selectedProfileIndex
        ].customSources
      ]
      commit('SET_CUSTOM_SOURCES_SEARCHED', customSourcesToSearch)
    },
    initSelectedResultStream({ commit }) {
      resultFileReader.output$.subscribe(({ file, text }) => {
        commit('SELECT_RESULT', {
          ...file,
          text: text,
          html: escapeHtml(text)
        })
      })
    }
  }
}

function sortIntentSources(intent, order) {
  const sortedSources = intent.sources.reduce((sorted, source, index) => {
    const matchingSource = intent.sources.find(
      source => source.label === order[intent.name][index]
    )

    return matchingSource ? sorted.concat([matchingSource]) : sorted
  }, [])

  const missingSources = intent.sources.filter(
    source =>
      !sortedSources.find(matchedSource => matchedSource.label === source.label)
  )

  return sortedSources.concat(missingSources)
}

function sortIntents(intents, order) {
  if (!order) return intents
  return intents.map(intent => {
    return {
      ...intent,
      sources: sortIntentSources(intent, order)
    }
  })
}

function collectDependencyInformation(resultItems) {
  const dependencies = createDependencyObject(resultItems, 'dependencies')
  const devDependencies = createDependencyObject(resultItems, 'devDependencies')

  // Return an array of both dependencies and devDependencies that has
  // all duplicates removed
  return uniq([...dependencies, ...devDependencies])
}

function createDependencyObject(resultItems, propertyName) {
  // Return each dependency as a string concatenation of it's name and version
  return flatten(
    compact(resultItems.map(item => item[propertyName])).map(dep =>
      Object.keys(dep).map(dependencyName => {
        return `${dependencyName} ${dep[dependencyName]}`
      })
    )
  )
}

function groupSearchResults({ results, state, getters }) {
  const groupedItems = groupBy(results.items, 'source')

  const resultsGroups = getters.selectedSearchIntent.sources.map(source => {
    const groupName = groupNameForSource(source)

    const processedResults = flow(
      // Add a codepilotScore to each result, if one is available.
      results =>
        results.map((result, index) => ({
          ...result,
          codepilotScore: state.resultsGroupsScores[groupName]
            ? state.resultsGroupsScores[groupName][result.key] || 0
            : null
        })),
      // Sort results by the codepilotScore
      results => orderBy(results, ['codepilotScore'], ['desc'])
    )(groupedItems[groupName] || [])

    const searchStatus = mergeSearchStatuses(
      getSourceKeysForResults(processedResults).concat([source.storeKey]),
      state.results
    )

    const resultsGroupSources = [source]
    const resultsGroupSourcesWithMoreResults = resultsGroupSources.filter(
      getters.shouldLoadMoreResultsForSource
    )

    const isRankable =
      ![
        // Hard-coded list of groups that can't/shouldn't be ranked.
        'GitHub Commits',
        'View Web Results',
        'Custom Sources'
      ].includes(groupName) &&
      // Only rank results if there are at least 10
      processedResults.length >= 10 &&
      // Only rank results if the user has the ranker enabled
      state.shouldRankResults

    const isRanked = processedResults.every(
      result => result.codepilotScore != null
    )

    return {
      name: groupName,
      status: searchStatus,
      results: processedResults,
      shouldLoadMoreResults: !!resultsGroupSourcesWithMoreResults.length,
      getMoreResults: () => {
        const store = require('@state/store').default
        for (const source of resultsGroupSourcesWithMoreResults) {
          store.dispatch('runSearchForSource', source)
        }
      },
      isRankable,
      isRanked,
      isRanking: isRankable && !isRanked,
      updateScores: scores => {
        const store = require('@state/store').default
        store.dispatch('updateResultsGroupScores', { groupName, scores })
      }
    }
  })
  return resultsGroups
}

function groupNameForSource(source) {
  return source.name
}
