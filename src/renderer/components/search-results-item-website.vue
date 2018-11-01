<template>
  <SearchResultsItem
    v-bind="boundSublistData"
    v-on="$listeners"
  >
    <CustomSourceIcon
      slot="icon"
      :url="result.url"
    />

    <template slot="title">
      {{ resultName }}
    </template>
  </SearchResultsItem>
</template>

<script>
import SearchResultsItem from './search-results-item'
import CustomSourceIcon from './custom-source-icon'
import getDomain from '@helpers/get-domain'
import { interfaceGetters } from '@state/helpers'

export default {
  components: {
    CustomSourceIcon,
    SearchResultsItem
  },
  props: {
    result: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...interfaceGetters,
    resultName() {
      return this.result.name || getDomain(this.result.url)
    },
    boundSublistData() {
      return { ...this.$props, ...this.$attrs }
    }
  }
}
</script>

<style lang="scss" module>
@import '~@branding';

.favicon {
  background-color: lightgray;
}
</style>
