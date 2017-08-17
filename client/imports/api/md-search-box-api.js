/**
 * @file Defines the Search Box library module
 * @author Derek Gransaull <derek@dgtlife.com>
 * @copyright DGTLife, LLC 2017
 */
import { ReactiveVar } from 'meteor/reactive-var';
import { dqS, eqS } from './md-utils.js';

// Sets the menu mode for the inside and outside worlds.
export const menuMode = new ReactiveVar(null);

/**
 * Activate Search
 * @param {Object} event - the event associated with the Start Search button.
 */
export function activateSearch(event) {
  const searchbox = dqS('.md-search-box');
  eqS(searchbox, '.md-search-box__input').focus();
  showShadow(searchbox);
  if (event) {
    event.currentTarget.classList.add('active');
  } else {
    eqS(searchbox, '.button__start-search').classList.add('active');
  }
}

/**
 * Deactivate Search
 * @param {Object} event - the event associated with the Start Search button.
 */
export function deactivateSearch(event) {
  const searchbox = dqS('.md-search-box');
  eqS(searchbox, '.md-search-box__input').blur();
  hideShadow(searchbox);
  if (event) {
    event.currentTarget.classList.remove('active');
  } else {
    eqS(searchbox, '.button__start-search').classList.remove('active');
  }
}

/**
 * Reset/clear the Search Box input.
 * @param {Element} searchbox - the Search Box element
 */
function resetInput(searchbox) {
  const input = eqS(searchbox, '.md-search-box__input');
  input.value = null;

  // Explicit blur is needed for Chrome Android.
  input.blur();
}

/**
 * Show the Search Box menu.
 * @param {Element} searchbox - the Search Box element
 */
export function showMenu(searchbox) {
  eqS(searchbox, '.md-search-box__menu-container').classList.remove('md-hide');
}

/**
 * Show the Drop Shadow.
 * @param {Element} searchbox - the Search Box element
 */
export function showShadow(searchbox) {
  searchbox.classList.add('md-shadow--2dp');
}

/**
 * Hide the Search Box menu.
 * @param {Element} searchbox - the Search Box element
 */
export function hideMenu(searchbox) {
  eqS(searchbox, '.md-search-box__menu-container').classList.add('md-hide');
}

/**
 * Hide the Drop Shadow.
 * @param {Element} searchbox - the Search Box element
 */
export function hideShadow(searchbox) {
  searchbox.classList.remove('md-shadow--2dp');
}

/**
 * Clear the current query from the Search Box.
 */
export function clearQuery() {
  const searchBox = dqS('.md-search-box');

  // Hide the menu (which collapses the search box).
  hideMenu(searchBox);

  // Hide the Clear Query button (nothing left to clear).
  eqS(searchBox, '.button__clear-query').classList.add('md-hide');

  // Reset the input.
  resetInput(searchBox);
}

/**
 * Exit the Search mode of the Search Box.
 */
export function exitSearch() {
  const searchBox = dqS('.md-search-box');

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
 * Enable the Search Box.
 * @param {Element} searchbox - the Search Box element
 */
export function enableSearchBox(searchbox) {
  const input = eqS(searchbox, '.md-search-box__input');
  input.removeAttribute('disabled');
}

/**
 * Disable the Search Box.
 * @param {Element} searchbox - the Search Box element
 */
export function disableSearchBox(searchbox) {
  const input = eqS(searchbox, '.md-search-box__input');
  input.setAttribute('disabled', 'true');
}
