/**
 * @file Defines some MD utility function that support the MD API.
 * @author Derek Gransaull <derek@dgtlife.com>
 * @copyright DGTLife, LLC 2015
 *
 * Created on 10/15/2015
 */
// JSHint directives
/*jshint -W117 */     // app- and package-scoped variables not detectable by JSHint
/*jshint -W106 */     // we are not using camelCase for every identifier

_.extend(Material.prototype, {

  /**
   * An alias for the lengthy document.getElementById().
   *
   * @param {string} id - the id of the target element
   * @returns {Object}
   */
  dgEBI: function (id) {
    "use strict";

    return document.getElementById(id);
  },

  /**
   * An alias for the lengthy document.querySelector().
   *
   * @param {string} selector - the selector for the target element
   * @returns {Object}
   */
  dqS: function (selector) {
    "use strict";

    return document.querySelector(selector);
  },

  /**
   * An alias for the lengthy document.querySelectorAll().
   *
   * @param {string} selector - the selector for the target elements
   * @returns {NodeList}
   */
  dqSA: function (selector) {
    "use strict";

    return document.querySelectorAll(selector);
  },

  /**
   * An alias for the lengthy element.querySelector().
   *
   * @param {Object} element - the element on which the query operates
   * @param {string} selector - the selector for the target element
   * @returns {Object}
   */
  eqS: function (element, selector) {
    "use strict";

    return element.querySelector(selector);
  },

  /**
   * An alias for the lengthy element.querySelectorAll().
   *
   * @param {Object} element - the element on which the query operates
   * @param {string} selector - the selector for the target element
   * @returns {NodeList}
   */
  eqSA: function (element, selector) {
    "use strict";

    return element.querySelectorAll(selector);
  },

  /**
   * Compose a selector for an element from the name of the element.
   *
   * @param {string} name - the name of the element
   * @returns {string} - the selector for the element
   */
  selectorFromName: function (name) {
    "use strict";

    return '[name=' + name + ']';
  },

  /**
   * Convert a NodeList to an Array.
   *
   * @param {NodeList} nodeList - the result of a document.querySelectorAll() call
   * @returns {Array} - a proper array of elements
   */
  nodeListToArray: function (nodeList) {
    "use strict";

    var elementArray = [];

    for (var i = 0; i < nodeList.length; i++) {
      elementArray.push(nodeList[i]);
    }
    return elementArray;
  }
});
