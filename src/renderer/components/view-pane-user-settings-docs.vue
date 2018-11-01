<template>
  <div>
    <div class="mr-3">
      <h2>Docs</h2>
      <p>
        By filling the below field, we’re able to preconfigure devdocs.io visits to use only the selected docs when using the <strong>DOCS</strong> intent.
      </p>
    </div>

    <div class="mb-3 mr-3">
      <AppInputTextLabel>
        Profile
      </AppInputTextLabel>
      <SelectedProfile class="w-48 mr-3"/>
    </div>

    <AppInputTextLabel>
      Selected Docs
    </AppInputTextLabel>
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
</template>

<script>
import { userProfileActions, userProfileGetters } from '@state/helpers'
import Multiselect from 'vue-multiselect'
import SelectedProfile from './selected-profile'

export default {
  components: {
    Multiselect,
    SelectedProfile
  },
  computed: {
    ...userProfileGetters
  },
  methods: {
    ...userProfileActions
  }
}
</script>
