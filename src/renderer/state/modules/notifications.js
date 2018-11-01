import settings from 'electron-settings'
import isEqual from 'lodash/isEqual'

const notificationTypes = ['Notice', 'Warning', 'Error']

export default {
  state: {
    // the all array should be filled with objects with the following structure
    // {
    //   type: 'Warning',
    //   message: 'Message goes here.'
    // }
    all: settings.get('notifications.all') || [],
    blacklist: settings.get('notifications.blacklist') || []
  },
  getters: {
    currentNotification(state) {
      return state.all[state.all.length - 1]
    }
  },
  mutations: {
    ADD_NOTIFICATION(state, newNotification) {
      state.all.push(newNotification)
    },
    ADD_BLACKLIST_NOTIFICATION(state, newNotification) {
      state.blacklist.push(newNotification)
    },
    DISMISS_NOTIFICATION(state) {
      state.all.pop()
    },
    CLEAR_NOTIFICATIONS(state) {
      state.all = []
    },
    CLEAR_BLACKLIST(state) {
      state.blacklist = []
    }
  },
  actions: {
    initNotifications({ dispatch }) {
      dispatch('clearNotifications')
      dispatch('clearBlacklist')
    },
    // add a new notification to the queue
    addNotification({ commit, state }, newNotification) {
      // set notification to Warning if not an accepted type
      if (notificationTypes.indexOf(newNotification.type) === -1) {
        newNotification.type = 'Warning'
      }

      // Check to see if the notification already exists and
      // if it is blacklisted (it exists in the blacklist array)
      if (
        isUniqueNotification(newNotification, state.all) &&
        isUniqueNotification(newNotification, state.blacklist)
      ) {
        commit('ADD_NOTIFICATION', newNotification)
        settings.set('notifications.all', state.all)
      }
    },
    // remove value from queue after dismissed
    dismissNotification({ commit, state }) {
      commit('DISMISS_NOTIFICATION')
      settings.set('notifications.all', state.all)
    },
    clearNotifications({ commit, state }) {
      commit('CLEAR_NOTIFICATIONS')
      settings.set('notifications.all', state.all)
    },
    clearBlacklist({ commit, state }) {
      commit('CLEAR_BLACKLIST')
      settings.set('notifications.blacklist', state.all)
    },
    blacklistNotification({ commit, state, dispatch }) {
      if (isUniqueNotification(state.all[0], state.blacklist)) {
        commit('ADD_BLACKLIST_NOTIFICATION', state.all[0])
        settings.set('notifications.blacklist', state.blacklist)
        dispatch('dismissNotification')
      }
    }
  }
}

// check to see if notification is already in the queue
function isUniqueNotification(newNotification, currentNotifications) {
  return !currentNotifications.some(notification =>
    isEqual(newNotification, notification)
  )
}
