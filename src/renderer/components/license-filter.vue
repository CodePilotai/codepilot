<template>
  <div class="flex flex-col">
    <div
      data-v-step="filter-license"
      class="bg-grey-light py-3 px-4 mb-4"
    >
      <h2 class="mb-0">
        Filter results by licenses
      </h2>
    </div>
    <div
      v-if="resultsLicenses.length"
      class="flex flex-col px-4"
    >
      <Multiselect
        :value="selectedLicenses"
        :options="resultsLicenses"
        :multiple="true"
        :option-height="45"
        label="name"
        track-by="name"
        placeholder="Select licenses..."
        @select="toggleLicense"
        @remove="toggleLicense"
      >
        <div
          slot="caret"
          class="multiselect__select"
        >
          <AppIcon icon="chevron-down" />
        </div>
      </Multiselect>
      <AppInputCheckbox
        :checked="allowResultsWithoutLicense"
        class="px-4 -mb-0 mt-2"	
        label="Show results without license"
        @change="updateResultsWithoutLicenses"
      />
    </div>
    <div
      v-else
      class="-mx-1"
    >
      <p class="ml-6">No existing licenses found</p>
    </div>
  </div>
</template>

<script>
import { searchGetters, searchActions } from '@state/helpers'
import Multiselect from 'vue-multiselect'

export default {
  components: { Multiselect },
  computed: {
    ...searchGetters,
    selectedLicenses() {
      return this.resultsLicenses.filter(license => license.checked)
    }
  },
  methods: {
    ...searchActions,
    toggleLicense(license) {
      this.setLicenseFilterChecked({
        names: [license.name],
        checked: !license.checked
      })
    }
  }
}
</script>
