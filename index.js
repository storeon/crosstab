/**
 * Storeon module to sync state at different tabs of the browser
 * @param {Object} config The config object
 * @param {String} [config.key = 'storeon-crosstab'] The default key
 * @param {Filter} [config.filter] Pass callback to filter events.
 */
let crossTab = function (config) {
  config = config || {}

  let key = config.key || 'storeon-crosstab'

  let ignoreNext = false
  let ignoreDate = 0
  let counter = 0

  return function (store) {
    store.on('@dispatch', (_, [eventName, data]) => {
      if (eventName[0] === '@') return

      if (ignoreNext) {
        ignoreNext = false
        return
      }

      if (config.filter && !config.filter(eventName, data)) return

      try {
        ignoreDate = Date.now() + '' + counter++
        localStorage[key] = JSON.stringify([eventName, data, ignoreDate])
      } catch (e) {}
    })

    window.addEventListener('storage', event => {
      if (event.key === key) {
        let [eventName, data, ignoreDateFromEvent] = JSON.parse(event.newValue)

        if (ignoreDate !== ignoreDateFromEvent) {
          ignoreNext = true
          store.dispatch(eventName, data)
        }
      }
    })
  }
}

/**
 * Filter for sync event
 * @callback Filter
 * @param {String} Event name
 * @param {*} Event data
 */

module.exports = { crossTab }
