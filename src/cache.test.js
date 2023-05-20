import cache from "./cache.js";

const prop = Object.getOwnPropertyDescriptor(window, "localStorage");

describe("cache with memoryStore", () => {
  Object.defineProperty(window, "localStorage", { value: null });

  const store = cache();

  test("Is memoryStore", () => {
    expect(store.name).toBe("memorystore");
  });

  describe("cache.get", () => {
    test("Returns null if key not set", () => {
      expect(store.get("foo")).toBe(null);
    });

    test("Returns null if expired", () => {
      store.set("foo", "bar", 1);

      expect(store.get("foo")).toBe("bar");

      setTimeout(() => {
        expect(store.get("foo")).toBe(null);
      }, 1500);
    });
  });

  describe("cache.oGet", () => {
    test("Returns an Object", () => {
      store.oSet("foo", { foo: "bar", bar: "baz" });
      expect(store.oGet("foo")).toStrictEqual({ foo: "bar", bar: "baz" });
    });

    test("Returns null if expired", () => {
      store.oSet("foo", { foo: "bar", bar: "baz" }, 1);
      expect(store.oGet("foo")).toStrictEqual({ foo: "bar", bar: "baz" });

      setTimeout(() => {
        expect(store.oGet("foo")).toBe(null);
      }, 1500);
    });
  });

  describe("cache.remove", () => {
    test("Item returns null after cache.remove", () => {
      store.set("foo", "bar");
      store.remove("foo");
      expect(store.get("foo")).toBe(null);
    });
  });

  describe("cache.clear", () => {
    test("Clears the entire store", () => {
      store.set("bar", "baz");
      store.oSet("foo", { foo: "bar", bar: "baz" });

      store.clear();
      expect(store.get("bar")).toBe(null);
      expect(store.oGet("foo")).toBe(null);
    });
  });
  Object.defineProperty(window, "localStorage", prop);
});

describe("cache with localStore", () => {
  Object.defineProperty(window, "localStorage", prop);
  const store = cache();

  test("Is localStore", () => {
    expect(store.name).toBe("localstore");
  });

  describe("cache.set", () => {
    test("LocalStorage.setItem is called", () => {
      jest.spyOn(Storage.prototype, "setItem");
      store.set("foo", "bar");
      store.remove("foo");
      expect(localStorage.setItem).toHaveBeenCalledTimes(2);
    });
  });

  describe("cache.get", () => {
    test("Returns null if key not set", () => {
      expect(store.get("foo")).toBe(null);
    });

    test("Returns null if expired", () => {
      store.set("foo", "bar", 1);

      expect(store.get("foo")).toBe("bar");

      setTimeout(() => {
        expect(store.get("foo")).toBe(null);
      }, 1500);
    });
  });

  describe("cache.oGet", () => {
    test("Returns an Object", () => {
      store.oSet("foo", { foo: "bar", bar: "baz" });
      expect(store.oGet("foo")).toStrictEqual({ foo: "bar", bar: "baz" });
    });

    test("Returns null if expired", () => {
      store.oSet("foo", { foo: "bar", bar: "baz" }, 1);
      expect(store.oGet("foo")).toStrictEqual({ foo: "bar", bar: "baz" });

      setTimeout(() => {
        expect(store.oGet("foo")).toBe(null);
      }, 1500);
    });
  });

  describe("cache.remove", () => {
    test("Item returns null after cache.remove", () => {
      store.set("foo", "bar");
      store.remove("foo");
      expect(store.get("foo")).toBe(null);
    });
  });

  describe("cache.clear", () => {
    test("Clears the entire store", () => {
      store.set("bar", "baz");
      store.oSet("foo", { foo: "bar", bar: "baz" });

      store.clear();
      expect(store.get("bar")).toBe(null);
      expect(store.oGet("foo")).toBe(null);
    });
  });
});
