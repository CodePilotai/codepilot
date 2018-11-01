<template lang="html">
  <div class="flex flex-col">
    <AppConfirmationModal
      v-if="isConfirmingDeletion"
      :confirm-button="{label: 'Delete', type: 'danger'}"
      :cancel-button="{label: 'Cancel'}"
      title="Custom Sources"
      message="Are you sure you want to remove the source?"
      @confirm="remove"
      @cancel="isConfirmingDeletion = false"
    />
    <div>
      <div
        :class="$style.sourceMargin"
        class="my-0 mr-3 ml-0"
      >
        <AppInputTextLabel
          slot="label"
          class="min-w-full"
          minimized
        >
          Label
        </AppInputTextLabel>

        <AppInputText
          v-model="localSource.label"
          :force-label-minimized="true"
          type="text"
          @focus="$v.localSource.label.$touch"
          @input="$v.localSource.label.$touch"
          @blur="$v.localSource.label.$reset"
        />
        <div
          v-if="$v.$invalid"
          class="text-red text-xs italic my-2"
        >
          <span
            v-if="!$v.localSource.label.required && sourceError.label"
            class="mr-3"
          >
            Label can’t be empty
          </span>
          <span
            v-else-if="!$v.localSource.label.isLabel && $v.localSource.label.required || sourceError.label"
            class="mr-3"
          >
            Label needs to be unique
          </span>
        </div>
      </div>
      <div
        :class="$style.sourceMargin"
        class="my-0 mr-3 ml-0 flex-grow"
      >
        <AppInputTextLabel
          slot="label"
          minimized
        >
          Website Address
        </AppInputTextLabel>

        <AppInputText
          :class="$style.sourceUrl"
          :force-label-minimized="true"
          v-model="localSource.url"
          label=""
          type="text"
          @focus="$v.localSource.url.$touch"
          @input="$v.localSource.url.$touch"
          @blur="$v.localSource.url.$reset"
        />
        <div
          v-if="$v.$invalid"
        >
          <span
            v-if="!$v.localSource.url.required && sourceError.url"
            class="mr-3"
          >
            URL can’t be empty
          </span>
          <span
            v-else-if="!$v.localSource.url.isUrl && $v.localSource.url.required || sourceError.url"
            class="mr-3"
          >
            Invalid URL
          </span>
        </div>
      </div>
      <div class="flex justify-between">
        <div
          :class="$style.sourceMargin"
          class="my-0 mr-3 ml-0"
        >
          <AppInputTextLabel
            slot="label"
            minimized
          >
            Intent
          </AppInputTextLabel>
          <AppSelect
            :options="intents"
            :value="localSource.intent.key"
            @input="localSource.intent = $event"
          >
            <template slot="selected">
              {{ localSource.intent.name || localSource.intent }}
            </template>
            <template
              slot="option"
              slot-scope="{ option }"
            >
              {{ option.name }}
            </template>
          </AppSelect>
          <div
            v-if="$v.$invalid"
          >
            <span
              v-if="$v.localSource.intent.$error || sourceError.intent"
              class="mr-3"
            >
              Intent must be selected
            </span>
          </div>
        </div>
        <div
          v-tooltip.bottom="searchWithGoogleHelpText"
          class="mt-8 w-32 whitespace-no-wrap align-middle self-center flex justify-between"
        >
          <AppInputCheckbox
            v-model="localSource.isSearched"
            :disabled="hasQuery"
            class="py-1 px-0 my-0 mr-2 ml-0"
            label="Google"
          />
          <AppIcon
            class="mt-2 mr-3 cursor-pointer"
            icon="question-circle"
          />
        </div>
      </div>
      <div
        :class="$style.sourceMargin"
        class="my-3 mr-3 ml-0"
      >
        <AppInputTextLabel>
          Action
        </AppInputTextLabel>
        <AppButton
          v-if="shouldDisplaySaveButton"
          :disabled="isEmpty"
          class="w-full mt-2"
          type="success"
          @click="update"
        >
          Save
        </AppButton>
        <AppButton
          v-else
          class="w-full mt-2"
          type="danger"
          @click="isConfirmingDeletion = true"
        >
          Delete
        </AppButton>
      </div>
    </div>
    <div
      v-if="status"
      :class="[
        $style.notification,
        status !== 'Source updated' && $style.errorNotification
      ]"
      class="py-1 px-8 mt-1 rounded"
    >
      {{ status }}
    </div>
  </div>
