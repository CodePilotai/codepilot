import electron from 'electron'
import settings from 'electron-settings'
import githubApiGet from '@search/utils/github-api-get'
import gitHubApiGraphQLQuery from '@search/utils/github-api-graphql-query'
import graphQLTemplate from 'graphql-tag'
import cuid from 'cuid'
import githubBasicSignIn from '@helpers/github-basic-sign-in'
import githubBrowserSignIn from '@helpers/github-browser-sign-in'
import revokeGithubAccess from '@helpers/revoke-github-access'

const requestVariables = {
  client_id: process.env.GITHUB_CLIENT_ID,
  scopes: ['public_repo', 'read:user']
}

export default {
  state: {
    loading: false,
    githubAccessToken: settings.get('githubToken') || '',
    githubEnterpriseHostAddress:
      settings.get('githubEnterpriseHostAddress') || '',
    githubEnterpriseHostAddressValidated:
      settings.get('githubEnterpriseHostAddressValidated') || false,
    githubEnterpriseToken: settings.get('githubEnterpriseToken') || '',
    githubUserInfo: settings.get('githubUserInfo') || null,
    githubEnterpriseUserInfo: settings.get('githubEnterpriseUserInfo') || null,
    userChoseToDisableGitHub: settings.get('userChoseToDisableGitHub') === true,
    limits: {
      restApi: {},
      graphql: {},
      core: {},
      search: {},
      graphQlApi: {}
    }
  },
  mutations: {
    SET_GITHUB_ACCESS_TOKEN(state, accessToken) {
      state.githubAccessToken = accessToken
    },
    SET_GITHUB_ENTERPRISE_ACCESS_TOKEN(state, accessToken) {
      state.githubEnterpriseToken = accessToken
    },
    SET_GITHUB_ENTERPRISE_HOST_ADDRESS(state, hostAddress) {
      state.githubEnterpriseHostAddress = hostAddress
    },
    SET_GITHUB_ENTERPRISE_HOST_ADDRESS_VALIDATED(state, validated) {
      state.githubEnterpriseHostAddressValidated = validated
    },
    SET_GITHUB_USER_INFO(state, newValue) {
      state.githubUserInfo = newValue
    },
    SET_GITHUB_ENTERPRISE_USER_INFO(state, newValue) {
      state.githubEnterpriseUserInfo = newValue
    },
    SET_USER_CHOSE_TO_DISABLE_GITHUB(state, newValue) {
      state.userChoseToDisableGitHub = newValue
    },
    SET_REMAINING_LIMITS(state, limits) {
      state.limits = limits
    },
    SET_GITHUB_LOADING(state, status) {
      state.loading = status
    }
  },
  actions: {
    async getRemainingRateLimits({ state, commit }) {
      // abort if no valid access token
      if (!state.githubAccessToken) return

      const [restResponse, graphQlResponse] = await Promise.all([
        githubApiGet({
          endpoint: 'rate_limit',
          token: state.githubAccessToken,
          source: 'GitHub Settings'
        }),
        fetchGraphQLLimit({ token: state.githubAccessToken })
      ])

      commit('SET_REMAINING_LIMITS', {
        restApi: restResponse.body.rate,
        core: restResponse.body.resources.core,
        search: restResponse.body.resources.search,
        graphql: restResponse.body.resources.graphql,
        graphQlApi: graphQlResponse.data.rateLimit.remaining
      })
    },
    async getCurrentAuthenticatedUser({ state, commit }, hostAddress) {
      if (!state.githubAccessToken && !state.githubEnterpriseToken) return

      return githubApiGet({
        hostAddress,
        endpoint: `user`,
        token: hostAddress
          ? state.githubEnterpriseToken
          : state.githubAccessToken,
        source: 'GitHub Auth'
      }).then(response => {
        const githubUser = {
          login: response.body.login,
          name: response.body.name,
          avatarUrl: response.body.avatar_url
        }
        if (!hostAddress) {
          commit('SET_GITHUB_USER_INFO', githubUser)
          settings.set('githubUserInfo', state.githubUserInfo)
        } else {
          commit('SET_GITHUB_ENTERPRISE_USER_INFO', githubUser)
          settings.set(
            'githubEnterpriseUserInfo',
            state.githubEnterpriseUserInfo
          )
        }
      })
    },
    async revokeGithubAccess({ state, commit }) {
      await revokeGithubAccess(state.githubAccessToken)
      commit('SET_GITHUB_ACCESS_TOKEN', '')
      settings.set('githubToken', state.githubAccessToken)
      commit('SET_GITHUB_USER_INFO', null)
      settings.set('githubUserInfo', state.githubUserInfo)
      commit('SET_USER_CHOSE_TO_DISABLE_GITHUB', true)
      settings.set('userChoseToDisableGitHub', state.userChoseToDisableGitHub)
    },
    async githubBasicSignIn({ state, commit, dispatch }, userInfo) {
      const authorization =
        'Basic ' + btoa(userInfo.user + ':' + userInfo.password)
      const authToken = await githubBasicSignIn(authorization)
      commit('SET_GITHUB_ACCESS_TOKEN', authToken)
      settings.set('githubToken', state.githubAccessToken)
      await dispatch('getCurrentAuthenticatedUser')
    },
    githubBrowserSignIn({ state, commit, dispatch }) {
      // Moved auth window creation here to fix loadURL issue
      let authWindow = new electron.remote.BrowserWindow({
        width: 800,
        height: 600,
        show: false,
        webPreferences: {
          devTools: false,
          nodeIntegration: false,
          webSecurity: false
        }
      })

      authWindow.webContents.openDevTools()

      authWindow.webContents.session.clearStorageData()
      let githubUrl = 'https://github.com/login/oauth/authorize?'
      let authUrl =
        githubUrl +
        'client_id=' +
        requestVariables.client_id +
        '&scope=' +
        requestVariables.scopes +
        '&state=' +
        cuid()

      authWindow.loadURL(authUrl)
      authWindow.show()

      const onGithubAuth = token => {
        commit('SET_GITHUB_ACCESS_TOKEN', token)
        settings.set('githubToken', state.githubAccessToken)
        dispatch('getCurrentAuthenticatedUser')
        dispatch('updateGitHubSignInModalShown', false)
        commit('SET_GITHUB_LOADING', false)
      }
      authWindow.webContents.on('will-navigate', function(event, url) {
        commit('SET_GITHUB_LOADING', true)
        handleCallback(url, authWindow).then(onGithubAuth)
      })

      authWindow.webContents.on('did-get-redirect-request', function(
        event,
        oldUrl,
        newUrl
      ) {
        commit('SET_GITHUB_LOADING', true)
        handleCallback(newUrl, authWindow).then(onGithubAuth)
      })

      authWindow.webContents.on('close', function() {
        commit('SET_GITHUB_LOADING', false)
      })
    },
    updateGitHubEntepriseHostAddress({ state, commit }, hostAddress) {
      commit('SET_GITHUB_ENTERPRISE_HOST_ADDRESS', hostAddress)
      settings.set(
        'githubEnterpriseHostAddress',
        state.githubEnterpriseHostAddress
      )
    },
    updateGitHubEnterpriseHostAddressValidated(
      { state, commit },
      hostAddressValidated
    ) {
      commit(
        'SET_GITHUB_ENTERPRISE_HOST_ADDRESS_VALIDATED',
        hostAddressValidated
      )
      settings.set(
        'githubEnterpriseHostAddressValidated',
        state.githubEnterpriseHostAddress
      )
    },
    updateGitHubEnterprisePersonalAccessToken({ state, commit }, accessToken) {
      commit('SET_GITHUB_ENTERPRISE_ACCESS_TOKEN', accessToken)
      settings.set('githubEnterpriseToken', state.githubEnterpriseToken)
    },
    updateGitHubEnterpriseUserInfo({ state, commit }, userInfo) {
      commit('SET_GITHUB_ENTERPRISE_USER_INFO', userInfo)
      settings.set('')
    }
  }
}

function handleCallback(url, authWindow) {
  return new Promise(resolve => {
    const codeMatch = url.match(/code=([^&]+)/)
    const code = codeMatch && codeMatch[1]
    const errorMatch = url.match(/\?error=(.+)$/)

    if (code || errorMatch) {
      // Clear the code that gets cached after GitHub auth so that the,
      // user is able to login with multiple accounts and we don't
      // auto log them in.
      authWindow.webContents.session.clearStorageData()
      // Close the browser if code found or error
      authWindow.destroy()
    }

    // If there is a code, proceed to get token from github
    if (code) {
      githubBrowserSignIn(code, requestVariables).then(token => {
        resolve(token, requestVariables)
      })
    } else if (errorMatch) {
      alert(
        "Oops! Something went wrong and we couldn't" +
          'log you in using GitHub. Please try again.'
      )
    }
  })
}

function fetchGraphQLLimit({ token }) {
  return gitHubApiGraphQLQuery({
    query: graphQLTemplate`
      query {
        rateLimit {
          remaining
        }
      }
    `,
    token
  })
}
