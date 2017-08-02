/**
 * @file Defines the on-render callback and event handler(s) for the
 *       MD Search Box.
 * @author Derek Gransaull <derek@dgtlife.com>
 * @copyright DGTLife, LLC 2017
 */
import { Template } from 'meteor/templating';
import { eqS } from '../../api/md-utils.js';
import {
  menuMode,
  showMenu,
  showShadow,
  clearQuery,
  exitSearch
} from '../../api/md-search-box-api.js';
import './md-search-box.jade';

let inSearchMode = false;

// This helper is controlled externally using reactiveVar, menuMode.
Template.registerHelper(
  'md_search_box__mode_is_history',
  () => menuMode.get() === 'history'
);

Template.md_search_box.events({
  'focus .md-search-box__input'(event) {
    const searchBox = event.currentTarget.parentElement.parentElement;
    const input = eqS(searchBox, '.md-search-box__input');

    if ((input.value === null) || (input.value === '')) {
      // The field is empty. Show History.
      eqS(searchBox, '.button__clear-query').classList.add('md-hide');
      menuMode.set('history');
    } else {
      // A query was being entered. Show Suggestions.
      menuMode.set('suggestions');

      // Show the Clear Query button.
      eqS(searchBox, '.button__clear-query').classList.remove('md-hide');
    }

    // Show the menu (which expands the search box).
    showMenu(searchBox);

    // Show the Shadow to indicate Search is active.
    showShadow(searchBox);
  },

  'input .md-search-box__input'(event) {
    const searchBox = event.currentTarget.parentElement.parentElement;

    // Set Search Mode.
    if (!inSearchMode) {
      inSearchMode = true;
    }

    // Replace the Start Search button by the Exit Search button.
    eqS(searchBox, '.button__start-search').classList.add('md-hide');
    eqS(searchBox, '.button__exit-search').classList.remove('md-hide');
    if (
      (event.currentTarget.value === null) ||
      (event.currentTarget.value === '')
    ) {
      // The field has been backspaced out. Show History.
      menuMode.set('history');

      // Hide the Clear Query button (since there is nothing to clear).
      eqS(searchBox, '.button__clear-query').classList.add('md-hide');
    } else {
      // A query is being entered. Show Suggestions.
      menuMode.set('suggestions');

      // Show the Clear Query button.
      eqS(searchBox, '.button__clear-query').classList.remove('md-hide');
    }

    // Show the menu.
    showMenu(searchBox);
  },

  'click .button__exit-search'() {
    if (inSearchMode) {
      inSearchMode = false;
    }

    exitSearch();
  },

  'click .button__clear-query'() {
    clearQuery();
  }
});
