<template>
  <div class="absolute pin overflow-visible z-90 bg-grey-dark">
    <div class="w-full h-full overflow-hidden relative">
      <div class="h-12 bg-primary w-full block text-right flex justify-between items-center overflow-hidden absolute pin-t pin-x z-50">
        <transition
          name="slide-v"
          mode="out-in"
        >
          <div
            v-if="currentChatView !== 'ChannelList'"
            key="chat-log"
          >
            <button
              class="text-lg text-white"
              @click="updateChatView('ChannelList')"
            >
              <AppIcon
                class="text-lg px-4"
                icon="arrow-left"
              />
            </button>
            <span class="text-sm text-white uppercase font-bold">
              {{ shortCurrentChannel }}
            </span>
          </div>
          <div
            v-else
            key="channel-list"
          >
            <span class="px-4 text-white text-sm uppercase font-bold">
              CodePilot Chat
            </span>
          </div>
        </transition>
      </div>
      <div
        v-if="!chatUser.nickName"
        class="chat-login bg-grey-dark rounded rounded-b-none chat-login flex flex-col w-full h-full items-center justify-center"
      >
        <p>Sign in to GitHub to join the in-app chat</p>
        <AppButton
          type="primary"
          @click="updateGitHubSignInModalShown"
        >
          Sign in to GitHub
        </AppButton>
      </div>
      <template v-else>
        <div
          v-if="isChatLoading"
          class="absolute pin flex items-center justify-center flex-col"
        >
          <AppSpinner
            size="large"
            class="block mb-4"
          />
          Loading channels
        </div>
        <template v-else>
          <transition
            :name="currentChatView === 'ChatLog' ? 'slide-h' : 'slide-h-reverse'"
            mode="out-in"
          >
            <component
              :is="currentChatView"
              :channel="currentChatChannel"
              :key="currentChatView"
              @change-view="updateChatView"
              @invite-user="inviteToChat"
            />
          </transition>
        </template>
      </template>
    </div>
  </div>
</template>

<script>
import {
  chatGetters,
  chatActions,
  interfaceActions,
  githubAuthGetters
} from '@state/helpers'
import ChannelList from './chat/channel-list'
import ChatLog from './chat/chat-log'

export default {
  components: {
    ChannelList,
    ChatLog
  },
  computed: {
    ...chatGetters,
    ...githubAuthGetters,
    shortCurrentChannel() {
      return '#' + this.currentChatChannel.split('#').pop()
    }
  },
  watch: {
    githubUserInfo: {
      handler(githubInfo) {
        if (githubInfo && !this.chatUser.nickName) {
          this.startChat(githubInfo.name)
        }
      },
      immediate: true
    }
  },
  methods: {
    ...chatActions,
    ...interfaceActions
  }
}
</script>

<style lang="scss" scoped>
.slide-v-enter-active,
.slide-v-leave-active {
  transition: transform 0.3s;
}

.slide-v-enter {
  transform: translateY(200%);
}

.slide-v-leave-to {
  transform: translateY(-200%);
}

.slide-h-enter-active,
.slide-h-leave-active,
.slide-h-reverse-enter-active,
.slide-h-reverse-leave-active {
  transition: transform 0.2s;
}

.slide-h-enter,
.slide-h-reverse-leave-to {
  transform: translateX(100%);
}

.slide-h-reverse-enter,
.slide-h-leave-to {
  transform: translateX(-100%);
}
</style>
