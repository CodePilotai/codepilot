import Vue from 'vue'
import searchIntents from '@state/modules/search/intents'
import settings from 'electron-settings'
import pick from 'lodash/pick'
import flatten from 'lodash/flatten'
import cuid from 'cuid'
import availableCustomSearchSources from './custom-sources.json'

// When creating default custom sources, treat it like you would normally
// adding custom sources to the app, ensure that the label is unique
const defaultCustomSources = [
  {
    key:
      'https://gist.github.com/search?utf8=%E2%9C%93&q=user:{{github_user}}+{{query}}:GitHubgists:Code',
    id: cuid(),
    url:
      'https://gist.github.com/search?utf8=%E2%9C%93&q=user:{{github_user}}+{{query}}',
    label: 'Personal GitHub gists',
    intent: searchIntents.find(intent => intent.name === 'Code'),
    isSearched: false
  },
  {
    key:
      'https://gist.github.com/search?utf8=%E2%9C%93&q={{query}}:GitHubgists:Code',
    id: cuid(),
    url: 'https://gist.github.com/search?utf8=%E2%9C%93&q={{query}}',
    label: 'GitHub gists',
    intent: searchIntents.find(intent => intent.name === 'Code'),
    isSearched: false
  },

  {
    key: 'https://devdocs.io/#q={{query}}:DevDocs.io:Docs',
    id: cuid(),
    url: 'https://devdocs.io/#q={{query}}',
    label: 'DevDocs.io',
    intent: searchIntents.find(intent => intent.name === 'Docs'),
    isSearched: true
  }
]

export default {
  state: {
    availableCustomSearchSources,
    userAddedCustomSources:
      settings.get('userAddedCustomSources.userAddedCustomSources') ||
      defaultCustomSources,
    customSourceTagsFromUserProfile: [],
    shouldFilterByTag: false
  },
  getters: {
    filteredAvailableCustomSearchSources(state) {
      if (!state.shouldFilterByTag) {
        return state.availableCustomSearchSources
      }
      // only select availableCustomSearchSources that have tags
      const sourcesWithTags = state.availableCustomSearchSources.filter(
        sources => sources.tags !== undefined
      )
      // return availableCustomSearchSources whose tags match tags from userProfile
      return sourcesWithTags.filter(source =>
        source.tags.some(
          tag =>
            state.customSourceTagsFromUserProfile.some(
              profileTag => tag.toLowerCase() === profileTag.toLowerCase()
            ) || tag.toLowerCase() === 'global'
        )
      )
    },
    showfilteredAvailableCustomSearchSourcesCount(state, getters) {
      return `Showing ${
        getters.filteredAvailableCustomSearchSources.length
      } of ${state.availableCustomSearchSources.length} Custom Source(s)`
    }
  },
  mutations: {
    UPDATE_CUSTOM_SOURCE(state, source) {
      if (typeof source.url === 'string') {
        if (source.url.includes('{{query}}')) {
          source.isSearched = false
        }
      }

      const customSearchSourceIndex = state.userAddedCustomSources.findIndex(
        customSearchSource => {
          return customSearchSource.id === source.id
        }
      )

      Vue.set(state.userAddedCustomSources, customSearchSourceIndex, {
        ...state.userAddedCustomSources[customSearchSourceIndex],
        ...source
      })
    },
    REMOVE_CUSTOM_SOURCE(state, sourceId) {
      const customSearchSourceIndex = state.userAddedCustomSources.findIndex(
        customSearchSource => customSearchSource.id === sourceId
      )
      state.userAddedCustomSources.splice(customSearchSourceIndex, 1)
    },
    SET_CUSTOM_SOURCES(state, sources) {
      state.userAddedCustomSources = sources
    },
    ADD_CUSTOM_SOURCE_TAGS_FROM_USER_PROFILE(state, tags) {
      state.customSourceTagsFromUserProfile.push(...tags)
    },
    RESET_CUSTOM_SOURCE_TAGS_FROM_USER_PROFILE(state) {
      state.customSourceTagsFromUserProfile = []
    },
    SET_SHOULD_FILTER_BY_TAG(state, shouldFilter) {
      state.shouldFilterByTag = shouldFilter
    },
    ADD_NEW_CUSTOM_SOURCE(state, source) {
      state.userAddedCustomSources.push(source)
    }
  },
  actions: {
    addNewCustomSourceFromUser({ state, commit }, source) {
      commit('ADD_NEW_CUSTOM_SOURCE', {
        ...source,
        id: cuid(),
        key: createUniqueKey(source, source.intent.name)
      })
      settings.set(
        'userAddedCustomSources.userAddedCustomSources',
        state.userAddedCustomSources
      )
    },
    addFromAvailableCustomSearchSources({ state, commit }, source) {
      commit('ADD_NEW_CUSTOM_SOURCE', {
        ...source,
        id: cuid()
      })
      settings.set(
        'userAddedCustomSources.userAddedCustomSources',
        state.userAddedCustomSources
      )
    },
    updateCustomSource({ state, commit, dispatch }, source) {
      // If new custom source from user is being created
      if (!source.id) {
        dispatch('addNewCustomSourceFromUser', source)
      }
      // If saved custom source is being updated
      else {
        commit('UPDATE_CUSTOM_SOURCE', {
          ...source,
          key: createUniqueKey(source, source.intent.name)
        })
        settings.set(
          'userAddedCustomSources.userAddedCustomSources',
          state.userAddedCustomSources
        )
      }
    },
    removeCustomSource({ state, commit }, sourceId) {
      commit('REMOVE_CUSTOM_SOURCE', sourceId)
      settings.set(
        'userAddedCustomSources.userAddedCustomSources',
        state.userAddedCustomSources
      )
    },
    resetCustomSources({ state, commit }) {
      commit('SET_CUSTOM_SOURCES', defaultCustomSources)
      settings.set(
        'userAddedCustomSources.userAddedCustomSources',
        state.userAddedCustomSources
      )
    },
    reinitializeCustomSources({ state, commit }) {
      state.userAddedCustomSources.forEach(source =>
        defaultCustomSources.forEach(defaultSource => {
          if (defaultSource.key === source.key) {
            commit('UPDATE_CUSTOM_SOURCE', {
              ...source,
              intent: defaultSource.intent
            })
          }
        })
      )
    },
    setCustomSourceTagsFromUserProfile({ commit, getters }) {
      // reset tags
      commit('RESET_CUSTOM_SOURCE_TAGS_FROM_USER_PROFILE')
      // select only the fields from userProfile that we want
      // to generate tags from

      const userProfileWithSelectedFields = pick(getters.selectedProfile, [
        'appServers',
        'databases',
        'frameworks',
        'ide',
        'programmingLanguages',
        'testingTools',
        'xaas'
      ])
      commit(
        'ADD_CUSTOM_SOURCE_TAGS_FROM_USER_PROFILE',
        flatten(
          Object.keys(userProfileWithSelectedFields).map(
            field => userProfileWithSelectedFields[field]
          )
        )
      )
    },
    toggleFilterByTag({ state, commit }) {
      commit('SET_SHOULD_FILTER_BY_TAG', !state.shouldFilterByTag)
    }
  }
}

function createUniqueKey(source, intent) {
  return `${source.url}:${source.label.replace(/ /g, '')}:${intent}`
}
