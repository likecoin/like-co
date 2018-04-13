/* eslint-disable */
// Fixes https://github.com/nuxt/nuxt.js/issues/2260
// polyfill of Object.assign
if (typeof Object.assign != 'function') {
  // Must be writable: true, enumerable: false, configurable: true
  Object.defineProperty(Object, "assign", {
    value: function assign(target, varArgs) { // .length of function is 2
      'use strict';
      if (target == null) { // TypeError if undefined or null
        throw new TypeError('Cannot convert undefined or null to object');
      }

      var to = Object(target);

      for (var index = 1; index < arguments.length; index++) {
        var nextSource = arguments[index];

        if (nextSource != null) { // Skip over if undefined or null
          for (var nextKey in nextSource) {
            // Avoid bugs when hasOwnProperty is shadowed
            if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
              to[nextKey] = nextSource[nextKey];
            }
          }
        }
      }
      return to;
    },
    writable: true,
    configurable: true
  });
}

// Polyfill of Object.values

Object.values = Object.values ? Object.values : function(obj) {
	var allowedTypes = ["[object String]", "[object Object]", "[object Array]", "[object Function]"];
	var objType = Object.prototype.toString.call(obj);

	if(obj === null || typeof obj === "undefined") {
		throw new TypeError("Cannot convert undefined or null to object");
	} else if(!~allowedTypes.indexOf(objType)) {
		return [];
	} else {
		// if ES6 is supported
		if (Object.keys) {
			return Object.keys(obj).map(function (key) {
				return obj[key];
			});
		}

		var result = [];
		for (var prop in obj) {
			if (obj.hasOwnProperty(prop)) {
				result.push(obj[prop]);
			}
		}

		return result;
	}
};
