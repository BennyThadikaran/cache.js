/**
 * Storage using localStorage api
 * @return {Object}
 */
function localStore() {
  "use strict";

  /**
   * Set key with expiry. Expiry defaults to 3 hours
   * Setting a key that already exists will update the value
   * @param {String} key
   * @param {*} value
   * @param {Number} expiryInSeconds defaults to 3 hours
   */
  function set(key, value, expiryInSeconds) {
    expiryInSeconds = Number.parseInt(expiryInSeconds);

    expiryInSeconds =
      Number.isNaN(expiryInSeconds) || expiryInSeconds < 1
        ? 3 * 60 * 60 // 3 hours
        : expiryInSeconds;

    localStorage.setItem(key, value);
    localStorage.setItem(key + "_expiry", Date.now() + expiryInSeconds * 1000);
  }

  /**
   * Get key.
   * @param {String} key
   * @return {null|*} Returns value or null if key not set or key expired
   */
  function get(key) {
    const expiry = localStorage.getItem(key + "_expiry");
    if (!expiry || expiry < Date.now()) {
      remove(key);
      return null;
    }
    return localStorage.getItem(key);
  }

  /**
   * Helper function for setting objects as values
   * Calls JSON.stringify on the value before storing
   * @param {String} key
   * @param {*} value
   * @param {Number} expiryInSeconds defaults to 3 hours
   */
  function oSet(key, value, expiryInSeconds) {
    set(key, JSON.stringify(value), expiryInSeconds);
  }

  /**
   * Helper function for getting objects as values
   * returns value parsed as JSON
   * @param {String} key
   * @return {null|*} Returns value or null if key not set or key expired
   */
  function oGet(key) {
    return JSON.parse(get(key));
  }

  /**
   * Remove key
   * @param {String} key
   */
  function remove(key) {
    localStorage.removeItem(key);
    localStorage.removeItem(key + "_expiry");
  }

  /**
   * Clear all keys
   */
  function clear() {
    localStorage.clear();
  }

  return Object.freeze({
    set,
    get,
    oSet,
    oGet,
    remove,
    clear,
    name: "localstore",
  });
}

/**
 * Storage using in-memory Objects
 * @return {Object}
 */
function memoryStore() {
  "use strict";
  const store = {};

  /**
   * Set key with expiry. Expiry defaults to 3 hours
   * Setting a key that already exists will update the value
   * @param {String} key
   * @param {*} value
   * @param {Number} expiryInSeconds defaults to 3 hours
   */
  function set(key, value, expiryInSeconds) {
    expiryInSeconds = Number.parseInt(expiryInSeconds);

    expiryInSeconds =
      Number.isNaN(expiryInSeconds) || expiryInSeconds < 1
        ? 3 * 60 * 60 // 3 hours
        : expiryInSeconds;

    store[key] = value;
    store[key + "_expiry"] = Date.now() + expiryInSeconds * 1000;
  }

  /**
   * Get key.
   * @param {String} key
   * @return {null|*} Returns value or null if key not set or key expired
   */
  function get(key) {
    const expiry = store[key + "_expiry"];
    if (!expiry || expiry < Date.now()) {
      remove(key);
      return null;
    }
    return store[key];
  }

  /**
   * Remove key
   * @param {String} key
   */
  function remove(key) {
    delete store[key];
    delete store[key + "_expiry"];
  }

  /**
   * Clear all keys
   */
  function clear() {
    for (const key of Object.keys(store)) delete store[key];
  }

  return Object.freeze({
    oSet: set,
    oGet: get,
    set,
    get,
    remove,
    clear,
    name: "memorystore",
  });
}

/**
 * Client Side Caching with localStorage using the Module Pattern
 * @return {Object} localStore or memoryStore
 */
const cache = function () {
  "use strict";

  /**
   * Test browser support for localStorage and cache result
   * @return {Boolean}
   */
  const test = function () {
    let storage;

    try {
      storage = window.localStorage;
      const x = "__storage_test__";
      storage.setItem(x, x);
      storage.removeItem(x);
      return true;
    } catch (e) {
      return (
        e instanceof DOMException &&
        (e.name === "QuotaExceededError" ||
          e.name === "NS_ERROR_DOM_QUOTA_REACHED") &&
        // acknowledge QuotaExceededError only if there's something already stored
        storage &&
        storage.length !== 0
      );
    }
  };

  return test() ? localStore() : memoryStore();
};

export default cache;
