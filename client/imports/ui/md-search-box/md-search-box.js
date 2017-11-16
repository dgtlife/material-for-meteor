/**
 * @file Defines the on-render callback and event handler(s) for the
 *       MD Search Box.
 * @author Derek Gransaull <derek@dgtlife.com>
 * @copyright DGTLife, LLC 2017
 */
import { Template } from 'meteor/templating';
import { eqS } from '../../api/md-utils.js';
import {
  activateSearch,
  deactivateSearch,
  inSearchMode,
  menuMode,
  showMenu,
  showShadow,
  clearQuery,
  showExitButton,
  exitSearch
} from '../../api/md-search-box-api.js';
import './md-search-box.jade';

// This helper is controlled externally using the reactiveVar, menuMode.
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

    // Indicate that Search is active.
    showShadow(searchBox);
    eqS(searchBox, '.button__start-search').classList.add('active');
    inSearchMode.set('true');
  },

  'input .md-search-box__input'(event) {
    const searchBox = event.currentTarget.parentElement.parentElement;

    // Set Search Mode.
    if (inSearchMode.get() === 'false') {
      inSearchMode.set('true');
    }

    showExitButton(searchBox);
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

  'click .button__start-search'(event) {
    if (inSearchMode.get() === 'false') {
      activateSearch(event);
      inSearchMode.set('true');
    } else {
      deactivateSearch(event);
      inSearchMode.set('false');
    }
  },

  'click .button__exit-search'() {
    if (inSearchMode.get() === 'true') {
      inSearchMode.set('false');
    }

    exitSearch();
  },

  'click .button__clear-query'() {
    clearQuery();
  }
});
