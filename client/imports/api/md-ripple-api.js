/**
 * @file Defines the API for MD Ripple
 * @author Derek Gransaull <derek@dgtlife.com>
 * @copyright DGTLife, LLC 2016
 */
import { Meteor } from 'meteor/meteor';

/**
 * Compute the CSS styles for size and position of the ripple.
 * @param {string} origin - 'center'|'offset', i.e. where should the ripple
 *                          originate from
 * @param {object} container - an object that holds the dimensions of the
 *                             the ripple container
 * @param {Number} [eventX] - the distance (in pixels) from the left edge of
 *                            the container to the event position
 * @param {Number} [eventY] - the distance (in pixels) from the top edge of
 *                            the container to the event position
 */
const computeRippleStyle = (origin, container, eventX, eventY) => {
  /*
   * Set the width and height to be equal to 2 times the longer side of the
   * ripple container.
   */
  let height;
  let width;
  if (container.width >= container.height) {
    height = container.width * 2;
    width = container.width * 2;
  } else {
    height = container.height * 2;
    width = container.height * 2;
  }

  // Set the position.
  let top;
  let left;
  if (origin === 'center') {
    // Center the ripple on the ripple container.
    top = -((height - container.height) / 2);
    left = -((width - container.width) / 2);
  } else {
    // Center the ripple on the click/touch position.
    top = -((height / 2) - eventY);
    left = -((width / 2) - eventX);
  }

  // Compose and return the ripple style.
  return (
    `width: ${width}px; height: ${height}px; top: ${top}px; left: ${left}px;`
  );
};

/**
 * Set the size and position of the ripple.
 * @param {Element} ripple - the ripple element
 * @param {Number} [eventX] - the distance (in pixels) from the left edge of
 *                            the ripple container to the event position
 * @param {Number} [eventY] - the distance (in pixels) from the top edge of
 *                            the ripple container to the event position
 */
export const setRippleStyle = (ripple, eventX, eventY) => {
  const container = {};
  container.height = ripple.parentElement.offsetHeight;
  container.width = ripple.parentElement.offsetWidth;

  // The style for this ripple is not yet set.
  let rippleStyle;
  if (
    ripple && ripple.parentElement &&
    ripple.parentElement.parentElement &&
    ripple.parentElement.parentElement.hasAttribute('data-radio-button')
  ) {
    /*
     * It's an MD Radio button. Set the pre-determined size and position of its
     * ripple.
     */
    rippleStyle = 'width: 3rem; height: 3rem; top: -1rem; left: -1rem;';
  } else if (
    ripple && ripple.parentElement &&
    ripple.parentElement.parentElement &&
    ripple.parentElement.parentElement.hasAttribute('data-checkbox')
  ) {
    /*
     * It's an MD Checkbox. Set the pre-determined size and position of its
     * ripple.
     */
    rippleStyle = 'width: 3rem; height: 3rem; top: -0.75rem; left: -0.75rem;';
  } else if (
    ripple && ripple.parentElement &&
    ripple.parentElement.hasAttribute('data-fab')
  ) {
    if (ripple.parentElement.getAttribute('data-fab') === 'mini') {
      /*
       * It's a mini MD FAB. Set the pre-determined size and position of its
       * ripple.
       */
      rippleStyle = 'width: 2.5rem; height: 2.5rem; top: 0; left: 0;';
    } else {
      // It's an MD FAB. Set a pre-determined size and position for its ripple.
      rippleStyle = 'width: 3.5rem; height: 3.5rem; top: 0; left: 0;';
    }
  } else if (
    ripple && ripple.parentElement &&
    ripple.parentElement.hasAttribute('data-icon-button')
  ) {
    /*
     * It's an Icon Button. Set the pre-determined size and position of its
     * ripple.
     */
    rippleStyle = 'width: 3rem; height: 3rem; top: 0; left: 0;';
  } else if (ripple && ripple.hasAttribute('data-offset')) {
    // It's an element with an offset ripple. Compute the ripple style.
    rippleStyle = computeRippleStyle('offset', container, eventX, eventY);
  } else {
    /*
     * It's an element with the default centered ripple. Compute the ripple
     * style.
     */
    rippleStyle = computeRippleStyle('center', container);
  }

  ripple.setAttribute('style', rippleStyle);
};

/**
 * Event handler for launching the ripple.
 * @param {Element} ripple - the ripple element
 * @param {Number} eventX - the x coordinate of the mouse/touch event relative
 *                          to the ripple container
 * @param {Number} eventY - the y coordinate of the mouse/touch event relative
 *                          to the ripple container
 */
export const launchRipple = (ripple, eventX, eventY) => {
  // Don't ripple on a disabled element.
  if (ripple.parentElement.hasAttribute('disabled') ||
    ripple.parentElement.hasAttribute('data-disabled') ||
    ripple.parentElement.parentElement.hasAttribute('data-disabled') ||
    ripple.parentElement.parentElement.parentElement.hasAttribute('data-disabled')) {
    return false;
  }

  // Set the size and position of the ripple, if necessary.
  if (
    ripple.hasAttribute('data-offset') ||
    (!ripple.hasAttribute('style'))
  ) {
    setRippleStyle(ripple, eventX, eventY);
  }

  // Add the class to trigger animation of the wave.
  ripple.classList.add('is-rippling');

  Meteor.setTimeout(
    () => {
      // Remove the class after 350ms
      ripple.classList.remove('is-rippling');

      /*
       * If it's an offset ripple remove the style as it's a function of the
       * touch coordinates.
       */
      if (ripple.hasAttribute('data-offset')) {
        ripple.removeAttribute('style');
      }
    },
    350
  );

  return true;
};
