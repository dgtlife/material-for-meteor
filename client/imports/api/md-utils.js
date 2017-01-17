/**
 * @file Defines MD utility functions for the client.
 * @author Derek Gransaull <derek@dgtlife.com>
 * @copyright DGTLife, LLC 2015
 *
 * Created on 11/22/16
 */
import { _ } from 'meteor/underscore';
import { Meteor } from 'meteor/meteor';
import {
  hideBottomOverflowIndicator,
  hideTopOverflowIndicator,
  showBottomOverflowIndicator,
  showTopOverflowIndicator
} from './md-scrollable-api.js';

// An object to hold arrays of selected element.
const selected = {};

/**
 * An alias for the lengthy document.getElementById().
 * @param {string} id - the id of the target element
 * @returns {Element}
 */
export const dgEBI = id => document.getElementById(id);

/**
 * An alias for the lengthy document.querySelector().
 * @param {string} selector - the selector for the target element
 * @returns {Element}
 */
export const dqS = selector => document.querySelector(selector);

/**
 * An alias for the lengthy document.querySelectorAll() converted to an array.
 * @param {string} selector - the selector for the target elements
 * @returns {array}
 */
export const dqSA = selector => Array.from(document.querySelectorAll(selector));

/**
 * An alias for the lengthy element.querySelector().
 * @param {Element} element - the element on which the query operates
 * @param {string} selector - the selector for the target element
 * @returns {Element}
 */
export const eqS = (element, selector) => element.querySelector(selector);

/**
 * An alias for the lengthy element.querySelectorAll() converted to an array.
 * @param {Element} element - the element on which the query operates
 * @param {string} selector - the selector for the target element
 * @returns {array}
 */
export const eqSA = (element, selector) => Array.from(
  element.querySelectorAll(selector)
);

/**
 * Get an element object from an 'elementSpec' value.
 * @param {(string|Element)} elementSpec - a selector for the element or the
 *                                         element itself
 */
export const getElement = (elementSpec) => {
  if (_.isString(elementSpec)) {
    return dqS(elementSpec);
  } else if (_.isObject(elementSpec)) {
    return elementSpec;
  }

  throw new Meteor.Error(
    'An elementSpec must be a selector (string) or an element (Element).'
  );
};

/**
 * Hide a DOM element.
 * @param {Element} element - the DOM element to be hidden
 * @private
 */
export const hideElement = element => element.classList.add('md-hide');

/**
 * Show a DOM element (that was previously hidden).
 * @param {Element} element - the DOM element to be shown
 * @private
 */
export const showElement = element => element.classList.remove('md-hide');

/**
 * Wait for an element to be rendered before calling a callback.
 * @param {Element} parent - a parent of the element
 * @param {string} selector - a selector for the element to wait for
 * @param {Function} callback - the callback to call upon element detection
 * @param {array} params - the parameters for the callback
 * @param {Number} delay - the delay after element detection before the
 *                         callback is called
 */
export const waitForElement = (
  parent, selector, callback, delay, ...params) => {
  // An observer that looks for newly rendered child nodes of a parent.
  const onRenderChildren = new MutationObserver((mutations) => {
    _.each(mutations, (mutation) => {
      if (mutation.addedNodes.length > 0) {
        _.each(mutation.addedNodes, (addedNode) => {
          if (addedNode === eqS(parent, selector)) {
            /*
             * The element has been rendered. Call the callback with any
             * applicable delay.
             */
            Meteor.setTimeout(() => {
              callback(addedNode, ...params);
            }, delay);

            // Since we found it; stop the observer.
            onRenderChildren.disconnect();
            return true;
          }

          return false;
        });
      }
    });

    // We looked through everything and didn't find it; stop the observer.
    onRenderChildren.disconnect();
  });

  // Call the observer.
  onRenderChildren.observe(parent, {
    childList: true,
    subtree: true
  });
};

/**
 * Clear the selected elements and delete the group key.
 * @param groupName
 */
export const clearSelectedElements = (groupName) => {
  const selectedElements = selected[groupName];
  if (selectedElements) {
    _.each(selectedElements, (element) => {
      element.removeAttribute('data-selected');
    });
  }

  delete selected[groupName];
};

