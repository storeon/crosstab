var parse = JSON.parse

/**
 * Storeon module to sync state at different tabs of the browser
 * @param {Object} config The config object
 * @param {String} [config.key = 'storeon-crosstab'] The default key
 */
var crossTab = function (config) {
  config = config || {}

  var key = config.key || 'storeon-crosstab'
  var sync = false

  return function (store) {
    store.on('@dispatch', function (_, e) {
      if (e[0][0] === '@') {
        if (e[0] === '@sync') sync = true
        if (e[0] === '@changed') sync = false
        return
      }

      if (sync) return

      try {
        localStorage[key] = JSON.stringify({
          name: e[0],
          data: e[1],
          time: +new Date()
        })
      } catch (er) {}
    })

    window.addEventListener('storage', function (e) {
      if (e.key === key) {
        var tip = parse(e.newValue)
        store.dispatch('@sync')
        store.dispatch(tip.name, tip.data)
      }
    })
  }
}

module.exports = crossTab
