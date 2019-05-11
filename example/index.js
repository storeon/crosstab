var createStore = require('storeon')
var persistState = require('@storeon/localstorage')

var crossTab = require('../')

// Initial state, reducers and business logic are packed in independent modules
function increment (store) {
  store.on('@init', function () {
    return { count: 0, trim: true }
  })

  store.on('inc', function (state) {
    return { count: state.count + 1 }
  })

  store.on('dec', function (state) {
    return { count: state.count - 1 }
  })

  store.on('ten', function (state) {
    return { count: state.count + 10 }
  })
}

// Filter callback
function filter (event) {
  return event !== 'ten'
}

// Create store
var store = createStore([
  increment,
  persistState(),
  crossTab({ filter: filter })
])

var counter = document.querySelector('.counter')
counter.innerText = store.get().count

store.on('@changed', function (state) {
  counter.innerText = state.count
})

document
  .querySelector('.inc')
  .addEventListener('click', function () {
    store.dispatch('inc', { type: 'inc-world' })
  })

document
  .querySelector('.dec')
  .addEventListener('click', function () {
    store.dispatch('dec', { type: 'dec-world' })
  })

document
  .querySelector('.ten')
  .addEventListener('click', function () {
    store.dispatch('ten')
  })
