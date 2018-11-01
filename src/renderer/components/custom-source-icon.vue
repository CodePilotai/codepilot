<template>
  <img
    ref="customSourceIcon"
    :src="customSourceIcon"
    class="w-6 h-6 rounded-sm mr-2 bg-white"
    alt="placeholder"
    @error="handleCustomSourceIconError()"
  >
</template>
<script>
import getDomain from '@helpers/get-domain'
import { customSearchSourcesGetters } from '@state/helpers'
export default {
  props: {
    url: {
      type: String,
      required: true
    }
  },
  computed: {
    ...customSearchSourcesGetters,
    customSourceIcon() {
      return `https://codepilot-custom-source-icons.herokuapp.com/icon?url=${getDomain(
        this.url
      )}&size=64`
    }
  },
  methods: {
    handleCustomSourceIconError() {
      const url = this.url.replace(/www./, '')
      const customSourceWithIcon = this.filteredAvailableCustomSearchSources
        .concat(this.userAddedCustomSources)
        .filter(source => source.icon)
        .find(source => getDomain(source.url) === getDomain(this.url)).icon[0]
        .url
      // if there is an error and we do not have a matching icon stored in airtable, default to a letter icon
      if (!customSourceWithIcon) {
        this.$refs.customSourceIcon.src = `https://codepilot-custom-source-icons.herokuapp.com/lettericons/${getDomain(
          url
        ).toUpperCase()}-64.png`
      } else {
        this.$refs.customSourceIcon.src = customSourceWithIcon
      }
    }
  }
}
</script>
