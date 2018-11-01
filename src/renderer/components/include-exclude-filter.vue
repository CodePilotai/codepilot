<template lang="html">
  <div class="flex flex-col">
    <div
      data-v-step="[filter-extension]"
      class="bg-grey-light py-3 px-4"
    >
      <h2 class="mb-0">
        Filter results by file name and extension
      </h2>
      <span>Applies to all file-based results
      </span>
    </div>
    <div
      class="flex justify-between px-4"
      data-e2e="TheSearchBar-advancedSearchRow"
    >
      <AppInputText
        v-tooltip.bottom="'Filename fragment you\'d like to include'"
        :value="query.includeOnly"
        placeholder="Example: '.js'"
        class="w-full mr-1"
        label="Only include"
        @input="updateQuery({ includeOnly: $event })"
      />
      <AppInputText
        v-tooltip.bottom="'Filename fragment you\'d like to exclude'"
        :value="query.exclude"
        placeholder="Example: '.json'"
        class="w-full ml-1"
        label="Exclude"
        @input="updateQuery({ exclude: $event })"
      />
    </div>
  </div>
</template>

<script>
import { searchGetters, searchActions } from '@state/helpers'

export default {
  computed: searchGetters,
  methods: searchActions
}
</script>
