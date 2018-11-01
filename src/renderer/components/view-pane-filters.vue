<template>
  <div class="overflow-scroll">
    <div class="p-4 flex justify-between">
      <h1 class="mb-0">Filters</h1>
      <AppButton
        icon="times"
        @click="updateViewable({ type: 'result' })"
      />
    </div>
    <component
      v-for="(filter, index) of selectedSearchIntent.filters"
      :key="index"
      :is="filter.component"
      class="mb-8"
    />
  </div>
</template>

<script>
import { searchGetters, interfaceActions } from '@state/helpers'

export default {
  computed: searchGetters,
  methods: interfaceActions
}
</script>
