<template>
  <div
    :class="[selected ? 'bg-primary text-white' : '']"
    class="text-left text-white w-full px-4 py-2 cursor-pointer hover:bg-grey"
  >
    <span
      class="flex text-bold truncate text-grey-text-high-contrast uppercase font-bold h-8 items-center justify-between"
      @click="$emit('open-channel')"
    >
      <span>
        {{ name }}
        <AppTag
          v-if="unreadMessages.length"
          class="ml-2"
          color="var(--primary-color)"
        >
          {{ unreadMessages.length }}
        </AppTag>
      </span>
      <AppIcon
        v-if="isRemovable"
        icon="close"
        @click.stop="$emit('remove-channel')"
      />
    </span>
  </div>
</template>

<script>
import { chatGetters } from '@state/helpers'

export default {
  props: {
    channel: {
      type: String,
      required: true
    }
  },
  computed: {
    ...chatGetters,
    messages() {
      return this.chatMessages[this.channel] || []
    },
    unreadMessages() {
      return this.messages.filter(message => message.unread)
    },
    selected() {
      return this.$store.state.chat.currentChat === this.channel
    },
    name() {
      return '#' + this.channel.split('#').pop()
    },
    isRemovable() {
      return (
        !this.channel.includes('codepilot') &&
        this.chatUser.uuid.includes('codepilot-team')
      )
    }
  }
}
</script>
