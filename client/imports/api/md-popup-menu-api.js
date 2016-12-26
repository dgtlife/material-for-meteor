/**
 * @file Defines the API for MD Popup Menu
 * @author Derek Gransaull <derek@dgtlife.com>
 * @copyright DGTLife, LLC 2016
 *
 * Created on 11/20/16
 */
import { Meteor } from 'meteor/meteor';
import { dgEBI } from './md-utils.js';
import { closePopupMenu, closeOpenMenus } from './md-menu-common-api.js';
import { openDropdownMenu } from './md-dropdown-menu-api.coffee';

/**
 * Set the size and position of a popup menu via the style attribute.
 * @param {Element} menu - the menu element
 */
const setSizeAndPositionOfPopupMenu = (menu) => {
  /*
   * Get the dimensions of the menu element in order to set the size explicitly,
   * and to enable potential animations.
   */
  menu.setAttribute('style', 'display: block; opacity: 0;');
  const dimensions = menu.getBoundingClientRect();
  menu.removeAttribute('style');

  // Initialize the style that positions the menu.
  let style = `height: ${dimensions.height - 16}px; 
               width: ${dimensions.width}px;`;

  // Get the specified position for the menu from the parent element.
  const position = menu.parentElement.getAttribute('data-position');

  // Complete the style based on the position.
  if (position === 'top-left') {
    style += 'bottom: 0; right: 0;';
  } else if (position === 'top-right') {
    style += 'bottom: 0; left: 0;';
  } else if (position === 'bottom-left') {
    style += 'top: 0; right: 0;';
  } else if (position === 'bottom-right') {
    style += 'top: 0; left: 0;';
  } else {
    style += 'top: 0; right: 0;';
  }

  // Set the style attribute on the menu.
  menu.setAttribute('style', style);
};

/**
 * Open a popup menu.
 * @param {Element} menu - the menu element
 */
export const openPopupMenu = (menu) => {
  // Close any open menus.
  closeOpenMenus();

  // Set the position of the popup menu.
  setSizeAndPositionOfPopupMenu(menu);

  // Set an animation attribute, if necessary.
  if (menu.parentElement.hasAttribute('data-opening-animation')) {
    const openingAnimation =
            menu.parentElement.getAttribute('data-opening-animation');
    menu.setAttribute('data-opening-animation', openingAnimation);
  }

  // Show the menu by setting the 'data-menu-open' attribute.
  menu.setAttribute('data-menu-open', 'true');

  /*
   * In the mouse case, this menu automatically closes on 'mouseleave'. For the
   * touch case, an event listener for closing the menu with a touch is used.
   * Note: This will close the menu with a click on the document, including an
   * item on this menu.
   *
   * Define the event handler for the 'touchstart' event listener.
   */
  const closeThisMenu = (event) => {
    event.preventDefault();

    // Close this menu.
    closePopupMenu(menu);

    // Remove the listener.
    document.removeEventListener('click', closeThisMenu);
  };

  // Attach the event listener after the menu has opened.
  // ToDo: Consider replacing by Meteor.defer by explicit detection.
  Meteor.defer(() => document.addEventListener('click', closeThisMenu));
};

/**
 * Handle the click on a menu-trigger element.
 * @param {Element} trigger - the trigger element
 */
export const handleClickOnMenuTrigger = (trigger) => {
  // Get the target popup menu element.
  const menu = dgEBI(trigger.getAttribute('data-trigger-target'));
  if (menu.hasAttribute('data-menu-open')) {
    // The menu is already open; do nothing.
  } else if (menu.hasAttribute('data-popup-menu')) {
    // It's a standalone popup menu.
    openPopupMenu(menu);
  } else if (menu.hasAttribute('data-dropdown-menu')) {
    // It's a popup menu embedded in a dropdown menu.
    openDropdownMenu(menu);
  }
};

/**
 * Assign the supplied value to a popup menu. This involves assigning the value
 * to the 'data-selected' attribute of the popup menu element. This is part of
 * the chain of execution after a user clicks a popup menu item.
 * @param {Element} menu - the embedded menu element
 * @param {string} value - the value to be assigned to the popup menu
 */
export const assignValueOfPopupMenu = (menu, value) =>
  menu.parentElement.setAttribute('data-selected', value);
