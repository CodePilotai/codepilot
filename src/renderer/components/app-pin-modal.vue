<template>
  <AppModal
    title="Pin in a Problem group"
    @close="updateAppPinModalShown(false)"
  >
    <p>Problem Groups store related search results, and track if the Problem is solved.</p>
    <div class="flex">
      <AppSelect
        v-model="selectedGroup"
        :options="pinGroupOptions"
        class="w-full"
      >
        <span slot="label">
          Group
        </span>
      </AppSelect>
    </div>
    <div
      v-if="selectedGroup.key === '__NEW_GROUP__'"
      class="flex mt-3"
    >
      <AppInputText
        ref="newGroupInput"
        v-model="newGroupName"
        placeholder="New group name"
        class="w-full"
        @keydown.enter="createNewGroup"
      />
      <AppButton
        class="ml-3"
        @click="createNewGroup"
      >
        Create
      </AppButton>
    </div>
    <div class="flex mt-3">
      <AppButton
        type="danger"
        class="w-full"
        @click="removePin"
      >
        Remove
      </AppButton>

      <AppButton
        v-if="currentSelectedPinResult.pin.groupName"
        :type="currentSelectedPinResult.pin.isSolution ? 'success' : ''"
        class="w-full ml-3"
        @click="toggleIsSolution"
      >
        <AppIcon
          v-if="currentSelectedPinResult.pin.isSolution"
          icon="check"
        />
        {{ currentSelectedPinResult.pin.isSolution ? 'Unmark as solution' : 'Mark as solution' }}
      </AppButton>
      <AppButton
        class="w-full ml-3"
        @click="updateAppPinModalShown(false)"
      >
        Done
      </AppButton>
    </div>

  </AppModal>
</template>
<script>
import { pinsGetters, pinsActions, interfaceActions } from '@state/helpers'

const uncategorizedGroupOption = {
  key: '',
  label: 'Pins'
}

export default {
  data() {
    return {
      selectedGroup: null,
      newGroupName: ''
    }
  },
  computed: {
    ...pinsGetters,
    resultIsPinnable() {
      return (
        this.currentSelectedPinResult.pin ||
        this.currentSelectedPinResult.type !== 'website'
      )
    },
    pinTooltipText() {
      return this.currentSelectedPinResult.pin
        ? 'Unpin this result'
        : 'Pin this result'
    },
    pinGroupOptions() {
      return [
        uncategorizedGroupOption,
        ...this.pinnedResultsGroups
          .filter(group => group.key !== '')
          .map(group => ({
            key: group.key,
            label: group.name
          })),
        {
          key: '__NEW_GROUP__',
          label: 'Create new group'
        }
      ]
    }
  },
  watch: {
    selectedGroup(newGroup) {
      if (newGroup.key === this.currentSelectedPinResult.pin.groupName) return

      if (newGroup.key === '__NEW_GROUP__') {
        this.$nextTick(() => {
          this.$refs.newGroupInput.$refs.input.focus()
        })
      } else {
        this.updateGroup(newGroup.key)
      }
    },
    'currentSelectedPinResult.pin': {
      handler(newPin) {
        if (!newPin) return

        this.selectedGroup = { key: newPin.groupName }
      },
      deep: true
    }
  },
  created() {
    this.selectedGroup = this.currentSelectedPinResult.pin
      ? { key: this.currentSelectedPinResult.pin.groupName }
      : uncategorizedGroupOption
  },
  methods: {
    ...pinsActions,
    ...interfaceActions,

    updateGroup(newGroupName) {
      this.updateResultPin({
        ...this.currentSelectedPinResult,
        pin: {
          groupName: newGroupName,
          isSolution: newGroupName
            ? this.currentSelectedPinResult.pin.isSolution
            : false
        }
      })
    },
    createNewGroup() {
      if (!this.newGroupName.trim()) return

      this.updateGroup(this.newGroupName.trim())
      this.newGroupName = ''
    },
    toggleIsSolution() {
      this.updateResultPin({
        ...this.currentSelectedPinResult,
        pin: { isSolution: !this.currentSelectedPinResult.pin.isSolution }
      })
    },
    removePin() {
      this.removeResultPin(this.currentSelectedPinResult)
      this.updateAppPinModalShown(false)
    }
  }
}
</script>

<style lang="scss" module>
@import '~@branding';
</style>
