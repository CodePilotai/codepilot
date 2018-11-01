<template>
  <div>
    <div class="mr-3">
      <h2>Profiles</h2>
      <p>Profiles give you the ability to configure CodePilot.ai to your specific skills, environment and project. Choose from one of our examples and modify them or create your own. This is a new capability and we have a lot planned.
      </p>
    </div>


    <div
      v-if="isEditingTemporaryProfile"
      class="mb-3 mr-3"
    >
      <AppInputTextLabel>
        Profile Name
      </AppInputTextLabel>
      <div class="flex">
        <AppInputText
          v-model="newProfileKey"
          class="w-64 mr-3"
        />
        <AppButton
          class="mr-3"
          type="danger"
          @click="setNewProfileCreation(false)"
        >
          Cancel
        </AppButton>
        <AppButton
          type="primary"
          @click="validateAndUpdateProfileName"
        >
          Save
        </AppButton>
        <div
          v-if="!$v.newProfileKey.isUniqueKey"
          class="text-red ml-3 h-full self-center"
        >
          Profile not saved - Duplicate Profile Name.
        </div>
        <div
          v-else
          class="ml-3 h-full self-center"
        >
          Note: Make sure you name your profiles uniquely.
        </div>
      </div>
    </div>
    <div
      v-else
      class="mb-3 mr-3"
    >
      <AppInputTextLabel>
        Profile
      </AppInputTextLabel>
      <div class="flex">
        <SelectedProfile class="w-48 mr-3"/>
        <div class="flex ">
          <AppButton
            :disabled="profiles.length - 1 < 1"
            type="danger"
            class="mr-3"
            @click="deleteCurrentProfile"
          >
            Delete Profile
          </AppButton>
          <AppButton
            class="sm:ml-auto xl:ml-3"
            @click="setNewProfileCreation(true)"
          >
            Create New Profile
          </AppButton>
        </div>
      </div>
    </div>


    <div class="flex mr-3">
      <div class="flex flex-col w-48">
        <div
          v-for="tab in tabs"
          :key="tab.key"
          :class="[
            'flex h-12 w-48 bg-transparent items-center text-right pr-2 cursor-pointer',
            {
              ['border-primary bg-grey-lighter border-b-2 ']: activeTabKey === tab.key,
              ['border-b-0']: activeTabKey !== tab.key
            }
          ]"
          @click="activeTabKey=tab.key"
        >
          <p class="flex-grow m-0 p-0">{{ tab.label }}</p>
          <AppIcon
            :class="['text-primary pl-1 visible', {['invisible']: !updatedTabs.includes(tab.key)}]"
            icon="check"
          />
        </div>
      </div>

      <div class="bg-grey-lighter w-full px-6 pt-4">
        <div v-if="activeTabKey === 'personalInfo'">
          <h3>Spoken Languages:</h3>
          <p class="-mt-3">Let us know the language you are most comfortable speaking in.</p>
          <div class="flex sm:flex-col xl:flex-row">
            <div class="w-64 mr-3">
              <AppInputTextLabel>
                Primary Spoken Language
              </AppInputTextLabel>
              <AppInputText
                :value="selectedProfile.primaryLanguage"
                @input="updateUserProfile({ primaryLanguage: $event })"
              />
            </div>
            <div class="w-64">
              <AppInputTextLabel>
                Secondary Spoken Language
              </AppInputTextLabel>
              <AppInputText
                :value="selectedProfile.secondaryLanguage"
                @input="updateUserProfile({ secondaryLanguage: $event })"
              />
            </div>
          </div>
          <div>
            <AppInputTextLabel>
              Timezone
            </AppInputTextLabel>
            <p>You are currently in {{ selectedProfile.timezone }} </p>
          </div>
        </div>
        <div v-if="activeTabKey === 'os'">
          <div>
            <h3>Operating System:</h3>
            <p class="-mt-3">We detect you have</p>
            <p><strong>Operating System</strong>: {{ selectedProfile.os.distro }}</p>
            <p><strong>Architecture</strong>: {{ selectedProfile.os.arch }}</p>
          </div>
        </div>
        <div v-if="activeTabKey === 'ide'">
          <div>
            <h3>Editors:</h3>
            <p class="-mt-3">Is there an Editor(IDE) you like to use for current project (could be more than one)?</p>
            <Multiselect
              id="ide"
              :close-on-select="false"
              :value="selectedProfile.ide"
              :options="userProfileMultiselectOptions.ide"
              :multiple="true"
              :taggable="true"
              :option-height="45"
              placeholder="Start Typing..."
              @tag="addCustom"
              @input="updateUserProfile({ ide: $event })"
            >
              <div
                slot="caret"
                slot-scope="{ toggle }"
                class="multiselect__select"
              >
                <AppIcon icon="chevron-down" />
              </div>
            </Multiselect>
          </div>
        </div>
        <div v-if="activeTabKey === 'programmingLanguages'">
          <div>
            <h3>Programming Languages:</h3>
            <p class="-mt-3">Choose all the Programing Languages you use for your current project.</p>

            <Multiselect
              id="programmingLanguages"
              :close-on-select="false"
              :value="selectedProfile.programmingLanguages"
              :options="userProfileMultiselectOptions.programmingLanguages"
              :multiple="true"
              :taggable="true"
              :option-height="45"
              placeholder="Start Typing..."
              @input="updateUserProfile({ programmingLanguages: $event })"
              @tag="addCustom"
            >
              <div
                slot="caret"
                slot-scope="{ toggle }"
                class="multiselect__select"
              >
                <AppIcon icon="chevron-down" />
              </div>
            </Multiselect>
          </div>
        </div>
        <div v-if="activeTabKey === 'frameworks'">
          <div>
            <h3>Frameworks:</h3>
            <p class="-mt-3">What Frameworks or Libraries do you use to build your current project?</p>

            <Multiselect
              id="frameworks"
              :close-on-select="false"
              :value="selectedProfile.frameworks"
              :options="userProfileMultiselectOptions.frameworks"
              :multiple="true"
              :option-height="45"
              :taggable="true"
              placeholder="Start Typing..."
              @input="updateUserProfile({frameworks: $event})"
              @tag="addCustom"
            >
              <div
                slot="caret"
                slot-scope="{ toggle }"
                class="multiselect__select"
              >
                <AppIcon icon="chevron-down" />
              </div>
            </Multiselect>
          </div>
        </div>
        <div v-if="activeTabKey === 'testingTools'">
          <div>
            <h3>Testing Tools:</h3>
            <p class="-mt-3">Which of these Tools or Frameworks do you use for testing your current project?</p>

            <Multiselect
              id="testingTools"
              :close-on-select="false"
              :value="selectedProfile.testingTools"
              :options="userProfileMultiselectOptions.testingTools"
              :multiple="true"
              :taggable="true"
              :option-height="45"
              placeholder="Start Typing..."
              @input="updateUserProfile({testingTools: $event})"
              @tag="addCustom"
            >
              <div
                slot="caret"
                slot-scope="{ toggle }"
                class="multiselect__select"
              >
                <AppIcon icon="chevron-down" />
              </div>
            </Multiselect>
          </div>
        </div>
        <div v-if="activeTabKey === 'databases'">
          <div >
            <h3>Database:</h3>
            <p class="-mt-3">Do you use any of these Databases for your current project?</p>

            <Multiselect
              id="databases"
              :close-on-select="false"
              :value="selectedProfile.databases"
              :options="userProfileMultiselectOptions.databases"
              :multiple="true"
              :taggable="true"
              :option-height="45"
              placeholder="Start Typing..."
              @input="updateUserProfile({databases: $event})"
              @tag="addCustom"
            >
              <div
                slot="caret"
                slot-scope="{ toggle }"
                class="multiselect__select"
              >
                <AppIcon icon="chevron-down" />
              </div>
            </Multiselect>
          </div>
        </div>
        <div v-if="activeTabKey === 'appServers'">
          <div>
            <h3>App Servers:</h3>
            <p class="-mt-3">What Hosting Platform do you use currently for your project?</p>

            <Multiselect
              id="appServers"
              :close-on-select="false"
              :value="selectedProfile.appServers"
              :options="userProfileMultiselectOptions.appServers"
              :multiple="true"
              :taggable="true"
              :option-height="45"
              placeholder="Start Typing..."
              @input="updateUserProfile({appServers: $event})"
              @tag="addCustom"
            >
              <div
                slot="caret"
                slot-scope="{ toggle }"
                class="multiselect__select"
              >
                <AppIcon icon="chevron-down" />
              </div>
            </Multiselect>
          </div>
        </div>
        <div v-if="activeTabKey === 'xaas'">
          <div>
            <h3>X as a Service:</h3>
            <p class="-mt-3">Do you use any of these services currently for your project?</p>

            <Multiselect
              id="xaas"
              :close-on-select="false"
              :value="selectedProfile.xaas"
              :options="userProfileMultiselectOptions.xaas"
              :multiple="true"
              :taggable="true"
              :option-height="45"
              placeholder="Start Typing..."
              @input="updateUserProfile({xaas: $event})"
              @tag="addCustom"
            >
              <div
                slot="caret"
                slot-scope="{ toggle }"
                class="multiselect__select"
              >
                <AppIcon icon="chevron-down" />
              </div>
            </Multiselect>
          </div>
        </div>
        <div v-if="activeTabKey === 'docs'">
          <div>
            <h2>Docs</h2>
            <p>
              By filling the below field, we’re able to preconfigure devdocs.io visits to use only the selected docs when using the <strong>DOCS</strong> intent.
            </p>

            <Multiselect
              id="docs"
              :close-on-select="false"
              :value="selectedProfileDocs"
              :options="devdocsList"
              :multiple="true"
              :option-height="45"
              placeholder="Select Docs..."
              @input="updateUserProfile({ docs: $event })"
            >
              <div
                slot="caret"
                slot-scope="{ toggle }"
                class="multiselect__select"
              >
                <AppIcon icon="chevron-down" />
              </div>
            </Multiselect>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { userProfileActions, userProfileGetters } from '@state/helpers'
