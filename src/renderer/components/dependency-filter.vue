<template>
  <div class="flex flex-col">
    <div
      data-v-step="filter-dependencies"
      class=" bg-grey-light py-3 px-4 mb-4"
    >
      <h2 class="mb-0">
        Filter results by dependencies (package.json)
      </h2>
      <span>Applies to all results with the
        <span class="ml-1 mr-1 fa fa-filter"/>
        filter icon
      </span>
    </div>
    <div
      v-if="githubResultsDependencies.length"
      class="flex flex-col px-4"
    >
      <div class="flex mb-3 -mx-1 flex-top">
        <AppInputText
          v-tooltip.right="'Press Enter to Select / Deselect all'"
          ref="dependencyFilterQueryInput"
          v-model="filterQueryText"
          placeholder="Type to search dependencies"
          class="w-1/2 ml-1 mr-2"
          @keyup.enter="selectDeselectAll"
        />
        <AppToggle
          v-tooltip.right="'Select / Deselect visible results'"
          :toggle-buttons="selectDeselectLabels"
          :value="isAllSelectedButton"
          data-e2e="DependencyFilter-selectToggle"
          @toggle="selectDeselectAll"
        />
      </div>
      <div
        v-show="!dependenciesFilteredByQueryText.length"
        class=" p-0 mb-2">
        <span class="text-red-dark">Filter does not match any dependencies</span>
      </div>

      <AppInputCheckbox
        :checked="allowResultsWithoutDeps"
        class="px-4 -mb-0"
        label="Show results without dependencies"
        @change="updateResultsWithoutDeps"
      />
      <AppInputCheckbox
        :checked="requireAllDependenciesToBeFound"
        class="px-4 -mb-0"
        label="Show results that contain all selected dependencies"
        @change="updateDependencyFilterRequirements"
      />

      <template v-if="checkedDependencies.length">
        <h2 class=" bg-grey-light p-2 mb-1">Selected</h2>
        <div class="flex flex-wrap -mx-1 mb-2">
          <div
            v-for="(dependency, index) in checkedDependencies"
            :key="index"
            class="w-1/2 lg:w-1/3 xl:w-1/4"
          >
            <AppInputCheckbox
              v-tooltip.bottom="dependency.name"
              :checked="dependency.checked"
              :label="dependency.name"
              :data-e2e="'DependencyFilter-'+ dependency.name"
              class="truncate px-2 m-0"
              @change="toggleDependency(dependency)"
            />
          </div>
        </div>
      </template>
      <template v-if="uncheckedDependencies.length">
        <h2 class=" bg-grey-light p-2 mb-1">Unselected</h2>
        <div class="flex flex-wrap -mx-1 mb-2">
          <div
            v-for="(dependency, index) in uncheckedDependencies"
            :key="index"
            class="w-1/2 lg:w-1/3 xl:w-1/4"
          >
            <AppInputCheckbox
              v-tooltip.bottom="dependency.name"
              :checked="dependency.checked"
              :label="dependency.name"
              :data-e2e="'DependencyFilter-'+ dependency.name"
              class="truncate px-2 m-0"
              @change="toggleDependency(dependency)"
            />
          </div>
        </div>
      </template>
    </div>
    <div
      v-else
      class="-mx-1"
    >
      <p class="ml-6">No existing dependencies found</p>
    </div>
  </div>
</template>

<script>
import { searchGetters, searchActions } from '@state/helpers'

export default {
  data() {
    return {
      filterQueryText: '',
      selectDeselectLabels: [
        { label: 'Deselect Dependencies' },
        { label: 'Select Dependencies' }
      ]
    }
  },
  computed: {
    ...searchGetters,
    dependenciesFilteredByQueryText() {
      return this.githubResultsDependencies.filter(dependency =>
        dependency.name.includes(this.filterQueryText)
      )
    },
    checkedDependencies() {
      return this.dependenciesFilteredByQueryText.filter(dep => dep.checked)
    },
    uncheckedDependencies() {
      return this.dependenciesFilteredByQueryText.filter(dep => !dep.checked)
    },
    isAllSelected() {
      return !this.dependenciesFilteredByQueryText.some(
        dependency => !dependency.checked
      )
    },
    isAllSelectedButton() {
      return this.isAllSelected
        ? this.selectDeselectLabels[0]
        : this.selectDeselectLabels[1]
    }
  },
  mounted() {
    this.toggleAllDependencies(false)
    this.updateResultsWithoutDeps(true)
  },
  methods: {
    ...searchActions,
    selectDeselectAll() {
      this.setGithubCodeDependencyChecked({
        names: this.dependenciesFilteredByQueryText.map(dep => dep.name),
        checked: !this.isAllSelected
      })
      this.filterQueryText = ''
      this.$refs.dependencyFilterQueryInput.$refs.input.focus()
    },
    toggleAllDependencies(dependenciesShouldBeChecked) {
      this.setGithubCodeDependencyChecked({
        names: this.dependenciesFilteredByQueryText.map(dep => dep.name),
        checked: dependenciesShouldBeChecked
      })
    },
    toggleDependency(dependency) {
      this.setGithubCodeDependencyChecked({
        names: [dependency.name],
        checked: !dependency.checked
      })
    }
  }
}
</script>
