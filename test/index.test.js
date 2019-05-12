var createStore = require('storeon')

var crossTab = require('../')

var storageCallback = function () {}

jest.spyOn(window, 'addEventListener')
  .mockImplementation(function (event, callback) {
    if (event === 'storage') {
      storageCallback = callback
    }
  })

jest.spyOn(Date, 'now')
  .mockImplementation(function () {
    return 1
  })

beforeAll(function () {
  localStorage.clear()
})

afterEach(function () {
  localStorage.clear()
  storageCallback = function () {}
})

var defaultStorageKey = 'storeon-crosstab'

function increment (store) {
  store.on('@init', function () {
    return { count: 0, trim: true }
  })

  store.on('inc', function (state) {
    return { count: state.count + 1 }
  })
}

it('saves dispatch actions', function () {
  var eventName = 'int'
  var data = { hello: 'world' }
  var store = createStore([increment, crossTab()])

  store.dispatch(eventName, data)

  var persistedData = JSON.parse(localStorage[defaultStorageKey])

  expect(persistedData[0]).toBe(eventName)
  expect(persistedData[1]).toEqual(data)
})

it('other key for storage', function () {
  var eventName = 'int'
  var data = { otherKey: 'yeap' }
  var key = 'other'

  var store = createStore([increment, crossTab({ key: key })])

  store.dispatch(eventName, data)

  var persistedData = JSON.parse(localStorage[key])

  expect(persistedData[0]).toBe(eventName)
  expect(persistedData[1]).toEqual(data)
  expect(localStorage[defaultStorageKey]).toBeUndefined()
})

it('filtering dispatch actions', function () {
  var eventName = 'int'
  var data = { testFilter: 'done?' }
  var filter = function (event) {
    return event !== eventName
  }

  var store = createStore([increment, crossTab({ filter: filter })])

  store.dispatch(eventName, data)

  expect(localStorage[defaultStorageKey]).toBeUndefined()
})

it('filtering more dispatch actions', function () {
  var eventName = 'int'

  var dataFirst = { first: 'test' }
  var dataSecond = { test: 'two' }
  var dataThird = { filterField: 'done?' }

  var filter = function (event, data) {
    return !data.hasOwnProperty('filterField')
  }

  var store = createStore([increment, crossTab({ filter: filter })])

  store.dispatch(eventName, dataFirst)
  store.dispatch(eventName, dataSecond)
  store.dispatch(eventName, dataThird)

  var persistedData = JSON.parse(localStorage[defaultStorageKey])

  expect(persistedData[0]).toBe(eventName)
  expect(persistedData[1]).toEqual(dataSecond)
})

it('catch the event', function () {
  var eventName = 'int'

  var store = createStore([increment, crossTab()])

  storageCallback({
    key: eventName,
    newValue: null
  })

  var newState = store.get()
  newState.count = newState.count + 1

  expect(store.get()).toEqual(newState)
})

it('catch the double event', function () {
  var eventName = 'int'
  var data = { hello: 'double' }

  var store = createStore([increment, crossTab()])
  store.dispatch('int', data)

  storageCallback({
    key: defaultStorageKey,
    newValue: JSON.stringify([
      eventName,
      data,
      Date.now() + 1
    ])
  })

  var newState = store.get()
  newState.count = newState.count + 1

  expect(store.get()).toEqual(newState)
})

it('catch the event and sync event', function () {
  var eventName = 'int'
  var data = { hello: 'double' }

  var store = createStore([increment, crossTab()])
  store.dispatch('int', data)

  storageCallback({
    key: defaultStorageKey,
    newValue: JSON.stringify([
      eventName,
      data,
      Date.now() + '' + 0
    ])
  })

  var newState = store.get()
  newState.count = newState.count + 2

  expect(store.get()).toEqual(newState)
})
