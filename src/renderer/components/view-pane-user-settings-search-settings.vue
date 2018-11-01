<template>
  <div>
    <div class="mr-3">
      <h3>Search Settings</h3>
      <p>
        You can customize the order in which the result groups will be sorted in the results column.
      </p>
    </div>

    <div
      v-for="(intent, index) of searchIntents"
      :key="intent.key"
    >
      <h3>
        {{ intent.name }} |
        <small>
          {{ intent.secondaryLabel }}
        </small>
      </h3>
      <SortableList
        :value="intent.sources"
        @input="updateOrder({ index, sources: $event })"
      >
        <SortableItem
          v-for="(source, index) of intent.sources"
          :index="index"
          :key="source.storeKey"
        >
          <div
            :class="$style.sortableItem"
            class="py-3 pr-6 pl-3 cursor-move"
          >
            <AppIcon
              class="mr-3"
              icon="bars"
            />
            {{ source.label }}
          </div>
        </SortableItem>
      </SortableList>
    </div>
  </div>
</template>

<script>
import { searchGetters, searchActions } from '@state/helpers'
import SortableList from './sortable-list'
import SortableItem from './sortable-item'

export default {
  components: { SortableList, SortableItem },
  data() {
    return {
      modifiedOrder: null
    }
  },
  computed: {
    ...searchGetters
  },
  beforeDestroy() {
    if (!this.modifiedOrder) return
    this.saveSourceOrder(this.modifiedOrder)
  },
  methods: {
    ...searchActions,
    updateOrder(payload) {
      this.updateSourcesOrder(payload)
      this.modifiedOrder = this.searchIntents.reduce((summary, intent) => {
        return {
          ...summary,
          [intent.name]: intent.sources.map(source => source.label)
        }
      }, {})
    }
  }
}
</script>

<style module lang="scss">
@import '~@branding';

.sortable-item {
  color: $app-prominent-text-color;
  background: var(--input-bg);
}
</style>
