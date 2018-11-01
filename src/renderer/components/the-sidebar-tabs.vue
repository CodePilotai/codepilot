<template>
  <div class="flex h-10 pl-2 pt-2 bg-grey-darkest">
    <button
      v-for="tabName in sidebarTabs"
      :key="tabName"
      :class="
        [
          'flex items-center px-4 text-grey-text-high-contrast no-outline border-t-2',
          { 'border-primary bg-grey-dark': activeTab === tabName },
          { 'bg-grey-darkest border-grey-darkest': activeTab !== tabName }
        ]
      "
      @click="pickTab(tabName)"
    >
      {{ tabName }}
      <div
        v-if="tabName === 'Results'"
        class="ml-3 bg-grey-lighter rounded-full px-2 text-xs"
      >
        {{ searchResults.resultsCount }}
      </div>
      <div
        v-if="tabName === 'Pins'"
        class="ml-3 bg-grey-lighter rounded-full px-2 text-xs"
      >
        {{ pinnedResults.length }}
      </div>
    </button>
    <!-- <button
      :class="
        [
          'flex items-center px-4 text-grey-text-high-contrast no-outline border-t-2',
          { 'border-primary bg-grey-dark': activeTab === 'Chat' },
          { 'bg-grey-darkest border-grey-darkest': activeTab !== 'Chat' }
        ]
      "
      @click="pickTab('Chat')"
    >
      Chat
      <div
        v-if="allUnnreadMessages.length"
        class="ml-3 bg-primary rounded-full px-2 text-xs"
      >
        {{ allUnnreadMessages.length }}
      </div>
    </button> -->
  </div>
</template>

<script>
import {
  interfaceGetters,
  interfaceActions,
  pinsGetters,
  searchGetters
  // chatGetters,
  // chatActions
} from '@state/helpers'

export default {
  computed: {
    ...interfaceGetters,
    ...pinsGetters,
    ...searchGetters,
    // ...chatGetters,
    activeTab() {
      // return this.isChatOpen ? 'Chat' : this.sidebarActiveTab
      return this.sidebarActiveTab
    }
  },
  methods: {
    ...interfaceActions,
    // ...chatActions,
    pickTab(tab) {
      // if (tab === 'Chat') {
      //   if (this.activeTab === 'Chat') {
      //     this.updateChatView('ChannelList')
      //   } else {
      //     this.updateChatOpenStatus(!this.isChatOpen)
      //   }
      // } else {
      // this.updateChatOpenStatus(false)
      this.updateSidebarActiveTab(tab)
    }
  }
}
</script>
