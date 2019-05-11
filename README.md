<img src="https://storeon.github.io/storeon/logo.svg" align="right"
     alt="Storeon logo by Anton Lovchikov" width="160" height="142">

# storeon-cross-tab
     
Module for [Storeon] to synchronize actions for browser tabs with filtering of events that need to be synchronized. It size is 205 bytes (minified and gzipped) and uses [Size Limit] to control size.

[Storeon]: https://github.com/storeon/storeon
[Size Limit]: https://github.com/ai/size-limit


## Example
![Example](example.gif)


## Installation

```
npm install isolovev/cross-tab
# or 
yarn add isolovev/cross-tab
```


## Usage

If you want sync state between tabs of the browser you should import the `crossTab` from `isolovev/cross-tab` and add this module to `createStore`.

```js
import createStore from 'storeon'
import crossTab from 'cross-tab'

const increment = store => {
  store.on('@init', () => ({ count: 0 }))
  store.on('inc', ({ count }) => ({ count: count + 1 }))
}

const store = createStore([increment, crossTab()])

store.on('@changed', (store) => {
  document.querySelector('.counter').innerText = store.count
})
```


## Sponsor

<p>
  <a href="https://evrone.com/?utm_source=storeon-cross-tab">
    <img src="https://solovev.one/static/evrone-sponsored-300.png" 
      alt="Sponsored by Evrone" width="250">
  </a>
</p>

## API
### crossTab(config)

```js
const config = {
  key: 'storeon-crosstab',
  filter: (event, data) => event !== 'dec'
}
```

```js
typeof config.key === 'string'
```

Default value of `config.key` is `storeon-crosstab`. This key is using to sync data in local storage.

```js
typeof config.filter === 'function'
```

Callback function to filter actions to be synchronized. Should return `true` if need sync this action. Takes parameters of an event name and a data that is sent.


## LICENSE

MIT
