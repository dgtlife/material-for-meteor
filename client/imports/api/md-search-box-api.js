/**
 * @file Defines the Search Box library module
 * @author Derek Gransaull <derek@dgtlife.com>
 * @copyright DGTLife, LLC 2017
 */
import { ReactiveVar } from 'meteor/reactive-var';
import { dqS, eqS } from './md-utils.js';

// The Menu and Search modes and for the inside and outside worlds.
export const menuMode = new ReactiveVar(null);
export const inSearchMode = new ReactiveVar('false');

/**
 * Returns the Search Box element from the optional parameter.
 * @param {Element} [searchbox] - the Search Box element
 * @returns {Element}
 */
function getSearchBox(searchbox) {
  if (!searchbox) {
    return dqS('.md-search-box');
  }

  return searchbox;
}

/**
 * Activates Search
 * @param {Object} event - the event associated with the Start Search button.
 * @param {Element} [searchbox] - the Search Box element
 */
export function activateSearch(event, searchbox) {
  const searchBox = getSearchBox(searchbox);

  eqS(searchBox, '.md-search-box__input').focus();
  showShadow(searchBox);
  if (event) {
    event.currentTarget.classList.add('active');
  } else {
    eqS(searchBox, '.button__start-search').classList.add('active');
  }
}

/**
 * Deactivates Search
 * @param {Object} event - the event associated with the Start Search button.
 * @param {Element} [searchbox] - the Search Box element
 */
export function deactivateSearch(event, searchbox) {
  const searchBox = getSearchBox(searchbox);

  eqS(searchBox, '.md-search-box__input').blur();
  hideMenu(searchBox);
  hideShadow(searchBox);
  if (event) {
    event.currentTarget.classList.remove('active');
  } else {
    eqS(searchBox, '.button__start-search').classList.remove('active');
  }
}

/**
 * Resets/clears the Search Box input.
 * @param {Element} searchbox - the Search Box element
 */
function resetInput(searchbox) {
  const input = eqS(searchbox, '.md-search-box__input');
  input.value = null;

  // Explicit blur is needed for Chrome Android.
  input.blur();
}

/**
 * Shows the Search Box menu.
 * @param {Element} searchbox - the Search Box element
 */
export function showMenu(searchbox) {
  eqS(searchbox, '.md-search-box__menu-container').classList.remove('md-hide');
}

/**
 * Shows the Drop Shadow.
 * @param {Element} searchbox - the Search Box element
 */
export function showShadow(searchbox) {
  searchbox.classList.add('md-shadow--2dp');
}

/**
 * Hides the Search Box menu.
 * @param {Element} searchbox - the Search Box element
 */
export function hideMenu(searchbox) {
  eqS(searchbox, '.md-search-box__menu-container').classList.add('md-hide');
}

/**
 * Hides the Drop Shadow.
 * @param {Element} searchbox - the Search Box element
 */
export function hideShadow(searchbox) {
  searchbox.classList.remove('md-shadow--2dp');
}

/**
 * Clears the current query from the Search Box.
 */
export function clearQuery(searchbox) {
  const searchBox = getSearchBox(searchbox);

  // Hide the menu (which collapses the search box).
  hideMenu(searchBox);

  // Hide the Clear Query button (nothing left to clear).
  eqS(searchBox, '.button__clear-query').classList.add('md-hide');

  // Reset the input.
  resetInput(searchBox);
}

/**
 * Shows the Exit Search button when a menu selection is clicked.
 * @param searchbox
 */
export function showExitButton(searchbox) {
  const searchBox = getSearchBox(searchbox);

  // Replace the Start Search button by the Exit Search button.
  eqS(searchBox, '.button__start-search').classList.add('md-hide');
  eqS(searchBox, '.button__exit-search').classList.remove('md-hide');
}

/**
 * Exits the Search mode of the Search Box.
 */
export function exitSearch(searchbox) {
  const searchBox = getSearchBox(searchbox);

  // Hide the menu (which collapses the search box).
  hideMenu(searchBox);

  // Hide the Shadow to indicate Search is inactive.
  hideShadow(searchBox);

  // Reset the buttons.
  eqS(searchBox, '.button__exit-search').classList.add('md-hide');
  eqS(searchBox, '.button__clear-query').classList.add('md-hide');
  eqS(searchBox, '.button__start-search').classList.remove('md-hide', 'active');

  // Reset the input.
  resetInput(searchBox);
}

/**
 * Enables the Search Box.
 * @param {Element} searchbox - the Search Box element
 */
export function enableSearchBox(searchbox) {
  const input = eqS(searchbox, '.md-search-box__input');
  input.removeAttribute('disabled');
}

/**
 * Disables the Search Box.
 * @param {Element} searchbox - the Search Box element
 */
export function disableSearchBox(searchbox) {
  const input = eqS(searchbox, '.md-search-box__input');
  input.setAttribute('disabled', 'true');
}