</template>

<script>
import { required } from 'vuelidate/lib/validators'
import { customSearchSourcesGetters } from '@state/helpers'

export default {
  props: {
    index: {
      type: Number,
      required: true
    },
    source: {
      type: Object,
      required: true
    },
    intents: {
      type: Array,
      required: true
    },
    dataE2eSources: {
      type: Array,
      default: () => [],
      required: false
    }
  },
  data() {
    return {
      status: null,
      localSource: {
        url: '',
        label: '',
        intent: null,
        isSearched: false
      },
      isConfirmingDeletion: false,
      sourceError: false,
      searchWithGoogleHelpText:
        'Search the website using Google. Unchecked opens the website. Disabled when {{query}} is used'
    }
  },
  computed: {
    ...customSearchSourcesGetters,
    isEmpty() {
      return (
        this.localSource.url === this.source.url &&
        this.localSource.url === '' &&
        this.localSource.label === this.source.label &&
        this.localSource.label === '' &&
        this.localSource.intent.name === this.source.intent.name
      )
    },
    latestChangesSaved() {
      return (
        this.localSource.url === this.source.url &&
        this.localSource.label === this.source.label &&
        this.localSource.intent === this.source.intent &&
        this.localSource.isSearched === this.source.isSearched
      )
    },
    shouldDisplaySaveButton() {
      return this.isEmpty || !this.latestChangesSaved
    },
    shouldDisplayDeleteButton() {
      return !this.isEmpty && this.latestChangesSaved
    },
    hasQuery() {
      return this.localSource.url.indexOf('{{query}}') !== -1
    }
  },
  watch: {
    source: {
      handler(source) {
        this.localSource = { ...source }
      },
      immediate: true
    },
    'localSource.url'(url) {
      if (url.indexOf('{{query}}') !== -1) {
        this.localSource.isSearched = false
      }
    }
  },
  validations: {
    localSource: {
      url: {
        required,
        isUrl: newUrl => {
          const url =
            newUrl.indexOf('{{query}}') !== -1
              ? newUrl.replace('{{query}}', 'test')
              : newUrl

          return (
            !!url.length &&
            !!url.match(
              /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=,\w]+@)?[A-Za-z0-9.-]+(:[0-9]+)?|(?:www.|[-;:&=,\w]+@)[A-Za-z0-9.-]+)((?:\/[~%.\w-_]*)?\??(?:[-=&;%@.\w_]*)#?(?:[\w]*))?)/
            )
          )
        }
      },
      label: {
        required,
        isLabel(newLabel) {
          if (this.source.label === newLabel) return true

          return (
            !!newLabel.length &&
            this.userAddedCustomSources.reduce(
              (n, source) => n + (source.label === newLabel),
              0
            ) === 0
          )
        }
      },
      intent: {
        isSelected: newValue => newValue.name !== 'Select'
      }
    }
  },
  methods: {
    showAndHideNotification() {
      this.status = this.$v.$invalid
        ? 'Can’t save due to errors'
        : 'Source updated'

      setTimeout(() => {
        this.status = null
      }, 3000)
    },
    remove() {
      this.$emit('remove', this.source)
      this.isConfirmingDeletion = false
    },
    update(updatedProperty) {
      this.showAndHideNotification()
      this.sourceError = {
        intent: this.$v.localSource.intent.$invalid,
        url: this.$v.localSource.url.$invalid,
        label: this.$v.localSource.label.$invalid
      }
      if (this.$v.$invalid) return
      this.$emit('update', this.localSource)
    }
  }
}
</script>

<style lang="scss" module>
@import '~@branding';

$error-color: #ff4747;

.source-margin {
  &:last-child {
    margin-right: config('margin.0');
  }
}

.notification {
  color: $app-white-color;
  background: $app-light-green-color;
}

.error-notification {
  background: $error-color;
}
</style>
