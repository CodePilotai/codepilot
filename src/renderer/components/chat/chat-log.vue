<template>
  <div class="w-full h-full relative">
    <div
      ref="messagesContainer"
      :class="$style.chatLog"
      class="flex flex-col w-full h-full p-4 pb-1 pt-16 overflow-scroll no-scrollbar"
    >
      <MessageBubble
        v-for="message in messages"
        :key="message.key"
        :time="message.time"
        :text="message.text"
        :who="message.who"
        :can-invite="!isPrivate"
        @invite="inviteUser(message.who)"
      />
    </div>
    <MessageInput
      class="self-end"
      @submit="sendChatMessageToChannel"
    />
  </div>
</template>

<script>
import MessageBubble from './message-bubble'
import MessageInput from './message-input'
import { chatGetters, chatActions } from '@state/helpers'

export default {
  name: 'ChatLog',
  components: {
    MessageBubble,
    MessageInput
  },
  props: {
    channel: {
      type: String,
      required: true
    }
  },
  computed: {
    ...chatGetters,
    messages() {
      return this.chatMessages[this.channel]
    },
    name() {
      return '#' + this.channel.split('#').pop()
    },
    isPrivate() {
      return this.channel.includes('#private.')
    }
  },
  watch: {
    messages: 'scrollBottom'
  },
  mounted() {
    this.scrollBottom()
  },
  methods: {
    ...chatActions,
    sendChatMessageToChannel(message) {
      this.sendChatMessage({
        channel: this.channel,
        message
      })
    },
    scrollBottom() {
      this.$nextTick(() => {
        this.$refs.messagesContainer.scrollTop = this.$refs.messagesContainer.scrollHeight
      })
    },
    inviteUser(user) {
      if (this.chatUser.uuid.includes('codepilot-team')) {
        this.$emit('invite-user', user)
      }
    }
  }
}
</script>

<style lang="scss" module>
.chat-log {
  height: calc(100% - 3rem);
}
</style>
