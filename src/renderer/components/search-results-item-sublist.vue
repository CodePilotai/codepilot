<template>
  <ul
    :class="$style.branchList"
    class="m-0"
  >
    <li
      v-for="(branch, index) in result.branches"
      :key="branch.key"
      class="font-mono whitespace-no-wrap cursor-pointer"
    >
      <div
        :class="[
          'py-1 px-3',
          $style.branchItemResult,
          { [$style.selected]: selectedBranch && selectedBranch.key === branch.key },
          { [$style.notFocused]: editorFocused }
        ]"
        :data-ref="branchRef(branch)"
        @click.stop="$emit('select', { result, branch })"
      >
        <slot
          :branch="branch"
          :index="index"
          name="branch"
        />
      </div>
    </li>
  </ul>
</template>

<script>
import { editorGetters, searchGetters } from '@state/helpers'
import resultBranchRef from '@helpers/result-branch-ref'

export default {
  props: {
    result: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...editorGetters,
    ...searchGetters
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

.branch-list {
  background: var(--search-result-branches-bg);
  transition: $fade-transition;
}

.branch-item-result {
  &:hover {
    background: var(--selectable-hovered-bg);
  }
}

.selected.selected {
  display: block;
  color: var(--selectable-color);
  background: var(--selectable-selected-bg);

  &:hover {
    background: var(--selectable-selected-bg);
  }

  &.not-focused {
    background: var(--selectable-hovered-bg);
  }
}
</style>