/**
 * Handle a click on a selectable element, e.g. card. This function is used to
 * manage an array of selected elements of a given type in order to apply
 * a common operation.
 * @param {Element} element - the element that was clicked
 * @param {string} groupName - the type of thing that each element represents,
 *                             used in the plural, e.g. 'cars'
 */
export const handleClickOnSelectableElement = (element, groupName) => {
  if (!selected[groupName]) {
    // Initialize an appropriate key if it does not already exist.
    selected[groupName] = [];
  }

  const selectedElements = selected[groupName];

  // Gets the index of an element.
  const getIndex = el => el.getAttribute('data-index');

  // Toggle the selection and inclusion in the selected elements array.
  if (element.hasAttribute('data-selected')) {
    element.removeAttribute('data-selected');

    // Remove it from the selected elements array.
    const index = _.findIndex(selectedElements, _element =>
      (getIndex(_element) === getIndex(element)));

    if (index !== -1) { selectedElements.splice(index, 1); }

    // If this was the last element, remove the key.
    if (selectedElements.length === 0) {
      delete clearSelectedElements(groupName);
    }
  } else {
    element.setAttribute('data-selected', 'true');
    selectedElements.push(element);
  }
};

/**
 * Get the array of selected elements in a group.
 * @param groupName
 */
export const getSelectedElements = groupName => selected[groupName];

/**
 * Checks whether a scrollable element is visible, i.e. not concealed by
 * 'display: none', and actually has overflow, then sets an overflow attribute
 * and an initial scroll position of 'fully up'. Elements that are not
 * visible must be initialized when they are.
 * @param {Element} scrollableElement - the scrollable element
 */
export const initializeScroller = (scrollableElement) => {
  const element = scrollableElement;
  if ((element.scrollHeight > 0) &&
    (element.scrollHeight > element.clientHeight)) {
    // Set the overflow attribute, and scroll up fully.
    element.setAttribute('data-overflow', 'true');
    element.scrollTop = 0;
    element.setAttribute('data-scroll-status', 'scrolled-up');

    // Hide the top overflow indicator, if present.
    const topOverflowIndicator = eqS(element.parentElement,
      '[data-overflow-indicator=top]');
    if (topOverflowIndicator) {
      hideTopOverflowIndicator(topOverflowIndicator);
    }
  }
};

/**
 * Monitor a scrollable content DIV (scroller) to determine when it is at the
 * top and bottom of the scroll range, or somewhere in between. If scrolling
 * indicators are present, hide/show them appropriately.
 * @param {Element} scroller - the scrollable content DIV
 * @param {string} state - the state (on|off) of the scroll monitor
 * @param {Function} [topCallback] - the function to call when the scroller is
 *                                   fully scrolled up
 * @param {Function} [bottomCallback] - the function to call when the scroller
 *                                      is fully scrolled down
 * @param {Function} [scrollingCallback] - the function to call when the
 *                                         scroller is (scrolling) somewhere in
 *                                         between the top and the bottom
 */
