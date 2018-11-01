let store = {}

export default {
  get: function(key) {
    return store[key] || null
  },
  set: function(key, value) {
    store[key] = value.toString()
  },
  deleteAll: function() {
    store = {}
  }
}
