<template>
  <div class="flex flex-col h-full">
    <div class="flex flex-no-shrink items-center p-2 bg-grey-darker border-b border-solid">
      <AppButton
        v-tooltip:right="'Delete note'"
        class="ml-2"
        @click="deleteGroupsNote"
      >
        <AppIcon icon="trash"/>
      </AppButton>
      <div class="flex justify-between self-center items-center h-10">
        <div class="flex justify-between">
          <div class="flex flex-no-shrink my-0 mx-4">
            <div>Title: {{ currentGroupsNote.title }}</div>
          </div>
          <div
            v-if="groupIsSolved"
            class="flex-no-shrink my-0 mx-4"
          >
            Solved
            <AppIcon
              class="text-green"
              icon="check"
            />
          </div>
          <div class="flex flex-no-shrink my-0 mx-4">
            <AppIcon
              icon="clock-o"
              class="mr-1"
            />
            <div>Created on:  {{ formatDate(currentGroupsNote.createdAt) }} </div>
          </div>
          <div class="flex flex-no-shrink my-0 mx-4">
            <AppIcon
              icon="clock-o"
              class="mr-1"
            />
            <div>Updated on: {{ updateAtText }} </div>
          </div>
        </div>
      </div>
    </div>
    <div
      :class="$style.editorWrapper"
      class="flex-grow h-full pl-3 bg-grey"
    >
      <TheEditor
        :value="currentGroupsNote.body"
        @change="updateNoteBody"
      />
    </div>
  </div>
</template>
<script>
import debounce from 'lodash/debounce'
import formatDate from '@helpers/format-date'
import { pinsActions, pinsGetters } from '@state/helpers'
import TheEditor from './the-editor'
export default {
  components: {
    TheEditor
  },
  data() {
    return {
      noteFinishedSaving: false
    }
  },
  computed: {
    ...pinsGetters,
    updateAtText() {
      const { updatedAt } = this.currentGroupsNote
      return !updatedAt ? 'No changes made' : formatDate(updatedAt)
    },
    groupIsSolved() {
      return this.pinnedResultsGroups.some(
        group =>
          group.name === this.currentGroupsNote.groupName && group.isSolved
      )
    }
  },
  methods: {
    ...pinsActions,
    formatDate,
    updateNoteBody: debounce(function(input) {
      // use debounce to enable autosave after 500 milliseconds delay
      this.updateCurrentGroupsNoteBody(input)
    }, 500)
  }
}
</script>
<style lang="scss" module>
@import '~@branding';

.container {
  border-bottom: $app-border;
}

.editor-wrapper {
  transition: $fade-transition;
}
</style>
