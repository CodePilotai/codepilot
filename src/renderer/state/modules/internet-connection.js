// import ping from 'ping'

export default {
  state: {
    hasInternetConnection: true
  },
  mutations: {
    SET_HAS_INTERNET_CONNECTION(state, newValue) {
      state.hasInternetConnection = newValue
    }
  },
  actions: {
    initInternetConnectionChecker({ dispatch }) {
      // Run the check once before imposing the
      // five second time interval
      dispatch('checkInternetConnection')

      // Run this check every five seconds
      setInterval(() => {
        dispatch('checkInternetConnection')
      }, 5000)
    },
    checkInternetConnection({ state, commit, dispatch }) {
      if (navigator.onLine !== state.hasInternetConnection) {
        commit('SET_HAS_INTERNET_CONNECTION', navigator.onLine)
        // Notify the user that they need to
        if (!state.hasInternetConnection) {
          dispatch('addNotification', {
            type: 'Warning',
            message:
              'No internet connection was detected. Please connect to get the maximum amount of results.'
          })
        }
      }

      // TODO: Fix this in the future to account for ethernet edge case.
      // The implementation below breaks behind strict firewalls.

      // const hosts = ['google.com', 'yahoo.com', 'github.com']
      // let oneHostPingable = false

      // const pings = hosts.map(host => {
      //   return ping.promise.probe(host).then(response => {
      //     // Here we ensure that at least one of the hosts
      //     // that we attempt to ping is pingable.
      //     if (response.alive) {
      //       oneHostPingable = true
      //     }
      //   })
      // })

      // Promise.all(pings).then(() => {
      //   if (oneHostPingable !== state.hasInternetConnection) {
      //     commit('SET_HAS_INTERNET_CONNECTION', oneHostPingable)
      //   }
      // })
    }
  }
}
