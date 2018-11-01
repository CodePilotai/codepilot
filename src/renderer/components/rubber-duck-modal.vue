<template>
  <AppModal
    title="Rubber Duck Debugging"
    @close="updateRubberDuckModalShown(false)"
  >
    <div v-if="!isEditingExistingRubberDuckSession">
      <div class=" p-2">
        <p>
          Rubber Duck Debugging is a problem solving strategy.<br>
          By describing the problem to the duck you gain a better understanding of the problem and possibly find the answer or new approaches to solving it.
        </p>
        <AppLink
          v-tooltip.right="'What is Rubber Ducking?'"
          href="https://rubberduckdebugging.com/"
        >find out more
        </AppLink>
      </div>
      <div class="flex mt-4 mb-4">
        <AppButton @click="createNewRubberDuckSession()" >
          Create new session
          <AppIcon
            class="text-lg ml-1"
            icon="plus"/>
        </AppButton>
      </div>
      <div
        :class="$style.rubberDuckSessionsListContainer"
        class="pr-3 py-2"
      >
        <AppCard
          v-for="(session, key) in rubberDuckSessions"
          :key="key"
          :label="session.name"
          class="flex"
        >
          <div
            slot="icon"
            class="mr-2"
          >
            <RubberDuckIcon
              :size="32"
            />
          </div>
          <div slot="action-buttons">
            <AppButton
              v-tooltip:right="'Edit Rubber Duck Debugging Session'"
              @click="handleEditRubberDuckSession(session.key)"
            >
              <AppIcon icon="edit"/>
            </AppButton>
            <AppButton
              v-tooltip:right="'Delete Rubber Duck Debugging Session'"
              @click="deleteRubberDuckSession(session.key)"
            >
              <AppIcon icon="trash"/>
            </AppButton>
          </div>
        </AppCard>
      </div>
    </div>
    <RubberDuckForm
      v-if="isEditingExistingRubberDuckSession">
      <h3>{{ currentRubberDuckSession.name }}</h3>
      <div slot="formStep-0">
        <AppInputTextLabel>
          Session Name
        </AppInputTextLabel>
        <AppInputText
          :value="currentRubberDuckSession.name"
          :placeholder="rubberDuckSessionTemplate.name"
          @input="updateCurrentRubberDuckSessionField({text: $event, sessionField: 'name'})"
        />
      </div>
      <div slot="formStep-1">
        <AppInputTextLabel>
          {{ rubberDuckSessionTemplate.problemDescription.prompt }}
        </AppInputTextLabel>
        <AppTextarea
          :value="currentRubberDuckSession.problemDescription"
          :placeholder="rubberDuckSessionTemplate.problemDescription.response"
          @input="updateCurrentRubberDuckSessionField({text: $event, sessionField: 'problemDescription'})"
        />
      </div>
      <div slot="formStep-2">
        <AppInputTextLabel>
          {{ rubberDuckSessionTemplate.problemBackground.prompt }}
        </AppInputTextLabel>
        <AppTextarea
          :value="currentRubberDuckSession.problemBackground"
          :placeholder="rubberDuckSessionTemplate.problemBackground.response"
          @input="updateCurrentRubberDuckSessionField({text: $event, sessionField: 'problemBackground'})"
        />
      </div>
      <div slot="formStep-3">
        <AppInputTextLabel>
          {{ rubberDuckSessionTemplate.problemResearch.prompt }}
        </AppInputTextLabel>
        <AppTextarea
          :value="currentRubberDuckSession.problemResearch"
          :placeholder="rubberDuckSessionTemplate.problemResearch.response"
          @input="updateCurrentRubberDuckSessionField({text: $event, sessionField: 'problemResearch'})"
        />
      </div>
    </RubberDuckForm>
  </AppModal>
</template>
<script>
import RubberDuckForm from './rubber-duck-form'
import RubberDuckIcon from './rubber-duck-icon'
import {
  interfaceActions,
  interfaceGetters,
  pinsActions,
  pinsGetters
} from '@state/helpers'
const rubberDuckSessionTemplate = {
  name: 'How to set a data property asynchronously in Vue?',
  problemDescription: {
    prompt: 'Describe your current problem in detail',
    response: `Example: I am trying to set data property with results fetched from a currency exchange rates API, but the function that fetches the exchange rates returns a Promise instead of the actual exchange rates data.`
  },
  problemBackground: {
    prompt: 'Explain why you need to know the answer',
    response: `Example: Without the results from the currency exchange rates API users are unable to see balances in their currency.`
  },
  problemResearch: {
    prompt: 'What you have tried so far and why it did not work',
    response: `Example: I tried the following code snippet:
    currencyExchangeRates: fetch('endpoint').then(res =>
      res.json())
    ...
    created() {
      // logs Promise {<pending>} instead of exchange rates
      console.log(this.currencyExchangeRates)
    }`
  }
}
export default {
  components: { RubberDuckForm, RubberDuckIcon },
  data() {
    return {
      rubberDuckSessionTemplate,
      isEditingExistingRubberDuckSession: false
    }
  },
  computed: {
    ...interfaceGetters,
    ...pinsGetters
  },
  methods: {
    ...interfaceActions,
    ...pinsActions,
    handleEditRubberDuckSession(sessionKey) {
      this.updateCurrentRubberDuckSessionKey(sessionKey)
      this.isEditingExistingRubberDuckSession = true
    }
  }
}
</script>
<style module lang="scss">
@import '~@branding';

.rubber-duck-sessions-list-container {
  height: 400px;
  overflow: overlay;
}
</style>
