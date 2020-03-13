let { createStoreon } = require('storeon')

let { crossTab } = require('../')

let storageCallback = function () {}

jest.spyOn(window, 'addEventListener')
  .mockImplementation((event, callback) => {
    if (event === 'storage') {
      storageCallback = callback
    }
  })

jest.spyOn(Date, 'now')
  .mockImplementation(() => {
    return 1
  })

beforeAll(() => {
  localStorage.clear()
})

afterEach(() => {
  localStorage.clear()
  storageCallback = function () {}
})

let defaultStorageKey = 'storeon-crosstab'

function increment (store) {
  store.on('@init', () => {
    return { count: 0, trim: true }
  })

  store.on('inc', state => {
    return { count: state.count + 1 }
  })
}

it('saves dispatch actions', () => {
  let eventName = 'inc'
  let data = { hello: 'world' }
  let store = createStoreon([increment, crossTab()])

  store.dispatch(eventName, data)

  let persistedData = JSON.parse(localStorage[defaultStorageKey])

  expect(persistedData[0]).toBe(eventName)
  expect(persistedData[1]).toEqual(data)
})

it('other key for storage', () => {
  let eventName = 'inc'
  let data = { otherKey: 'yeap' }
  let key = 'other'

  let store = createStoreon([increment, crossTab({ key })])

  store.dispatch(eventName, data)

  let persistedData = JSON.parse(localStorage[key])

  expect(persistedData[0]).toBe(eventName)
  expect(persistedData[1]).toEqual(data)
  expect(localStorage[defaultStorageKey]).toBeUndefined()
})

it('filtering dispatch actions', () => {
  let eventName = 'inc'
  let data = { testFilter: 'done?' }
  let filter = function (event) {
    return event !== eventName
  }

  let store = createStoreon([increment, crossTab({ filter })])

  store.dispatch(eventName, data)

  expect(localStorage[defaultStorageKey]).toBeUndefined()
})

it('filtering more dispatch actions', () => {
  let eventName = 'inc'

  let dataFirst = { first: 'test' }
  let dataSecond = { test: 'two' }
  let dataThird = { filterField: 'done?' }

  let filter = function (event, data) {
    return !Object.hasOwnProperty.call(data, 'filterField')
  }

  let store = createStoreon([increment, crossTab({ filter })])

  store.dispatch(eventName, dataFirst)
  store.dispatch(eventName, dataSecond)
  store.dispatch(eventName, dataThird)

  let persistedData = JSON.parse(localStorage[defaultStorageKey])

  expect(persistedData[0]).toBe(eventName)
  expect(persistedData[1]).toEqual(dataSecond)
})

it('catch the event', () => {
  let eventName = 'inc'

  let store = createStoreon([increment, crossTab()])

  storageCallback({
    key: eventName,
    newValue: null
  })

  let newState = store.get()
  newState.count = newState.count + 1

  expect(store.get()).toEqual(newState)
})

it('catch the double event', () => {
  let eventName = 'inc'
  let data = { hello: 'double' }

  let store = createStoreon([increment, crossTab()])
  store.dispatch('inc', data)

  storageCallback({
    key: defaultStorageKey,
    newValue: JSON.stringify([
      eventName,
      data,
      Date.now() + 1
    ])
  })

  let newState = store.get()

  expect(newState.count).toEqual(2)
})

it('catch the event and sync event', () => {
  let eventName = 'inc'
  let data = { hello: 'double' }

  let store = createStoreon([increment, crossTab()])
  store.dispatch('inc', data)

  storageCallback({
    key: defaultStorageKey,
    newValue: JSON.stringify([
      eventName,
      data,
      Date.now() + '' + 0
    ])
  })

  let newState = store.get()

  expect(newState.count).toEqual(1)
})
