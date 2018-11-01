<template>
  <div
    :class="bubbleClasses"
    class="p-2 rounded mb-2 text-sm relative select-text"
  >
    <div class="flex justify-between">
      <span class="text-xxs">
        {{ who.name }}
      </span>
      <span class="text-xxs ml-4">
        {{ dateString }}
      </span>
    </div>
    <span class="whitespace-pre-line">
      <AppEmbeddedHtml :html="content"/>
    </span>
    <AppIcon
      v-tooltip.right="'Invite to a private chat'"
      v-if="!isMe && canInvite"
      icon="comments"
      alt="Invite to chat"
      class="text-grey-light flex items-center hover:text-grey-text-high-contrast absolute pin-r pin-t pin-b text-lg -mr-6 cursor-pointer"
      @click="$emit('invite')"
    />
  </div>
</template>

<script>
import { chatGetters } from '@state/helpers'
import parse from 'date-fns/parse'
import format from 'date-fns/format'

export default {
  props: {
    time: {
      type: String,
      required: true
    },
    text: {
      type: String,
      required: true
    },
    who: {
      type: Object,
      required: true
    },
    canInvite: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...chatGetters,
    isMe() {
      return this.who.uuid === this.chatUser.uuid
    },
    bubbleClasses() {
      return this.isMe
        ? [
            this.$style.messageBubble,
            this.$style.myMessageBubble,
            'self-end',
            'bg-primary',
            'text-white'
          ]
        : [this.$style.messageBubble, 'self-start', 'bg-white', 'text-black']
    },
    content() {
      const urlRegex = /(https?:\/\/[^\s]+)/g
      return this.text.replace(urlRegex, url => `<a href="${url}">${url}</a>`)
    },
    dateString() {
      return format(parse(this.time / 10000), 'MM/DD/YYYY, HH:mm:ss')
    }
  }
}
</script>

<style lang="scss" module>
.message-bubble {
  min-width: 30%;
  max-width: 75%;
}

.my-message-bubble a {
  color: yellow;
}
</style>
