/**
 * @file Defines the API for MD Menu
 * @author Derek Gransaull <derek@dgtlife.com>
 * @copyright DGTLife, LLC 2016
 *
 * Created on 11/20/16
 */
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { dgEBI, dqS, eqSA, getElement } from './md-utils.js';
import { assignValueOfPopupMenu } from './md-popup-menu-api.js';
import { assignValueOfDropdownMenu } from './md-dropdown-menu-api.coffee';

/**
 * Import the menu items for the identified menu.
 * @param {string} id - the id of the menu
 */
export const importMenuItems = (id) => {
  const menu = dgEBI(id);

  // Look for any node containing menu items for this menu.
  const tempMenuItemContainer = dqS(`[data-items-for="${id}"]`);
  if (tempMenuItemContainer) {
    const itemNodes = Array.from(tempMenuItemContainer.childNodes);
    _.each(itemNodes, (itemNode) => {
      /*
       * Move each menu item node from its temporary container parent, into
       * the new menu parent.
       */
      menu.appendChild(itemNode);
    });

    // Remove the temporary container.
    tempMenuItemContainer.parentElement.removeChild(tempMenuItemContainer);
  }
};

/**
 * Set the value of a menu to the supplied value.
 * @param {string|Element} menuSpec - a selector for the menu element or the
 *                                    menu element itself
 * @param {string} value - the value to be assigned to the menu
 */
export const setValueOfMenu = (menuSpec, value) => {
  // Ensure that a non-null value is supplied.
  if (!value) {
    throw new Meteor.Error(
      `A value must be supplied; use "clearValueOfMenu()" to clear a menu, if 
       desired.`
    );
  }

  // Get the menu.
  const menu = getElement(menuSpec);

  /*
   * Add the 'selected' class to the selected item and remove the 'selected'
   * class from all other items.
   */
  const menuItems = eqSA(menu, '[data-menu-item]');
  _.each(menuItems, (menuItem) => {
    if (menuItem.getAttribute('data-value') === value) {
      // This is the currently selected item.
      menuItem.classList.add('selected');
    } else if (menuItem.classList.contains('selected')) {
      // This is the previously selected item.
      menuItem.classList.remove('selected');
    }
  });

  // Assign the value to the "data-selected" attribute of the menu element.
  menu.setAttribute('data-selected', value);

  // If this menu is embedded in a popup menu, assign the same value to the
  // popup menu element, then close the menu.
  if (menu.hasAttribute('data-popup-menu')) {
    assignValueOfPopupMenu(menu, value);
  }

  // If this menu is embedded in a dropdown menu, assign the same value to
  // the input element and the dropdown menu element, then close the menu.
  if (menu.hasAttribute('data-dropdown-menu')) {
    assignValueOfDropdownMenu(menu, value);
  }
};

/**
 * Assign the value of a selected menu item to its menu, i.e. after the user
 * has clicked on the item.
 * @param {Element} item - the selected menu item
 */
const assignItemValueToMenu = (item) => {
  const menu = dgEBI(item.getAttribute('data-menu'));
  const value = item.getAttribute('data-value');
  setValueOfMenu(menu, value);
};

/**
 * Process the selection of a menu item in a menu, i.e. when a user clicks on
 * an item
 * @param {Element} item - the menu item that was clicked or touched
 */
export const handleClickOnMenuItem = (item) => {
  // Assign the value of the item to its menu.
  assignItemValueToMenu(item);
};

/**
 * Get the value of a menu.
 * @param {string} selector - a selector for the menu
 */
export const getValueOfMenu = selector =>
  dqS(selector).getAttribute('data-selected');

/**
 * Clear a menu, i.e. de-select all items.
 * @param {string|Element} menuSpec - a selector for the menu element or the
 *                                    menu element itself
 */
export const clearValueOfMenu = (menuSpec) => {
  // Get the menu.
  const menu = getElement(menuSpec);

  // Remove the 'selected' class from all items in this menu.
  const menuItems = eqSA(menu, '[data-menu-item]');
  _.each(menuItems, item => item.classList.remove('selected'));

  // Remove the "data-selected" attribute from the menu element.
  menu.removeAttribute('data-selected');
};
