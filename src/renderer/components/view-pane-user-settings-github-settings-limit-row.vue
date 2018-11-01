<template>
  <tr>
    <td>{{ rateName }}</td>
    <td>{{ rateData.remaining }}</td>
    <td>{{ rateData.limit }}</td>
    <td>{{ resetTime }}</td>
  </tr>
</template>

<script>
import { githubAuthGetters, githubAuthActions } from '@state/helpers'

export default {
  props: {
    rateData: {
      type: Object,
      required: true
    },
    rateName: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      now: this.getNow(),
      nowInterval: null
    }
  },
  computed: {
    ...githubAuthGetters,
    resetTime() {
      return this.convertToTimeLeft(
        Math.max(0, this.rateData.reset * 1000 - this.now)
      )
    }
  },
  watch: {
    resetTime(newValue) {
      if (newValue === '0:00') this.getRemainingRateLimits()
    }
  },
  mounted() {
    this.nowInterval = window.setInterval(() => {
      this.now = this.getNow()
    }, 1000)
  },
  beforeDestroy() {
    window.clearInterval(this.nowInterval)
  },
  methods: {
    ...githubAuthActions,
    getNow() {
      return Date.now()
    },
    convertToTimeLeft(timeLeft) {
      const minutes = Math.floor(timeLeft / 60000)
      const seconds = ((timeLeft % 60000) / 1000).toFixed(0)

      return seconds === 60
        ? minutes + 1 + ':00'
        : minutes + ':' + (seconds < 10 ? '0' : '') + seconds
    }
  }
}
</script>
