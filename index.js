/**
 * Storeon module to update state at different browser tabs
 * @param {Object} config The config object
 * @param {String} [config.key = 'storeon-crosstab'] The default key
 * @param {Boolean} [config.skipInit = true] Skip init event
 * @return {Function} Storeon callback module
 */
var crossTab = function (config) {
  config = config || {}

  var key = config.key || 'storeon-crosstab'
  var skipInit = config.skipInit || true

  return function (store) {
    store.on('crosstab', function (_, state) {
      return state
    })

    store.on('@changed', function (state) {
      if (skipInit) {
        skipInit = false
        return
      }

      try {
        localStorage.setItem(key, JSON.stringify(state))
      } catch (e) {}
    })

    window.addEventListener('storage', function (event) {
      store.dispatch('crosstab', JSON.parse(event.newValue))
    })
  }
}

module.exports = crossTab
