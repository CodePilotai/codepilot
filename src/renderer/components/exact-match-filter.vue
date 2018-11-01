<template lang="html">
  <div class="flex flex-col">
    <div
      data-v-step="filter-exact-match"
      class="bg-grey-light py-3 px-4"
    >
      <h2 class="mb-0">
        Filter results by exact match
      </h2>
      <span>Applies to all results
      </span>
    </div>
    <div
      class="flex justify-between px-4"
      data-e2e="TheSearchBar-exactMatch"
    >
      <AppInputCheckbox
        :checked="$store.state.search.onlyExactResults"
        class="px-4 pt-4 -mb-0"
        label="Only include results that contain the whole search query"
        @change="toggleExactFilter"
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
