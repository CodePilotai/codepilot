<template>
  <SearchResultsItem
    v-bind="boundSublistData"
    v-on="$listeners"
  >
    <AppIconFile
      slot="icon"
      :icon-class="result.language.iconClass"
      class="text-2xl"
    />
    <template slot="title">
      {{ pathDisplayName }}
    </template>

    <div
      v-if="result.repo"
      slot="meta"
      :class="$style.sourceInformation"
    >
      <div
        v-tooltip.bottom="'Found in ' + (result.repo.fullName || result.repo)"
        class="flex flex-no-shrink items-center h-6 font-semibold leading-normal"
      >
        <AppIcon
          source="octicon"
          icon="repo"
          class="mr-2 text-base"
        />
        <span>{{ result.repo.name || result.repo }}</span>
      </div>
    </div>

    <div slot="content">
      <SearchResultsItemSublist
        :result="result"
        v-on="$listeners"
      >
        <AppHighlight
          slot="branch"
          slot-scope="{ branch }"
          :body="branch.file.line.body"
          :matcher="submittedQuery.text"
          :use-regex="submittedQuery.useRegex"
          :class-name="'p-1 shadow-text text-white rounded-sm ' + $style.appHighlight"
        />
      </SearchResultsItemSublist>
    </div>
  </SearchResultsItem>
</template>

<script>
import SearchResultsItem from './search-results-item'
import SearchResultsItemSublist from './search-results-item-sublist'
import { searchGetters, editorGetters } from '@state/helpers'
import resultBranchRef from '@helpers/result-branch-ref'
import path from 'path'

export default {
  components: {
    SearchResultsItem,
    SearchResultsItemSublist
  },
  props: {
    result: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...editorGetters,
    ...searchGetters,
    boundSublistData() {
      return { ...this.$props, ...this.$attrs }
    },
    pathDisplayName() {
      const filePath = this.result.relativePath || this.result.path

      let fileDisplayName = ''
      let pathChunks = filePath.split(path.sep)

      let fileName = pathChunks.pop()
      let folderName = pathChunks.pop()
      if (folderName)
        fileDisplayName = '...' + path.sep + folderName + path.sep + fileName
      else fileDisplayName = fileName
      return fileDisplayName
    }
  },
  methods: {
    branchRef(branch) {
      return resultBranchRef(this.result, branch)
    }
  }
}
</script>

<style lang="scss" module>
@import '~@branding';

.app-highlight {
  background: var(--syntax-highlighted-bg);
}
</style>