export const scrollMonitor = (
  scroller, state, topCallback, bottomCallback, scrollingCallback) => {
  // Handles scrolling of the scroller element.
  const scrollHandler = function handleScroll() {
    this.currentY = scroller.scrollTop;
    const topOverflowIndicator = eqS(scroller.parentElement,
      '[data-overflow-indicator=top]');
    const bottomOverflowIndicator = eqS(scroller.parentElement,
      '[data-overflow-indicator=bottom]');
    if (this.currentY <= 0) {
      // Scroller is at the top (or overshot on iOS/OS X).
      scroller.setAttribute('data-scroll-status', 'scrolled-up');

      // Call the related callback, if one was supplied.
      if (topCallback) {
        topCallback();
      }

      // Hide the top overflow indicator, if present.
      if (topOverflowIndicator) {
        hideTopOverflowIndicator(topOverflowIndicator);
      }
    } else if (
      (scroller.scrollHeight - this.currentY - scroller.clientHeight) <= 0) {
      // Scroller is at the bottom (or overshot on iOS/OS X).
      scroller.setAttribute('data-scroll-status', 'scrolled-down');

      // Call the related callback, if one was supplied.
      if (bottomCallback) {
        bottomCallback();
      }

      // Hide the bottom overflow indicator, if present.
      if (bottomOverflowIndicator) {
        hideBottomOverflowIndicator(bottomOverflowIndicator);
      }
    } else {
      if (this.previousY) {
        // We are scrolling ...
        if (this.currentY > this.previousY) {
          // ... downward.
          this.currentDirection = 'down';
          scroller.setAttribute('data-scroll-status', 'scrolling-down');
        } else if (this.currentY < this.previousY) {
          // ... upward.
          this.currentDirection = 'up';
          scroller.setAttribute('data-scroll-status', 'scrolling-up');
        } else {
          this.currentDirection = 'unknown';
          scroller.setAttribute('data-scroll-status', 'unknown');
        }

        // Reset the previous tracking value to detect the next movement.
        this.previousY = this.currentY;
      } else {
        // Initialize the scroll tracking value.
        this.previousY = this.currentY;
      }

      // Call the related callback, if one was supplied.
      if (scrollingCallback) {
        scrollingCallback(this.currentDirection);
      }

      // Show both overflow indicators, if present.
      if (topOverflowIndicator) {
        showTopOverflowIndicator(topOverflowIndicator);
      }

      if (bottomOverflowIndicator) {
        showBottomOverflowIndicator(bottomOverflowIndicator);
      }
    }
  };

  // Turn the handler ON or OFF.
  if (state === 'on') {
    // eslint-disable-next-line no-param-reassign
    scroller.onscroll = scrollHandler;
  } else {
    // eslint-disable-next-line no-param-reassign
    scroller.onscroll = null;
  }
};

/**
 * Run a scrollable element, i.e initialize overflow status and set the
 * initial scroll position, then turn ON the scroll monitor for the element.
 * @param {Element} scrollableElement - the scrollable element
 */
export const runScroller = (scrollableElement) => {
  // Initialize the scroller.
  initializeScroller(scrollableElement);

  // Turn ON the scroll monitor.
  scrollMonitor(scrollableElement, 'on');
};

/**
 * Insert the backdrop.
 * @param {string} type - (default|drawer|modal dialog) the type of the backdrop
 * @param {number} [opacity] - the optional opacity of the backdrop
 */
export const insertBackdrop = (type, opacity) => {
  let backdrop;

  if (dqS('[data-backdrop]')) {
    // The backdrop element already exists.
    backdrop = dqS('[data-backdrop]');
  } else {
    // The backdrop does not already exist, so create it.
    backdrop = document.createElement('div');
    backdrop.setAttribute('data-backdrop', 'true');
    backdrop.classList.add('md-backdrop');

    // Insert the backdrop into the DOM.
    document.body.appendChild(backdrop);
  }

  // Adds a class to the backdrop element.
  const addBackdropClass = (className) => {
    backdrop.className = '';
    backdrop.classList.add('md-backdrop', className);
  };

  let _opacity;
  if (type === 'drawer') {
    // It's for a drawer. Add the 'md-backdrop--drawer' class.
    addBackdropClass('md-backdrop--drawer');

    /*
     * If an opacity value was provided, then this opacity should override the
     * default modal opacity of 0.75.
     */
    _opacity = opacity || 0.3;
  } else if (type === 'modal dialog') {
    // It's for a modal dialog. Add the 'md-backdrop--modal' class.
    addBackdropClass('md-backdrop--modal');
    _opacity = opacity || 0.75;
  } else {
    // It's for a regular dialog. Add the 'md-backdrop--dialog' class.
    addBackdropClass('md-backdrop--dialog');
    _opacity = opacity || 0;
  }

  // Set final opacity.
  backdrop.style.opacity = _opacity;

  // Display the backdrop, if necessary.
  backdrop.setAttribute('data-backdrop-open', 'true');
};

/**
 * Remove the backdrop.
 */
