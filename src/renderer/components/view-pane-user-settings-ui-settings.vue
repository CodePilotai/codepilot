<template>
  <div>
    <div class="mr-3">
      <h3>UI Settings</h3>
      <p>
        Modify the UI according to your likings.
      </p>
    </div>

    <AppInputText
      :value="codeFontSize"
      data-e2e="InterfaceOptions-fontSize"
      label="Font Size"
      type="number"
      @change="updateCodeFontSize"
    />
    <AppInputText
      :value="codeFontFamily"
      data-e2e="InterfaceOptions-fontFamily"
      label="Font Family"
      @change="updateCodeFontFamily"
    />
    <AppInputCheckbox
      :checked="minimapIsEnabled"
      class="my-2"
      label="Minimap"
      help-text="Enable minimap navigation for code in the editor"
      @change="toggleMinimapEnabled"
    />
    <AppInputCheckbox
      :checked="editorIsWordWrap"
      class="my-2"
      label="Word wrap"
      help-text="Enable word wrap for code in the editor"
      @change="updateEditorWordWrap"
    />

    <AppInputTextLabel>
      Theme
    </AppInputTextLabel>
    <AppSelect
      :options="themes"
      :value="currentThemeKey"
      @input="updateTheme"
    />
    <AppInputTextLabel>
      Zoom
    </AppInputTextLabel>
    <AppButton
      class="mx-1"
      @click="zoomIn"
    >
      <AppIcon
        icon="search-plus"
        class="mr-1"
      />
      Zoom In
    </AppButton>
    <AppButton
      class="mx-1"
      @click="zoomOut"
    >
      <AppIcon
        icon="search-minus"
        class="mr-1"
      />
      Zoom Out
    </AppButton>
    <AppButton
      class="mx-1"
      @click="resetZoom"
    >
      <AppIcon
        icon="refresh"
        class="mr-1"
      />
      Reset Zoom
    </AppButton>
  </div>
</template>

<script>
import {
  interfaceGetters,
  interfaceActions,
  editorGetters,
  editorActions
} from '@state/helpers'

export default {
  computed: {
    ...editorGetters,
    ...interfaceGetters
  },
  methods: {
    ...interfaceActions,
    ...editorActions,
    zoomIn() {
      this.updateZoomFactor('zoomIn')
    },
    zoomOut() {
      this.updateZoomFactor('zoomOut')
    },
    resetZoom() {
      this.updateZoomFactor('resetZoom')
    }
  }
}
</script>
