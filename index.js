var parse = JSON.parse

/**
 * Storeon module to sync state at different tabs of the browser
 * @param {Object} config The config object
 * @param {String} [config.key = 'storeon-crosstab'] The default key
 * @param {Boolean} [config.resetInit = false] Reset state at reloading tab
 */
var crossTab = function (config) {
  config = config || {}

  var key = config.key || 'storeon-crosstab'
  var resetInit = config.resetInit || false

  return function (store) {
    store.on('crosstab', function (_, state) {
      return state
    })

    if (!resetInit) {
      try {
        store.on('@init', function () {
          return parse(localStorage.getItem(key))
        })
      } catch (e) {}
    }

    store.on('@changed', function (state) {
      try {
        localStorage[key] = JSON.stringify(state)
      } catch (e) {}
    })

    window.addEventListener('storage', function (e) {
      if (e.key === key) {
        store.dispatch('crosstab', parse(e.newValue))
      }
    })
  }
}

module.exports = crossTab
