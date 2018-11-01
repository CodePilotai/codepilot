<template>
  <AppToggle
    v-tooltip.bottom="'Click to toggle Light/Dark Theme'"
    :toggle-buttons="toggleThemes"
    :value="selectedTheme"
    @toggle="updateTheme"
  />
</template>

<script>
import { interfaceGetters, interfaceActions } from '@state/helpers'

export default {
  computed: {
    ...interfaceGetters,
    toggleThemes() {
      return [
        {
          ...this.themes[0],
          icon: 'moon-o'
        },
        {
          ...this.themes[1],
          icon: 'sun-o'
        }
      ]
    },
    selectedTheme() {
      return this.toggleThemes.find(theme => theme.key === this.currentThemeKey)
    }
  },
  methods: {
    ...interfaceActions
  }
}
</script>
