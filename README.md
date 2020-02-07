# Storeon Crosstab

<img src="https://storeon.github.io/storeon/logo.svg" align="right"
     alt="Storeon logo by Anton Lovchikov" width="140">

Module for [Storeon] to synchronize actions for browser tabs with filtering of events that need to be synchronized.

It size is 223 bytes (minified and gzipped) and uses [Size Limit] to control size.

[Storeon]: https://github.com/storeon/storeon
[Size Limit]: https://github.com/ai/size-limit


## Example
![Example](example.gif)


## Installation

```
npm install @storeon/crosstab
# or
yarn add @storeon/crosstab
```


## Usage

If you want sync state between tabs of the browser you should import the `crossTab` from `@storeon/crosstab` and add this module to `createStore`.

```js
import createStore from 'storeon'
import persistState from '@storeon/localstorage'
import crossTab from '@storeon/crosstab'

const increment = store => {
  store.on('@init', () => ({ count: 0, openMenu: false }))
  store.on('inc', ({ count }) => ({ count: count + 1 }))
  store.on('toggleMenu', ({ openMenu }) => ({ openMenu: !openMenu }))
}

const store = createStore([
  increment,
  persistState(),
  crossTab({ filter: (event, data) => event !== 'toggleMenu' })
])

store.on('@changed', (store) => {
  document.querySelector('.counter').innerText = store.count
})
```


## API

```js
import crossTab from '@storeon/crosstab'

const moduleCrossTab = crossTab({
  filter: (event, data) => event !== 'dec',
  key: 'storeon-crosstab'
})
```

Function `crossTab` could have options:

* __key__: key for sync data in local storage.
* __filter__: callback function to filter actions to be synchronized. Should return `true` if need sync this action. Takes parameters of an event name and a data that is sent.


## Sponsor

<p>
  <a href="https://evrone.com/?utm_source=storeon-crosstab">
    <img src="https://solovev.one/static/evrone-sponsored-300.png"
      alt="Sponsored by Evrone" width="210">
  </a>
</p>


## LICENSE

MIT
