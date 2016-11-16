/**
 * @file Defines some MD utility function that support the MD API.
 * @author Derek Gransaull <derek@dgtlife.com>
 * @copyright DGTLife, LLC 2015
 *
 * Created on 6/29/2016
 */

_.extend(Material.prototype, {
  /**
   * Get an element object from an 'elementSpec' value.
   * @param {(string|Object)} elementSpec - a selector for the element or the
   *                                        element itself
   */
  _getElement(elementSpec) {
    "use strict";
    if (_.isString(elementSpec)) {
      return this.dqS(elementSpec);
    } else if (_.isObject(elementSpec)) {
      return elementSpec;
    } else {
      throw new Meteor.Error('An elementSpec must be a selector (string) or ' +
        'an element (Object).'
      );
    }
  },

  /**
   * Hide a DOM element.
   * @param {object} element - the DOM element to be hidden
   * @private
   */
  _hideElement(element) {
    "use strict";
    if (!element.classList.contains('md-hide')) {
      element.classList.add('md-hide');
    }
  },

  /**
   * Show a DOM element (that was previously hidden).
   * @param {object} element - the DOM element to be shown
   * @private
   */
  _showElement(element) {
    "use strict";
    if (element.classList.contains('md-hide')) {
      element.classList.remove('md-hide');
    }
  },

  /**
   * Wait for an element to be rendered before calling a callback.
   * @param {object} parent - a parent of the element
   * @param {string} selector - a selector for the element to wait for
   * @param {function} callback - the callback to call upon element detection
   * @param {number} delay - the delay after element detection before the
   *                         callback is called
   */
  waitForElement(parent, selector, callback, delay) {
    "use strict";

    // A callback from the mutation observer to detect the element.
    function _detectElement(mutations) {
      _.each(mutations, function (mutation) {
        if (mutation.addedNodes.length > 0) {
          _.each(mutation.addedNodes, function (addedNode) {
            if (addedNode === MD.dqS(selector)) {
              /*
               * The element has been rendered. Call the callback with any
               * applicable delay.
               */
              Meteor.setTimeout(function () {
                callback(addedNode);
              }, delay);

              // Since we found it; stop the observer.
              _onRenderChildren.disconnect();
            } else {
              return false;
            }
          });
        }
      });

      // We looked through everything and didn't find it; stop the observer.
      _onRenderChildren.disconnect();
    }

    // An observer that looks for newly rendered child nodes of a parent.
    const _onRenderChildren = new MutationObserver(_detectElement);
    _onRenderChildren.observe(parent, {
      childList: true,
      subtree: true
    });
  },

  /**
   * Handle a click on a selectable element, e.g. card. This function is used to
   * manage an array of selected elements of a given type in order to apply
   * a common operation.
   * @param {Object} element - the element that was clicked
   * @param {string} groupName - the type of thing that each element represents,
   *                             used in the plural, e.g. 'cars'
   */
  handleClickOnSelectableElement(element, groupName) {
    "use strict";
    if (! this.selected[groupName]) {
      // Initialize an appropriate key if it does not already exist.
      this.selected[groupName] = [];
    }

    const selectedElements = this.selected[groupName];

    // Gets the index of an element.
    function _getIndex(_element) {
      return _element.getAttribute('data-index');
    }

    // Toggle the selection and inclusion in the selected elements array.
    if (element.hasAttribute('data-selected')) {
      element.removeAttribute('data-selected');

      // Remove it from the selected elements array.
      const index = _.findIndex(selectedElements, function (__element) {
        return (_getIndex(__element) === _getIndex(element));
      });

      if (index !== -1) {
        selectedElements.splice(index, 1);
      }

      // If this was the last element, remove the key.
      if (selectedElements.length === 0) {
        delete this.clearSelectedElements(groupName);
      }
    } else {
      element.setAttribute('data-selected', 'true');
      selectedElements.push(element);
    }
  },

  /**
   * Get the array of selected elements in a group.
   * @param groupName
   * @returns {Array} - the array of selected elements
   */
  getSelectedElements(groupName) {
    "use strict";
    return this.selected[groupName];
  },

  /**
   * Clear the selected elements and delete the group key.
   * @param groupName
   */
  clearSelectedElements(groupName) {
    "use strict";
    const selectedElements = this.selected[groupName];
    if (selectedElements) {
      _.each(selectedElements, function (element) {
        element.removeAttribute('data-selected');
      });
    }

    delete this.selected[groupName];
  },

  /**
   * Checks whether a scrollable element is visible, i.e. not concealed by
   * 'display: none', and actually has overflow, then sets an overflow attribute
   * and an initial scroll position of 'fully down'. Elements that are not
   * visible must be initialized when they are.
   * @param {Object} scrollableElement - the scrollable element
   */
  initializeScroller(scrollableElement) {
    "use strict";
    if ((scrollableElement.scrollHeight > 0) &&
      (scrollableElement.scrollHeight > scrollableElement.clientHeight)) {
      // Set the overflow attribute, and scroll down fully.
      scrollableElement.setAttribute('data-overflow', 'true');
      scrollableElement.scrollTop = 0;
      scrollableElement.setAttribute('data-scroll-status', 'scrolled-down');
    }
  },

  /**
   * Run a scrollable element, i.e initialize overflow status and set the
   * initial scroll position, then turn ON the scroll monitor for the element.
   * @param {Object} scrollableElement - the scrollable element
   */
  runScroller(scrollableElement) {
    "use strict";

    // Initialize the scroller.
    this.initializeScroller(scrollableElement);

    // Turn ON the scroll monitor.
    this.scrollMonitor(scrollableElement, 'on');
  }
});