import { required } from 'vuelidate/lib/validators'
import Multiselect from 'vue-multiselect'
import SelectedProfile from './selected-profile'

export default {
  components: {
    Multiselect,
    SelectedProfile
  },
  data() {
    return {
      newProfileKey: 'New Profile',
      activeTabKey: 'personalInfo',
      updatedTabs: [],
      tabs: [
        { key: 'personalInfo', label: 'Personal Information' },
        { key: 'os', label: 'Operating System' },
        { key: 'ide', label: 'Editor (IDE)' },
        { key: 'programmingLanguages', label: 'Programming Languages' },
        { key: 'frameworks', label: 'Frameworks/Libraries' },
        { key: 'testingTools', label: 'Testing Tools/Frameworks' },
        { key: 'databases', label: 'Databases' },
        { key: 'appServers', label: 'App Servers' },
        { key: 'xaas', label: 'X as a Service' },
        { key: 'docs', label: 'Docs' }
      ]
    }
  },
  computed: {
    ...userProfileGetters
  },
  watch: {
    selectedProfile: {
      handler(newProfileValues) {
        this.updateTabCheckMarks(newProfileValues)
      },
      deep: true
    }
  },
  validations: {
    newProfileKey: {
      required,
      isUniqueKey: (newKey, profiles) => {
        return !profiles.profiles.some(profile => profile.key === newKey)
      }
    }
  },
  created() {
    this.updateTabCheckMarks(this.selectedProfile)
  },
  beforeDestroy() {
    if (this.$v && this.isEditingTemporaryProfile) {
      this.$v.newProfileKey.isUniqueKey
        ? this.saveTemporaryProfile()
        : this.setNewProfileCreation(false)
    }
  },
  methods: {
    ...userProfileActions,
    validateAndUpdateProfileName(event) {
      if (this.$v.newProfileKey.isUniqueKey) {
        this.updateUserProfile({ key: this.newProfileKey })
        this.saveTemporaryProfile(event)
        this.newProfileKey = 'New Profile'
      }
    },
    updateTabCheckMarks(userProfileValues) {
      this.updatedTabs = []

      Object.keys(userProfileValues).forEach(key => {
        userProfileValues[key].length
          ? this.updatedTabs.push(key)
          : this.updatedTabs.filter(e => e !== key)
      })
      this.updatedTabs.push('os')

      userProfileValues.primaryLanguage.length ||
      userProfileValues.secondaryLanguage.length
        ? this.updatedTabs.push('personalInfo')
        : this.updatedTabs.filter(e => e !== 'personalInfo')
    },
    addCustom(option, id) {
      this.addCustomOptionAndSelect({
        option,
        collection: id
      })
    }
  }
}
</script>
