import flow from 'lodash/flow'
import groupBy from 'lodash/groupBy'
import omit from 'lodash/omit'
import orderBy from 'lodash/orderBy'
import settings from 'electron-settings'
import cuid from 'cuid'

export default {
  state: {
    results: getSavedResults(),
    pinnedGroupsNotes: settings.get('pins.pinnedGroupsNotes') || [],
    currentSelectedGroupName: null,
    currentSelectedPinResult: null,
    currentRubberDuckSessionKey:
      settings.get('pins.rubberDuckSessionKey') || null,
    rubberDuckSessions: settings.get('pins.rubberDuckSessions') || []
  },
  getters: {
    currentRubberDuckSession(state) {
      return state.rubberDuckSessions.find(
        session => session.key === state.currentRubberDuckSessionKey
      )
    },
    currentSelectedGroup(state, getters) {
      return getters.pinnedResultsGroups.find(
        group => group.name === state.currentSelectedGroupName
      )
    },
    currentGroupsNote(state) {
      return state.pinnedGroupsNotes.find(
        note => note.groupName === state.currentSelectedGroupName
      )
    },
    pinnedResultsGroups(state) {
      return flow(
        // Group each pin by its `groupName`.
        results => groupBy(results, 'pin.groupName'),
        // Create an array of group objects.
        groups =>
          Object.keys(groups).map(groupName => {
            const results = groups[groupName]
            return {
              name: groupName || 'Pins',
              key: groupName,
              source: 'Pins',
              results,
              // A group is solved when at least one pin inside it is marked
              // as a solution.
              isSolved: results.some(result => result.pin.isSolution)
            }
          }),
        // Order the groups alphabetically by `key`
        groups => orderBy(groups, 'key')
      )(state.results)
    }
  },
  mutations: {
    PUSH_PINNED_RESULT(state, result) {
      state.results.push(result)
      settings.set('pins.results', state.results)
    },
    DELETE_PINNED_RESULT(state, resultToDelete) {
      state.results = state.results.filter(
        result => result.key !== resultToDelete.key
      )
      settings.set('pins.results', state.results)
    },
    MERGE_PINNED_RESULT(state, result) {
      const existingResultIndex = state.results.findIndex(
        existingResult => existingResult.key === result.key
      )
      const existingResult = state.results[existingResultIndex]

      state.results[existingResultIndex].pin = {
        ...existingResult.pin,
        ...result.pin
      }
      settings.set('pins.results', state.results)
    },
    REMOVE_GROUP_FROM_PINS(state, groupName) {
      for (const result of state.results) {
        if (result.pin.groupName === groupName) {
          result.pin.groupName = ''
          result.pin.isSolution = false
        }
      }
      settings.set('pins.results', state.results)
    },
    SET_CURRENT_SELECTED_PIN_RESULT(state, result) {
      state.currentSelectedPinResult = result
    },
    UPDATE_CURRENT_RUBBER_DUCK_SESSION_FIELD(state, { text, sessionField }) {
      const rubberDuckSessionIndex = state.rubberDuckSessions.findIndex(
        session => session.key === state.currentRubberDuckSessionKey
      )

      state.rubberDuckSessions[rubberDuckSessionIndex][sessionField] = text

      settings.set('pins.rubberDuckSessions', state.rubberDuckSessions)
    },
    CREATE_NEW_RUBBER_DUCK_SESSION(state, session) {
      state.rubberDuckSessions.push(session)
      settings.set('pins.rubberDuckSessions', state.rubberDuckSessions)
    },
    SET_CURRENT_RUBBER_DUCK_SESSION_KEY(state, key) {
      state.currentRubberDuckSessionKey = key
      settings.get(
        'pins.rubberDuckSessionKey',
        state.currentRubberDuckSessionKey
      )
    },
    SET_RUBBER_DUCK_SESSIONS(state, rubberDuckSessions) {
      state.rubberDuckSessions = rubberDuckSessions
    },
    DELETE_RUBBER_DUCK_SESSION(state, key) {
      const rubberDuckSessionIndex = state.rubberDuckSessions.findIndex(
        session => session.key === key
      )
      state.rubberDuckSessions.splice(rubberDuckSessionIndex, 1)
      settings.set('pins.rubberDuckSessions', state.rubberDuckSessions)
    },
    PUSH_NEW_PIN_GROUP_NOTE(state, note) {
      state.pinnedGroupsNotes.push(note)
      settings.set('pins.pinnedGroupsNotes', state.pinnedGroupsNotes)
    },
    UPDATE_CURRENT_GROUPS_NOTE_BODY(state, { body, note }) {
      const noteIndex = state.pinnedGroupsNotes.findIndex(
        groupNote => groupNote.groupName === note.groupName
      )
      state.pinnedGroupsNotes.splice(noteIndex, 1, {
        ...note,
        body,
        updatedAt: new Date()
      })
      settings.set('pins.pinnedGroupsNotes', state.pinnedGroupsNotes)
    },
    SET_CURRENT_SELECTED_GROUP_NAME(state, groupName) {
      state.currentSelectedGroupName = groupName
    },
    DELETE_GROUPS_NOTE(state, noteToDelete) {
      const noteIndex = state.pinnedGroupsNotes.findIndex(
        note => note.groupName === noteToDelete.groupName
      )
      state.pinnedGroupsNotes.splice(noteIndex, 1)
      settings.set('pins.pinnedGroupsNotes', state.pinnedGroupsNotes)
    }
  },
  actions: {
    toggleResultPin({ dispatch }, result) {
      dispatch(result.pin ? 'removeResultPin' : 'addResultPin', result)
    },
    addResultPin({ rootState, commit }, result) {
      result = createPinnedResult(result, {
        intentKey: rootState.search.query.selectedSearchIntentKey,
        queryId: result.queryId || rootState.search.query.queryId
      })

      commit('PUSH_PINNED_RESULT', result)
      commit('SET_CURRENT_SELECTED_PIN_RESULT', result)
    },
    removeResultPin({ commit }, result) {
      commit('DELETE_PINNED_RESULT', result)
    },
    updateResultPin({ commit }, result) {
      commit('MERGE_PINNED_RESULT', result)
    },
    removePinGroup({ commit }, groupName) {
      commit('REMOVE_GROUP_FROM_PINS', groupName)
    },
    updateCurrentSelectedPinResult({ commit }, result) {
      commit('SET_CURRENT_SELECTED_PIN_RESULT', result)
    },
    deleteRubberDuckSession({ commit }, key) {
      commit('DELETE_RUBBER_DUCK_SESSION', key)
    },
    createNewRubberDuckSession({ commit }) {
      const newRubberDuckSession = {
        name: `Untitled session`,
        key: cuid(),
        problemDescription: '',
        problemBackground: '',
        problemResearch: ''
      }
      // create a new session
      commit('CREATE_NEW_RUBBER_DUCK_SESSION', newRubberDuckSession)
      // select newly created session as selected session
      commit('SET_CURRENT_RUBBER_DUCK_SESSION_KEY', newRubberDuckSession.key)
    },
    updateCurrentRubberDuckSessionKey({ commit }, key) {
      commit('SET_CURRENT_RUBBER_DUCK_SESSION_KEY', key)
    },
    updateCurrentRubberDuckSessionField({ commit }, { text, sessionField }) {
      if (text.length) {
        commit('UPDATE_CURRENT_RUBBER_DUCK_SESSION_FIELD', {
          text,
          sessionField
        })
      }
    },
    createOrViewExistingPinGroupNote({ state, commit, dispatch }, resultGroup) {
      // set the currently selected group
      commit('SET_CURRENT_SELECTED_GROUP_NAME', resultGroup.name)
      // Check to see if a note already exist for the group
      const groupNote = state.pinnedGroupsNotes.find(
        note => note.groupName === resultGroup.name
      )
      // If note does not exist, create new note
      if (!groupNote) {
        commit(
          'PUSH_NEW_PIN_GROUP_NOTE',
          createPinnedGroupNote({ groupName: resultGroup.name })
        )
      }

      // update the viewable to show note in the view pane
      dispatch('updateViewable', { type: 'notes' })
    },
    updateCurrentGroupsNoteBody({ commit, getters }, body) {
      commit('UPDATE_CURRENT_GROUPS_NOTE_BODY', {
        body,
        note: getters.currentGroupsNote
      })
    },
    deleteGroupsNote({ commit, dispatch, getters }) {
      commit('DELETE_GROUPS_NOTE', getters.currentGroupsNote)
      // revert to whichever view user was on prior to viewing the note
      dispatch('revertToPrevViewable')
    }
  }
}

function getSavedResults() {
  // If we haven't migrated the old pins to the new ones...
  if (!settings.get('pins.migratedFromSavedPinnedResults')) {
    // Migrate the old pins to the new
    settings.set(
      'pins.results',
      (settings.get('search.savedPinnedResults') || []).map(createPinnedResult)
    )
    // Save that we migrated to the new pins
    settings.set('pins.migratedFromSavedPinnedResults', true)
  }

  return (settings.get('pins.results') || []).map(result =>
    createPinnedResult(result, result.pin)
  )
}

function createPinnedGroupNote({ groupName }) {
  const createdAt = new Date()

  return {
    groupName,
    title: groupName,
    body: 'Type here. Your edits will save automatically!',
    createdAt,
    updatedAt: createdAt
  }
}

function createPinnedResult(
  result,
  { intentKey = '', queryId = '', groupName = '', isSolution = false } = {}
) {
  return {
    ...omit(result, 'intentKey'),
    pin: {
      intentKey: result.intentKey || intentKey,
      queryId: result.queryId || queryId,
      ...(result.pin || {}),
      groupName,
      isSolution
    }
  }
}
