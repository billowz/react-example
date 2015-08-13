(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.returnExports = factory();
  }
})(this, function() {
  // ES5 15.2.3.2
  // http://es5.github.com/#x15.2.3.2
  if (!Object.getPrototypeOf) {
    // https://github.com/es-shims/es5-shim/issues#issue/2
    // http://ejohn.org/blog/objectgetprototypeof/
    // recommended by fschaefer on github
    //
    // sure, and webreflection says ^_^
    // ... this will nerever possibly return null
    // ... Opera Mini breaks here with infinite loops
    Object.getPrototypeOf = function getPrototypeOf(object) {
      /* eslint-disable no-proto */
      var proto = object.__proto__;
      /* eslint-enable no-proto */
      if (proto || proto === null) {
        return proto;
      } else if (object.constructor) {
        return object.constructor.prototype;
      } else {
        return prototypeOfObject;
      }
    };
  }
  // ES5 15.2.3.4
  // http://es5.github.com/#x15.2.3.4
  if (!Object.getOwnPropertyNames) {
    Object.getOwnPropertyNames = function getOwnPropertyNames(object) {
      return Object.keys(object);
    };
  }

  // ES5 15.2.3.5
  // http://es5.github.com/#x15.2.3.5
  if (!Object.create) {

    // Contributed by Brandon Benvie, October, 2012
    var createEmpty;
    var supportsProto = !({
        __proto__: null
      } instanceof Object);
      // the following produces false positives
      // in Opera Mini => not a reliable check
      // Object.prototype.__proto__ === null

    // Check for document.domain and active x support
    // No need to use active x approach when document.domain is not set
    // see https://github.com/es-shims/es5-shim/issues/150
    // variation of https://github.com/kitcambridge/es5-shim/commit/4f738ac066346
    /* global ActiveXObject */
    var shouldUseActiveX = function shouldUseActiveX() {
      // return early if document.domain not set
      if (!document.domain) {
        return false;
      }

      try {
        return !!new ActiveXObject('htmlfile');
      } catch (exception) {
        return false;
      }
    };

    // This supports IE8 when document.domain is used
    // see https://github.com/es-shims/es5-shim/issues/150
    // variation of https://github.com/kitcambridge/es5-shim/commit/4f738ac066346
    var getEmptyViaActiveX = function getEmptyViaActiveX() {
      var empty;
      var xDoc;

      xDoc = new ActiveXObject('htmlfile');

      xDoc.write('<script><\/script>');
      xDoc.close();

      empty = xDoc.parentWindow.Object.prototype;
      xDoc = null;

      return empty;
    };

    // The original implementation using an iframe
    // before the activex approach was added
    // see https://github.com/es-shims/es5-shim/issues/150
    var getEmptyViaIFrame = function getEmptyViaIFrame() {
      var iframe = document.createElement('iframe');
      var parent = document.body || document.documentElement;
      var empty;

      iframe.style.display = 'none';
      parent.appendChild(iframe);
      /* eslint-disable no-script-url */
      iframe.src = 'javascript:';
      /* eslint-enable no-script-url */

      empty = iframe.contentWindow.Object.prototype;
      parent.removeChild(iframe);
      iframe = null;

      return empty;
    };

    /* global document */
    if (supportsProto || typeof document === 'undefined') {
      createEmpty = function() {
        return {
          __proto__: null
        };
      };
    } else {
      // In old IE __proto__ can't be used to manually set `null`, nor does
      // any other method exist to make an object that inherits from nothing,
      // aside from Object.prototype itself. Instead, create a new global
      // object and *steal* its Object.prototype and strip it bare. This is
      // used as the prototype to create nullary objects.
      createEmpty = function() {
        // Determine which approach to use
        // see https://github.com/es-shims/es5-shim/issues/150
        var empty = shouldUseActiveX() ? getEmptyViaActiveX() : getEmptyViaIFrame();

        delete empty.constructor;
        delete empty.hasOwnProperty;
        delete empty.propertyIsEnumerable;
        delete empty.isPrototypeOf;
        delete empty.toLocaleString;
        delete empty.toString;
        delete empty.valueOf;
        /* eslint-disable no-proto */
        empty.__proto__ = null;
        /* eslint-enable no-proto */

        var Empty = function Empty() {};
        Empty.prototype = empty;
        // short-circuit future calls
        createEmpty = function() {
          return new Empty();
        };
        return new Empty();
      };
    }

    Object.create = function create(prototype, properties) {

      var object;
      var Type = function Type() {}; // An empty constructor.

      if (prototype === null) {
        object = createEmpty();
      } else {
        if (typeof prototype !== 'object' && typeof prototype !== 'function') {
          // In the native implementation `parent` can be `null`
          // OR *any* `instanceof Object`  (Object|Function|Array|RegExp|etc)
          // Use `typeof` tho, b/c in old IE, DOM elements are not `instanceof Object`
          // like they are in modern browsers. Using `Object.create` on DOM elements
          // is...err...probably inappropriate, but the native version allows for it.
          throw new TypeError('Object prototype may only be an Object or null'); // same msg as Chrome
        }
        Type.prototype = prototype;
        object = new Type();
        // IE has no built-in implementation of `Object.getPrototypeOf`
        // neither `__proto__`, but this manually setting `__proto__` will
        // guarantee that `Object.getPrototypeOf` will work as expected with
        // objects created using `Object.create`
        /* eslint-disable no-proto */
        object.__proto__ = prototype;
      /* eslint-enable no-proto */
      }

      if (properties !== void 0) {
        Object.defineProperties(object, properties);
      }

      return object;
    };
  }
  // ES5 15.2.3.8
  // http://es5.github.com/#x15.2.3.8
  if (!Object.seal) {
    Object.seal = function seal(object) {
      if (Object(object) !== object) {
        throw new TypeError('Object.seal can only be called on Objects.');
      }
      // this is misleading and breaks feature-detection, but
      // allows "securable" code to "gracefully" degrade to working
      // but insecure code.
      return object;
    };
  }

  // ES5 15.2.3.9
  // http://es5.github.com/#x15.2.3.9
  if (!Object.freeze) {
    Object.freeze = function freeze(object) {
      if (Object(object) !== object) {
        throw new TypeError('Object.freeze can only be called on Objects.');
      }
      // this is misleading and breaks feature-detection, but
      // allows "securable" code to "gracefully" degrade to working
      // but insecure code.
      return object;
    };
  }

  // detect a Rhino bug and patch it
  try {
    Object.freeze(function() {});
  } catch (exception) {
    Object.freeze = (function(freezeObject) {
      return function freeze(object) {
        if (typeof object === 'function') {
          return object;
        } else {
          return freezeObject(object);
        }
      };
    }(Object.freeze));
  }

  // ES5 15.2.3.10
  // http://es5.github.com/#x15.2.3.10
  if (!Object.preventExtensions) {
    Object.preventExtensions = function preventExtensions(object) {
      if (Object(object) !== object) {
        throw new TypeError('Object.preventExtensions can only be called on Objects.');
      }
      // this is misleading and breaks feature-detection, but
      // allows "securable" code to "gracefully" degrade to working
      // but insecure code.
      return object;
    };
  }

  // ES5 15.2.3.11
  // http://es5.github.com/#x15.2.3.11
  if (!Object.isSealed) {
    Object.isSealed = function isSealed(object) {
      if (Object(object) !== object) {
        throw new TypeError('Object.isSealed can only be called on Objects.');
      }
      return false;
    };
  }

  // ES5 15.2.3.12
  // http://es5.github.com/#x15.2.3.12
  if (!Object.isFrozen) {
    Object.isFrozen = function isFrozen(object) {
      if (Object(object) !== object) {
        throw new TypeError('Object.isFrozen can only be called on Objects.');
      }
      return false;
    };
  }

  // ES5 15.2.3.13
  // http://es5.github.com/#x15.2.3.13
  if (!Object.isExtensible) {
    Object.isExtensible = function isExtensible(object) {
      // 1. If Type(O) is not Object throw a TypeError exception.
      if (Object(object) !== object) {
        throw new TypeError('Object.isExtensible can only be called on Objects.');
      }
      // 2. Return the Boolean value of the [[Extensible]] internal property of O.
      var name = '';
      while (owns(object, name)) {
        name += '?';
      }
      object[name] = true;
      var returnValue = owns(object, name);
      delete object[name];
      return returnValue;
    };
  }
});
