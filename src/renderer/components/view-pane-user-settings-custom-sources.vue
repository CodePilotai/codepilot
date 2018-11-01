<template>
  <div :class="$style.container">
    <div class="flex mr-3">
      <div class="flex-1">
        <h3>Custom Sources</h3>
        <p>
          Find content from your favorite places based on your user profile.
        </p>
      </div>
      <div class="flex flex-col flex-1">
        <div class="ml-4">
          <h3>Profile</h3>
          <SelectedProfile/>
        </div>
      </div>
    </div>

    <div class="flex pb-3">
      <div class="w-1/2 h-full border-r border-grey-darker">
        <div class="pr-3 pt-4 h-32">
          <h3 class="mb-2">Available Custom Sources</h3>
          <AppInputCheckbox
            :checked="!shouldFilterByTag"
            class="mb-0 pl-0"
            label="Show all custom sources"
            @change="toggleFilterByTag()"
          />
          <p class="mb-0">
            {{ availableCustomSourcesCountMessage }}
          </p>
        </div>
        <div
          :class="$style.customSourcesContainer"
          class="pr-3 py-2"
        >
          <AppCard
            v-for="(source, key) in filteredAvailableCustomSearchSourcesNotAdded"
            :key="key"
            :label="source.label"
            :url="source.url"
            :installs="source.installs"
            :description="source.description"
          >
            <div slot="icon">
              <CustomSourceIcon :url="source.url"/>
            </div>
            <div slot="action-buttons">
              <AppButton
                :disabled="alreadyExist(source)"
                @click="addToCustomSources(source)"
              >
                <AppIcon
                  icon="plus"
                />
              </AppButton>
            </div>
          </AppCard>
        </div>
      </div>
      <div class="w-1/2">
        <div class="px-3 pt-4 h-32 flex-1">
          <AppButton
            class="mb-1"
            @click="editCustomSource(localCustomSource)"
          >
            Create new Custom Source
            <AppIcon
              icon="plus"
              class="ml-1"
            />
          </AppButton>
          <h3 class="mb-4 mt-1">Installed Custom Sources ( {{ installedCustomSourcesCountMessage }} )</h3>
        </div>
        <div
          :class="$style.customSourcesContainer"
          class="px-3 py-2"
        >
          <AppCard
            v-for="source in userAddedCustomSources"
            :key="source.key"
            :label="source.label"
            :url="source.url"
            :description="source.description ? source.description : 'My awesome custom source'"
          >
            <div slot="icon">
              <CustomSourceIcon :url="source.url"/>
            </div>
            <div slot="action-buttons">
              <AppButton @click="editCustomSource(source)">
                <AppIcon icon="edit"/>
              </AppButton>
              <AppButton @click="checkBeforeRemoveCustomSource(source)">
                <AppIcon icon="trash"/>
              </AppButton>
            </div>
          </AppCard>
          <hr>
          <AppCard
            v-for="source in selectedProfile.customSources"
            :key="source.key"
            :label="source.label"
            :url="source.url"
            :description="source.description ? source.description : 'My awesome custom source'"
          >
            <div slot="icon">
              <CustomSourceIcon :url="source.url"/>
            </div>
            <div slot="action-buttons">
              <AppButton @click="editCustomSource(source)">
                <AppIcon icon="edit"/>
              </AppButton>
              <AppButton @click="checkBeforeRemoveCustomSource(source)">
                <AppIcon icon="trash"/>
              </AppButton>
            </div>
          </AppCard>
        </div>
        <div class="border-t p-3">
          <template v-if="!isConfirmingReset">
            <AppButton
              type="danger"
              @click="isConfirmingReset = true"
            >
              Reset custom sources
            </AppButton>
          </template>
          <template v-else>
            <p>Reset will replace current Custom Sources with defaults</p>
            <AppButton
              @click="isConfirmingReset = false"
            >
              Cancel
            </AppButton>
            <AppButton
              type="danger"
              @click="resetSources"
            >
              Reset
            </AppButton>
          </template>
        </div>
      </div>
    </div>

    <AppModal
      v-if="editingCustomSource"
      class="w-full"
      title="Add/Modify Custom Source "
      @close="editingCustomSource = false"
    >
      <h3>How to add your own sources</h3>
      <p>Fill in the above with a Label, Website Address and select a Search Category</p>
      <ul v-pre>
        <li v-pre>- Pass your search term as a parameter using {{ query }}</li>
        <li>- Or use your search term to run a Google custom search</li>
        <li>- Don't use either of the above options it will just open the website address</li>
      </ul>

      <CustomSourceForm
        :key=" customSourceFormIndex"
        :index=" customSourceFormIndex"
        :source="selectedCustomSource"
        :intents="filteredSearchIntents"
        :data-e2e-sources="userAddedCustomSources"
        @update="updateAndAddCustomSource"
        @remove="checkBeforeRemoveCustomSource(selectedCustomSource)"
      />
    </AppModal>
  </div>
