import Vue from 'vue'
import settings from 'electron-settings'
import cuid from 'cuid'

function createUserUuid() {
  return cuid()
}

function saveChats(chats) {
  settings.set('chat-channels', Object.keys(chats))
}

export default {
  state: {
    chats: {},
    chatMessages: {},
    user: {},
    currentChannel: null,
    isChatOpen: false,
    ChatEngine: [],
    loading: false,
    currentChatView: 'ChannelList'
  },
  mutations: {
    SET_CHAT_LOADING_STATUS(state, status) {
      state.loading = status
    },
    SET_CHAT_ENGINE(state, engine) {
      state.ChatEngine = Object.freeze([engine])
    },
    SET_CHAT_USER(state, { user }) {
      state.user = user
    },
    SET_CURRENT_CHAT_CHANNEL(state, channel) {
      state.currentChannel = channel
    },
    ADD_CHAT_CHANNEL(state, chat) {
      if (state.chats[chat.channel]) return

      Vue.set(state.chats, chat.channel, Object.freeze(chat))
      if (!state.chatMessages[chat.channel]) {
        Vue.set(state.chatMessages, chat.channel, [])
      }

      saveChats(state.chats)
    },
    ADD_CHAT_MESSAGE(state, { sender, chat, text, data, timetoken, isNew }) {
      const channel = chat.channel
      const unread = isNew

      if (!state.chatMessages[channel]) {
        Vue.set(state.chatMessages, channel, [])
      }

      let message = {
        text: text || data.text,
        time: timetoken,
        unread
      }

      message.who = {
        name: sender.state.nickName,
        uuid: sender.state.uuid
      }

      state.chatMessages[channel].push(message)
      state.chatMessages[channel].sort((msg1, msg2) => {
        return msg1.time > msg2.time
      })
    },
    MARK_CHANNEL_AS_READ(state, channel) {
      state.chatMessages[channel] = state.chatMessages[channel].map(
        message => ({
          ...message,
          unread: false
        })
      )
    },
    SET_CHAT_OPEN_STATUS(state, status) {
      state.isChatOpen = status
    },
    DELETE_CHAT_CHANNEL(state, channel) {
      if (state.chats[channel]) {
        Vue.delete(state.chats, channel)
      }
    },
    UPDATE_CHAT_VIEW(state, view) {
      state.currentChatView = view
    }
  },
  actions: {
    createChatUser({ commit, rootState }) {
      const uuid = settings.get('chat-uuid') || createUserUuid()

      const nickName = rootState.githubAuth.githubUserInfo.login

      commit('SET_CHAT_USER', {
        user: {
          nickName,
          uuid
        }
      })
      settings.set('chat-uuid', uuid)
    },
    sendChatMessage({ state }, { channel, message }) {
      state.chats[channel].emit('message', message)
    },
    updateCurrentChatChannel({ commit }, { channel }) {
      commit('SET_CURRENT_CHAT_CHANNEL', channel)
    },
    markChatChannelAsRead({ commit }, { channel }) {
      commit('MARK_CHANNEL_AS_READ', channel)
    },
    updateChatOpenStatus({ commit }, status) {
      commit('SET_CHAT_OPEN_STATUS', status)
    },
    createChatAndSubscribe(
      { state, commit, getters },
      { channel, isPrivate = false }
    ) {
      const chat = new getters.ChatEngine.Chat(channel, isPrivate)

      return new Promise(resolve => {
        chat.on('$.connected', () => {
          commit('ADD_CHAT_CHANNEL', chat)

          chat
            .search({
              reverse: true,
              event: 'message',
              limit: 20
            })
            .on('message', message => {
              commit('ADD_CHAT_MESSAGE', {
                chat: chat,
                ...message,
                isNew: false
              })
            })

          chat.on('message', message => {
            const isNew = state.currentChannel !== chat.channel

            commit('ADD_CHAT_MESSAGE', {
              ...message,
              isNew
            })
          })

          resolve(chat)
        })
      })
    },
    startChat({ dispatch, state, commit, getters }) {
      commit('SET_CHAT_LOADING_STATUS', true)

      commit(
        'SET_CHAT_ENGINE'
        //  Chat engine here
      )

      dispatch('createChatUser')

      getters.ChatEngine.connect(
        state.user.uuid,
        state.user
      )

      getters.ChatEngine.on('$.ready', ({ me }) => {
        me.direct.on('$.invite', payload => {
          dispatch('createChatAndSubscribe', {
            channel: payload.data.channel,
            isPrivate: true
          })
        })

        const savedChannels = settings.get('chat-channels') || []

        const publicChannelName =
          process.env.NODE_ENV === 'production' ? 'codepilot' : 'codepilot-dev'

        dispatch('createChatAndSubscribe', {
          channel: publicChannelName,
          isPrivate: false
        })

        savedChannels
          .filter(channel => !channel.includes(publicChannelName))
          .forEach(channel =>
            dispatch('createChatAndSubscribe', {
              channel,
              isPrivate: true
            })
          )

        commit('SET_CHAT_LOADING_STATUS', false)
      })
    },
    async inviteToChat({ state, getters, dispatch }, { name, uuid }) {
      const [firstName, secondName] =
        state.user.nickName > name
          ? [name, state.user.nickName]
          : [state.user.nickName, name]

      const privateChannelName = `${firstName}-${secondName}`
      const selectedUser = getters.ChatEngine.users[uuid]

      const existingChat = Object.keys(getters.ChatEngine.chats).find(
        channelName => channelName.includes(privateChannelName)
      )

      if (existingChat) {
        dispatch('updateCurrentChatChannel', { channel: existingChat })
      } else {
        const privateChat = await dispatch('createChatAndSubscribe', {
          channel: privateChannelName,
          isPrivate: true
        })
        privateChat.invite(selectedUser)
        saveChats(state.chats)
        dispatch('updateCurrentChatChannel', privateChat)
      }
    },
    removeChatChannel({ state, commit }, { channel }) {
      commit('DELETE_CHAT_CHANNEL', channel)
      saveChats(state.chats)
    },
    updateChatView({ commit }, view) {
      commit('UPDATE_CHAT_VIEW', view)
    }
  },
  getters: {
    ChatEngine: state => state.ChatEngine[0],
    allUnnreadMessages: state => {
      const channels = Object.keys(state.chatMessages)

      return channels
        .reduce((messages, channel) => {
          return messages.concat(state.chatMessages[channel])
        }, [])
        .filter(message => message.unread)
    }
  }
}
