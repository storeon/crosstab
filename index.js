var eSync = '@sync'

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
        sync = e[0] === eSync
        return
      }

      if (sync) return

      try {
        localStorage[key] = JSON.stringify([e[0], e[1], +new Date()])
      } catch (er) {}
    })

    window.addEventListener('storage', function (e) {
      if (e.key === key) {
        var tip = JSON.parse(e.newValue)
        store.dispatch(eSync)
        store.dispatch(tip[0], tip[1])
      }
    })
  }
}

module.exports = crossTab
