/**
 * @file Defines the on-render callback and event handler(s), for MD Menu.
 * @author Derek Gransaull <derek@dgtlife.com>
 * @copyright DGTLife, LLC 2015
 *
 * Created on 10/13/2015
 */
import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { eqS, eqSA, runScroller } from '../../api/md-utils.js';
import { handleClickOnMenuItem, importMenuItems } from '../../api/md-menu-api.js';
import './md-menu.jade';

// On-render callback for MD Menu.
Template.md_menu.onRendered(function onRenderedMenu() {
  // Import any menu items for this menu.
  importMenuItems(this.data.id);

  // Initialize any scrollable container.
  const scrollableContainer = eqS(this.firstNode, '[data-scrollable]');
  if (scrollableContainer) {
    runScroller(scrollableContainer);
  }

  // Initialize any pre-selected list item.
  if (this.firstNode.hasAttribute('data-list-selector')) {
    const selectedIndex = this.firstNode.getAttribute('data-selected');
    if (selectedIndex) {
      // Set the item as selected. ToDo: Add a method for this to the API.
      const selectedItem = eqS(this.firstNode,
        `[data-index="${selectedIndex}"]`);
      const indicator = eqS(selectedItem, '[data-selection-indicator]');
      selectedItem.classList.add('selected');
      indicator.classList.remove('unselected');
    }
  }
});

// Event handlers for MD Menu.
Template.md_menu.events({
  // Selection of a menu item with a click.
  'click [data-menu-item]'(event) {
    handleClickOnMenuItem(event.currentTarget);
  },

  // Click an list item in List-selector mode.
  'click [data-list-item]'(event) {
    const listItem = event.currentTarget;
    const indicator = eqS(listItem, '[data-selection-indicator]');
    const menu = listItem.parentElement.parentElement;
    if (listItem.classList.contains('selected')) {
      // Un-select this item.
      listItem.classList.remove('selected');
      indicator.classList.add('unselected');
      menu.removeAttribute('data-selected');
    } else {
      // Clear all items.
      const listItems = eqSA(listItem.parentElement, '[data-list-item]');
      _.each(listItems, (_listItem) => {
        const _indicator = eqS(_listItem, '[data-selection-indicator]');
        if (_listItem.classList.contains('selected')) {
          _listItem.classList.remove('selected');
          _indicator.classList.add('unselected');
        }
      });

      // Select the clicked item.
      listItem.classList.add('selected');
      indicator.classList.remove('unselected');
      menu.setAttribute('data-selected', listItem.getAttribute('data-index'));
    }
  }
});
