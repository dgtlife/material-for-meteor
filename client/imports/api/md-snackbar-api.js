/**
 * @file Defines the API for MD Snackbar
 * @author Derek Gransaull <derek@dgtlife.com>
 * @copyright DGTLife, LLC 2016
 *
 * Created on 11/27/16
 */
import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { ReactiveVar } from 'meteor/reactive-var';
import { _ } from 'meteor/underscore';
import { getConfig } from './md-run.js';
import {
  dgEBI,
  dqS,
  eqS
} from './md-utils.js';

// The snackbar queue.
const snackbars = [];

// Reactive variable for snackbar count.
const snackbarCount = new ReactiveVar(0);

/**
 * Post a snackbar.
 * @param {object} snackbar - the snackbar to be posted
 */
export const postSnackbar = (snackbar) => {
  check(snackbar, Object);
  let _snackbar = snackbar;

  /*
   * Add a unique _id, if necessary (i.e. if the snackbar is not being fed from
   * a collection), to allow selection in the DOM.
   */
  if ((!_snackbar._id) && (!_snackbar.id)) {
    _snackbar._id = Random.id(4);
  }

  if (_snackbar.id) {
    _snackbar._id = _snackbar.id;
    _snackbar = _.omit(_snackbar, 'id');
  }

  // Push the snackbar object into the snackbars array
  snackbars.push(_snackbar);

  // Update the 'snackbarCount' reactive variable.
  snackbarCount.set(snackbars.length);
};

/**
 * Clear the snackbar that was just displayed from the snackbars array.
 * @param {string} _id - the _id of the current snackbar object
 */
const clearDisplayedSnackbar = (_id) => {
  // Remove the current snackbar element from the DOM, if it's still there.
  const currentSnackbar = dgEBI(`snackbar-${_id}`);
  if (currentSnackbar) {
    currentSnackbar.parentElement.removeChild(currentSnackbar);

    // Remove the snackbar style, in the event that it was swiped.
    dqS('[data-snackbar]').removeAttribute('style');

    // Remove the current snackbar object from the top of the array.
    snackbars.shift();

    // Update the 'snackbarCount' reactive variable.
    snackbarCount.set(snackbars.length);
  }
};

/**
 * Display the snackbar.
 * @param {string} _id - the _id of the current snackbar object
 */
export const displayCurrentSnackbar = (_id) => {
  // Get the current snackbar.
  const currentSnackbar = dgEBI(`snackbar-${_id}`);

  /*
   * If this is a multi-line snackbar on a narrow screen, increase the vertical
   * padding of the snackbar message to 24px (per the MD spec).
   */
  const snackbarMessage = eqS(currentSnackbar, '[data-snackbar-message]');
  if ((window.innerWidth < 600) && (snackbarMessage.clientHeight > 48)) {
    snackbarMessage.classList.add('multi-line');
  }

  // Set the initial position of the snackbar assembly below the viewport.
  const snackbarHeight = currentSnackbar.clientHeight;
  const snackbar = currentSnackbar.parentElement.parentElement;
  snackbar.setAttribute('style', `bottom: -${snackbarHeight}px;`);

  // Animate the snackbar upwards into the viewport.
  const upSpec = -snackbarHeight;
  snackbar.style.transform = `translateY(${upSpec}px)`;

  // Let the snackbar stay in the 'up' position for 3 sec, then lower it.
  const downSpec = snackbarHeight;
  Meteor.setTimeout(() => {
    if (dgEBI(`snackbar-${_id}`)) {
      /*
       * The current snackbar was not cleared by a swipe, so animate the
       * snackbar down.
       */
      snackbar.style.transform = `translateY(${downSpec}px)`;
      Meteor.setTimeout(() => {
        // Clear the current snackbar.
        clearDisplayedSnackbar(_id);
      }, 300);
    }
  }, 3300);

  /*
   * Check whether any other elements need to move along with the snackbar on a
   * narrow screen.
   */
  const elementsToMove = getConfig().elementsToMove;
  if ((window.innerWidth < 600) && (elementsToMove.length > 0)) {
    _.each(elementsToMove, (elementId) => {
      const element = dgEBI(elementId);

      // Animate the element upwards the same distance as the snackbar.
      element.style.transition = 'transform 0.3s';
      element.style.transform = `translateY(${upSpec}px)`;

      // Let the element remain in this position for 3 sec.
      Meteor.setTimeout(() => {
        /*
         * Animate the element down with the snackbar.
         * For some reason, the element appears to be included in the downward
         * translation of the snackbar, and does not need to be directly
         * translated down itself.
         */
        element.style.transform = 'translateY(0)';

        // For some reason, removal of the style is not necessary.
      }, 3300);
    });
  }
};

/**
 * Get the current snackbar from the snackbars array.
 * @returns {Array|null} - an array of one snackbar object
 */
export const getCurrentSnackbarElement = () => {
  if (snackbarCount.get() === 0) {
    return null;
  }

  return [snackbars[0]];
};

/**
 * Dismiss the snackbar to the left with a transition delay.
 * @param {string} _id - the _id of the current snackbar object
 * @param {Element} snackbar - the MD Snackbar element
 */
const dismissSnackbarToLeft = (_id, snackbar) => {
  const _snackbar = snackbar;
  // Set a style that moves the snackbar off-screen to the right.
  _snackbar.style.transform += `translateX(-${window.innerWidth + 24}px)`;
  Meteor.setTimeout(() => {
    // Clear the current snackbar.
    clearDisplayedSnackbar(_id);
  }, 350);
};

/**
 * Dismiss the snackbar to the right with a transition delay.
 * @param {string} _id - the _id of the current snackbar object
 * @param {Element} snackbar - the MD Snackbar element
 */
const dismissSnackbarToRight = (_id, snackbar) => {
  const _snackbar = snackbar;
  // Set a style that moves the snackbar off-screen to the right.
  _snackbar.style.transform += `translateX(${window.innerWidth + 24}px)`;
  Meteor.setTimeout(() => {
    // Clear the current snackbar.
    clearDisplayedSnackbar(_id);
  }, 350);
};

/**
 * Handle the 'touchmove' event on the snackbar and determine the swipe
 * direction. This is used for mobile devices.
 * @param {string} _id - the _id of the current snackbar object
 * @param {object} event - the event object
 */
export const handleTouchmove = (_id, event) => {
  const currentSnackbar = event.currentTarget;
  const snackbar = currentSnackbar.parentElement.parentElement;
  const startTouch = event.originalEvent.touches[0];
  const startX = startTouch.pageX;

  // Handles the 'touchend' event to detect a swipe.
  const handleSwipe = (eventEnd) => {
    eventEnd.stopImmediatePropagation();
    const endTouch = eventEnd.changedTouches[0];
    const endX = endTouch.pageX;
    if (endX > startX) {
      // Right swipe.
      dismissSnackbarToRight(_id, snackbar);
    } else if (endX < startX) {
      // Left swipe.
      dismissSnackbarToLeft(_id, snackbar);
    } else {
      // No swipe; just clear the current snackbar.
      clearDisplayedSnackbar(_id);
    }
  };

  // Add an event listener to listen for the 'touchend' event.
  currentSnackbar.addEventListener('touchend', handleSwipe);
};
