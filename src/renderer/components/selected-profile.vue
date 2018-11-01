<template>
  <div class="w-48">
    <AppSelect
      :value="selectedProfile.key"
      :options="profiles"
      data-v-step="search-profile"
      class="whitespace-no-wrap mr-1 w-full flex flex-grow h-full"
      type="bordered"
      @input="selectUserProfile"
    >
      <div
        slot="option"
        slot-scope="{ option }"
      >
        {{ option && option.key }}
      </div>

      <div
        v-if="hasNewProfileLink"
        slot="action"
        slot-scope="{ close }"
        class="flex py-3 px-4 w-full hover:bg-grey justify-between"
        @click="createNewProfile(close)"
      >
        Create new profile
        <AppIcon
          icon="plus"
        />
      </div>
    </AppSelect>
  </div>
</template>

<script>
import {
  customSearchSourcesActions,
  userProfileGetters,
  userProfileActions,
  interfaceActions
} from '@state/helpers'
import ProgressBar from './progress-bar'
import DependencyFilterIcon from './dependency-filter-icon'

export default {
  components: {
    ProgressBar,
    DependencyFilterIcon
  },
  props: {
    hasNewProfileLink: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...userProfileGetters
  },
  methods: {
    ...userProfileActions,
    ...customSearchSourcesActions,
    ...interfaceActions,
    selectUserProfile(profile) {
      const index = this.profiles.indexOf(profile)
      this.selectProfile(index)
      this.setCustomSourceTagsFromUserProfile()
    },
    createNewProfile(close) {
      close()
      this.$store.dispatch('updateSearchIsFullWindow', false)
      this.updateViewable({ type: 'settings' })
      this.$nextTick(() => {
        this.updateViewPaneState({
          activeTab: 'user-profile'
        })
      })
      this.setNewProfileCreation(true)
    }
  }
}
</script>
