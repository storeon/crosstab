/**
 * Storeon module to sync state at different tabs of the browser
 * @param {Object} config The config object
 * @param {String} [config.key = 'storeon-crosstab'] The default key
 */
var crossTab = function (config) {
  config = config || {}

  var key = config.key || 'storeon-crosstab'
  var ignoreNext = false
  var ignoreDate = 0

  return function (store) {
    store.on('@dispatch', function (_, event) {
      if (event[0][0] === '@') return

      if (ignoreNext) {
        ignoreNext = false
        return
      }

      try {
        ignoreDate = +new Date()
        localStorage[key] = JSON.stringify([event[0], event[1], ignoreDate])
      } catch (e) {}
    })

    window.addEventListener('storage', function (event) {
      if (event.key === key) {
        var tip = JSON.parse(event.newValue)

        if (ignoreDate !== tip[2]) {
          ignoreNext = true
          store.dispatch(tip[0], tip[1])
        }
      }
    })
  }
}

module.exports = crossTab
