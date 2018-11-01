<template>
  <SearchResultsItem
    v-bind="boundSublistData"
    v-on="$listeners"
  >
    <AppIcon
      slot="icon"
      class="w-6 h-6 m-0 text-2xl"
      source="octicon"
      icon="git-commit"
    />
    <template slot="title">
      {{ messageFirstLine }}
    </template>

    <div
      slot="meta"
      class="flex items-center"
    >
      <div :class="['flex flex-no-shrink items-center h-6 mt-1 mr-1 mb-0 ml-0 font-semibold leading-normal']">
        <AppIcon
          icon="user"
          class="mr-1 text-base"
        />
        {{ result.repo.owner.name }}
      </div>
      /
      <div :class="['flex flex-no-shrink items-center h-6 mt-1 mr-3 ml-1 mb-0 ml-0 font-semibold leading-normal']">
        <AppIcon
          source="octicon"
          icon="repo"
          class="mr-1 text-base"
        />
        {{ result.repo.name }}
      </div>
      <div
        v-tooltip.left="'Committed on ' + formatRelativeDate(result.commitDate)"
        v-if="result.last_activity_date"
        :class="$style.iconWithLabel"
        class="flex flex-no-shrink items-center h-6 mt-1 mr-3 mb-0 ml-0 font-semibold leading-normal"
      >
        <AppIcon
          icon="clock-o"
          class="mr-1 text-base"
        />
        {{ formatDate(result.commitDate) }}
      </div>
    </div>

    <div slot="content">
      <div
        v-if="messageRestLimited.length"
        class="px-3 pb-3 mb-1"
      >
        {{ messageRestLimited }}
      </div>
      <SearchResultsItemSublist
        :result="result"
        v-on="$listeners"
      >
        <div
          slot="branch"
          slot-scope="{ branch }"
        >
          {{ branch.filename }}
        </div>
      </SearchResultsItemSublist>
    </div>
  </SearchResultsItem>
</template>

<script>
import SearchResultsItem from './search-results-item'
import SearchResultsItemSublist from './search-results-item-sublist'
import resultBranchRef from '@helpers/result-branch-ref'
import { searchGetters, editorGetters } from '@state/helpers'

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
    ...searchGetters,
    ...editorGetters,
    boundSublistData() {
      return { ...this.$props, ...this.$attrs }
    },
    messageList() {
      return this.result.message.split('\n')
    },
    messageFirstLine() {
      const firstLine = this.messageList[0]

      if (firstLine.length > 45) {
        return firstLine.substring(0, 45) + '...'
      } else {
        return firstLine
      }
    },
    messageRestLimited() {
      const message = this.messageList
        .slice(1)
        .join('\n')
        .substring(0, 200)
      const lines = message.split(/\n/)
      return lines.slice(0, 4).join('\n')
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

.commit-icon {
  &::before {
    font-size: 2.5em;
  }
}

.large-icon {
  &::before {
    font-size: $search-result-meta-line-height;
  }
}
</style>