</template>

<script>
import {
  customSearchSourcesGetters,
  customSearchSourcesActions,
  userProfileActions,
  userProfileGetters,
  searchGetters
} from '@state/helpers'
import CustomSourceForm from './custom-source-form'
import CustomSourceCard from './custom-source-card'
import SelectedProfile from './selected-profile'
import CustomSourceIcon from './custom-source-icon'

export default {
  components: {
    CustomSourceCard,
    CustomSourceIcon,
    CustomSourceForm,
    SelectedProfile
  },
  data() {
    return {
      isConfirmingReset: false,
      editingCustomSource: false,
      localCustomSource: {
        intent: { name: 'Select', label: 'Select' },
        isSearched: false,
        label: '',
        url: ''
      },
      sources: [],
      selectedCustomSource: null
    }
  },
  computed: {
    ...userProfileGetters,
    ...customSearchSourcesGetters,
    ...searchGetters,
    customSourceFormIndex() {
      return this.userAddedCustomSources.findIndex(
        source => source.key === this.getSelectedCustomSource.key
      )
    },
    getSelectedCustomSource() {
      return this.selectedCustomSource || this.localCustomSource
    },
    filteredSearchIntents() {
      return this.searchIntents
    },
    emptyRowNotPresent() {
      return (
        this.userAddedCustomSources.length === 0 ||
        !(
          this.userAddedCustomSources[this.userAddedCustomSources.length - 1]
            .url === '' &&
          this.userAddedCustomSources[this.userAddedCustomSources.length - 1]
            .label === ''
        )
      )
    },
    filteredAvailableCustomSearchSourcesNotAdded() {
      return this.filteredAvailableCustomSearchSources.filter(
        availableSource =>
          !this.sources.find(source => availableSource.key === source.key)
      )
    },
    availableCustomSourcesCountMessage() {
      return this.filteredAvailableCustomSearchSourcesNotAdded.length === 1
        ? `${
            this.filteredAvailableCustomSearchSourcesNotAdded.length
          } Available Custom Source`
        : `${
            this.filteredAvailableCustomSearchSourcesNotAdded.length
          } Available Custom Sources`
    },
    installedCustomSourcesCountMessage() {
      return this.totalSourcesUsedCount
    },
    totalSourcesUsedCount() {
      return (
        this.userAddedCustomSources.length +
        this.selectedProfile.customSources.length
      )
    }
  },
  watch: {
    'selectedProfile.key': {
      immediate: true,
      handler() {
        this.sources = this.sources.concat(this.selectedProfile.customSources)
      }
    }
  },
  methods: {
    ...userProfileActions,
    ...customSearchSourcesActions,
    editCustomSource(source) {
      this.selectedCustomSource = source
      this.editingCustomSource = true
    },
    updateAndAddCustomSource(source) {
      this.updateCustomSource(source)
      this.editingCustomSource = false
    },
    checkBeforeRemoveCustomSource(source) {
      this.sources = this.sources.filter(index => index.key !== source.key)
      this.updateUserProfile({ customSources: this.sources })
      this.editingCustomSource = false
    },
    resetSources() {
      this.updateUserProfile({ customSources: [] })
      this.isConfirmingReset = false
    },
    addToCustomSources(source) {
      this.sources = this.sources.concat(source)
      this.updateUserProfile({ customSources: this.sources })
    },
    alreadyExist(source) {
      return this.selectedProfile.customSources.find(
        existingSource => existingSource.key === source.key
      )
    }
  }
}
</script>

<style module lang="scss">
@import '~@branding';

.container {
  min-height: 100vh;
}

.query-example {
  min-height: $grid-padding * 5;
  word-break: break-all;
}

.custom-sources-container {
  height: 100%;
  max-height: 60vh;
  overflow: overlay;
}
</style>
