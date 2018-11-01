<template lang="html">
  <AppIcon
    :class="{ 'opacity-25': !githubResultsDependencies.length }"
    class="ml-3 mr-1 bg-transparent"
    icon="filter"
    type="hollow"
    data-e2e="DependencyFilter-filterIcon"
    @click.stop.prevent="openFilters"
  />
</template>

<script>
import { searchGetters, interfaceActions } from '@state/helpers'

export default {
  props: {
    location: {
      type: String,
      required: true
    }
  },
  computed: {
    ...searchGetters
  },
  methods: {
    ...interfaceActions,
    openFilters() {
      this.toggleView({ type: 'filters' })
    }
  }
}
</script>
