<template>
  <div class="overflow-y-scroll no-scrollbar bg-grey-dark w-full h-full">
    <p class="p-4 mt-8 pt-6 pb-0 mb-0">Public channels:</p>
    <ChannelItem
      v-for="chat in publicChannels"
      :key="chat.channel"
      :channel="chat.channel"
      :name="chat.channel"
      @open-channel="openChannelAndMarkAsRead(chat)"
      @remove-channel="removeChatChannel(chat)"
    />
    <p class="p-4 pt-2 pb-0 mb-0">Private channels:</p>
    <ChannelItem
      v-for="chat in privateChannels"
      :key="chat.channel"
      :channel="chat.channel"
      :name="chat.channel"
      @open-channel="openChannelAndMarkAsRead(chat)"
      @remove-channel="removeChatChannel(chat)"
    />
  </div>
</template>

<script>
import { chatGetters, chatActions } from '@state/helpers'
import ChannelItem from './channel-item'

export default {
  components: {
    ChannelItem
  },
  computed: {
    ...chatGetters,
    publicChannels() {
      return Object.values(this.chats).filter(chat =>
        chat.channel.includes('#public')
      )
    },
    privateChannels() {
      return Object.values(this.chats).filter(chat =>
        chat.channel.includes('#private')
      )
    }
  },
  methods: {
    ...chatActions,
    openChannelAndMarkAsRead(chat) {
      this.markChatChannelAsRead(chat)
      this.updateCurrentChatChannel(chat)
      this.$emit('change-view', 'ChatLog')
    }
  }
}
</script>
