<template>
  <AppModal
    :title="title"
    @close="cancel"
  >
    <p>{{ message }}</p>
    <div class="mt-4 flex">
      <AppButton
        :type="cancelButton.type"
        class="w-1/2"
        @click="cancel"
      >
        {{ cancelButton.label }}
      </AppButton>
      <AppButton
        :disabled="loading"
        :type="confirmButton.type"
        class="w-1/2 ml-3"
        data-e2e="AppConfirmationModal-confirmCancel"
        @click="confirm"
      >
        {{ confirmButton.label }}
      </AppButton>
    </div>
  </AppModal>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    cancelButton: {
      type: Object,
      default() {
        return {
          label: 'Back',
          type: ''
        }
      }
    },
    confirmButton: {
      type: Object,
      default() {
        return {
          label: 'Confirm',
          type: 'success'
        }
      }
    }
  },
  data() {
    return {
      loading: false
    }
  },
  methods: {
    confirm() {
      this.loading = true
      this.$emit('confirm')
    },
    cancel() {
      this.$emit('cancel')
    }
  }
}
</script>
