<template>
  <div>
    <h1>Test Component B</h1>
  </div>
</template>
<script>
export default {
  name: 'TestComponentB',
  data() {
    return {
      count: 0
    }
  },
  computed: {
    addFive() {
      return this.count + 5
    }
  }
}
</script>
