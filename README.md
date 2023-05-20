# Cache.js

A simple wrapper for Client Side Caching with [Window.localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)

- Tests for localStorage and returns either a localStore or memoryStore.
- MemoryStore data lasts until the page is refreshed.
- Fully tested code

## Usage

```javascript
import cache from "./src/cache.js" // path to cache.js

const store = cache();

// Add data into localStorage with 300 second expiry
// Defaults to 3 hours if unspecified
store.set("foo", "bar", 300);

// Get data from localStorage
store.get("foo");
// Outputs "bar"

// remove data from localStorage
store.remove("foo");

// clear all data on localStorage
store.clear();

// JSON stringify the value before storage.
// Useful for storing Objects or Arrays
store.oSet("foo", { foo: "bar" }, 300);
// outputs { foo: "bar" }

// Returns JSON parsed values
store.oGet("foo");
// Outputs "bar"
```

## Exposed functions

Cache.js is uses a Module pattern exposing the below methods

> Cache.set(key, value, expiryInSeconds)

> Cache.get(key)

> Cache.remove(key)

> Cache.clear()

> Cache.name
// localstore | memorystore

# To Run Test

- Clone the repo
- ```cd``` into project folder and run ```npm install```
- Once installed, run ```npm run test```
