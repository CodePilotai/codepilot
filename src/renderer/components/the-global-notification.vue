<template>
  <div
    v-if="currentNotification"
    data-e2e="TheGlobalNotification"
    class="absolute pin-t pin-r pin-l py-2 px-4 mx-8 flex items-center z-50 bg-grey-darker shadow-md rounded"
  >
    <span class="flex-grow justify-start">
      <span
        :class="[
          {'bg-red': currentNotification.type === 'Error'},
          {'bg-green-dark':currentNotification.type === 'Notice'},
          {'bg-orange-dark':currentNotification.type === 'Warning'},
        ]"
        class="py-1 px-2 text-semibold text-xs rounded text-grey-text-high-contrast"
      >
        {{ currentNotification.type }}
      </span>
      <span class="flex-grow justify-start ml-2 text-sm">
        {{ currentNotification.message }}
      </span>
    </span>
    <AppButton
      v-if="currentNotification.type === 'Error' || currentNotification.type === 'Warning'"
      type="danger"
      @click="blacklistNotification"
    >
      Dismiss for Session
    </AppButton>
    <AppButton
      v-else-if="currentNotification.button"
      type="primary"
      @click="currentNotification.button.onClick"
    >
      {{ currentNotification.button.label }}
    </AppButton>
    <AppButton
      type="confirm"
      class="ml-3"
      @click="dismissNotification"
    >
      Close
    </AppButton>
  </div>
</template>

<script>
import { notificationGetters, notificationActions } from '@state/helpers'

export default {
  computed: {
    ...notificationGetters
  },
  methods: {
    ...notificationActions
  }
}
</script>