export const removeBackdrop = () => {
  const backdrop = dqS('[data-backdrop]');

  // Removes the backdrop.
  const _removeBackdrop = () => {
    if (backdrop && backdrop.parentElement) {
      // It was not removed by a preceding event, so remove it.
      backdrop.parentElement.removeChild(backdrop);
    }
  };

  if (backdrop) {
    if (backdrop.style.opacity === '0') {
      /*
       * There will be no transition and therefore no transitionend event, so
       * we can just remove it immediately.
       */
      _removeBackdrop();
    } else {
      // Trigger opacity transition.
      backdrop.style.opacity = '0';
      /*
       * We must wait for the transition to be completed to effect a smooth
       * removal. So set up an event listener for the end of the transition.
       */
      const eventNames = [
        'transitionend', 'webkitTransitionEnd', 'mozTransitionEnd'
      ];
      _.each(eventNames, eventName =>
        backdrop.addEventListener(eventName, _removeBackdrop)
      );
    }
  }
};

/**
 * A platform detection function.
 * @param {string} uaString - the user agent string of the browser
 */
export const parseAgentString = (uaString) => {
  // Checks the uaString against a RegEx pattern.
  const matches = pattern => (pattern).test(uaString);

  return {
    // Chrome on a desktop.
    isChromeOnDesktop: matches(
      /(?!Android)Macintosh.*AppleWebKit.*(Chrome\/[.0-9]* (?!Mobile))/
    ),

    // Chrome on an Android device.
    isChromeOnAndroid: matches(
      /Linux.*Android.*WebKit.*(Chrome\/[.0-9]*)/
    ),

    // Chrome on an Android phone.
    isChromeOnAndroidPhone: matches(
      /Linux.*Android.*WebKit.*(Chrome\/[.0-9]* Mobile)/
    ),

    // Chrome on an Android tablet.
    isChromeOnAndroidTablet: matches(
      /Linux.*Android.*WebKit.*(Chrome\/[.0-9]* (?!Mobile))/
    ),

    // Chrome on an iPhone.
    isChromeOnIphone: matches(
      /iPhone.*WebKit.*(CriOS\/[.0-9]* Mobile)/
    ),

    // Safari on a desktop.
    isSafariOnDesktop: matches(
      /Macintosh.*AppleWebKit.*(Version\/[.0-9]*)(?!.*Chrome)(?!Mobile)/
    ),

    // Safari on an iPhone.
    isSafariOnIphone: matches(
      /iPhone.*WebKit\/[.0-9](?!.*Chrome).* Mobile/
    ),

    // Safari on an iPad.
    isSafariOnIpad: matches(
      /iPad.*WebKit\/[.0-9](?!.*Chrome).* Mobile/
    ),

    // Firefox on a desktop.
    isFirefoxOnDesktop: matches(
      /(Gecko\/[.0-9]*).*(Firefox\/[.0-9]*)/
    ),

    // Opera on a desktop.
    isOperaOnDesktop: matches(
      /(Opera\/[.0-9]*).*(Presto\/[.0-9]*)/
    ),

    // A desktop.
    isDesktop: (
      matches(
        /(?!Android)Macintosh.*AppleWebKit.*(Chrome\/[.0-9]* (?!Mobile))/
      ) ||
      matches(
        /Macintosh.*AppleWebKit.*(Version\/[.0-9]*)(?!.*Chrome)(?!Mobile)/
      ) ||
      matches(
        /(Gecko\/[.0-9]*).*(Firefox\/[.0-9]*)/
      ) ||
      matches(
        /(Opera\/[.0-9]*).*(Presto\/[.0-9]*)/
      )
    ),

    // A phone.
    isPhone: (
      matches(/Linux.*Android.*WebKit.*(Chrome\/[.0-9]* Mobile)/) ||
      matches(/iPhone.*WebKit.*(CriOS\/[.0-9]* Mobile)/) ||
      matches(/iPhone.*WebKit\/[.0-9](?!.*Chrome).* Mobile/)
    ),

    // A tablet.
    isTablet: (
      matches(/Linux.*Android.*WebKit.*(Chrome\/[.0-9]* (?!Mobile))/) ||
      matches(/iPad.*WebKit\/[.0-9](?!.*Chrome).* Mobile/)
    )
  };
};

// An object that holds the platform information.
export const platform = parseAgentString(
  window && window.navigator && navigator.userAgent
);
