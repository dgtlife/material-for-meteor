/**
 * @file Defines the API for MD Dropdown Menu
 * @author Derek Gransaull <derek@dgtlife.com>
 * @copyright DGTLife, LLC 2017
 */
import { Meteor } from 'meteor/meteor';
import { dqS, eqS } from './md-utils.js';
import { setValueOfMenu, clearValueOfMenu } from './md-menu-api.js';
import { closeOpenMenus, closePopupMenu } from './md-menu-common-api.js';
import {
  setLabelAndUnderlineFocused,
  setLabelAndUnderlineUnfocused
} from './md-text-input-api.js';

/**
 * Assign the supplied value to a dropdown menu. This involves assigning the
 * value to the data-selected value of the dropdown menu element, and to the
 * value of the embedded input element. (This is part of the chain of execution
 * after a user clicks a dropdown menu item.)
 * @param {Element} menu - the embedded menu element
 * @param {string} value - the value to be assigned to the dropdown menu
 */
export function assignValueOfDropdownMenu(menu, value) {
  const field = menu.parentElement.parentElement;
  field.setAttribute('data-selected', value);
  eqS(field, '[data-dropdown-input]').value = value;
  setLabelAndUnderlineUnfocused(field);
}

/**
 * Open a dropdown menu.
 * @param {Element} menu - the popup menu element embedded in the dropdown menu
 */
export function openDropdownMenu(menu) {
  // Close any open menus.
  closeOpenMenus();

  // Get the field element.
  const field = menu.parentElement.parentElement;

  // Set the label and underline to focused style.
  setLabelAndUnderlineFocused(field);

  // Set the position of the popup menu.
  setPositionOfDropdownMenu(field, menu);

  // Set an animation attribute, if necessary.
  if (menu.parentElement.hasAttribute('data-opening-animation')) {
    const opening_animation = menu.parentElement.getAttribute(
      'data-opening-animation'
    );
    menu.setAttribute('data-opening-animation', opening_animation);
  }

  // Set the 'data-menu-open' attribute to indicate that the menu is open.
  menu.setAttribute('data-menu-open', 'true');

  /*
   * Attach a listener for closing the menu with a click.
   * Note: This will close the menu with a click on the document, including any
   * item on this menu.
   *
   * Define an event handler for the click event listener
   */
  function closeThisMenu(event) {
    event.preventDefault();

    // Ensure that the trigger was not clicked.
    const target = event.target;
    if (
      !(
        target.hasAttribute('data-trigger-target') &&
        (target.getAttribute('data-trigger-target') === menu.id)
      )
    ) {
      // We have not clicked the dropdown trigger of an open menu. Close menu.
      closePopupMenu(menu);

      // Reset the label and underline.
      setLabelAndUnderlineUnfocused(field);

      // Remove the event listeners.
      document.removeEventListener('click', closeThisMenu);
    }
  }

  // Attach the event listeners.
  Meteor.defer(
    () => document.addEventListener('click', closeThisMenu)
  );
}

/**
 * Set the position of a dropdown menu via the style attribute.
 * @param {Element} field - the field element
 * @param {Element} menu - the embedded menu element
 */
export function setPositionOfDropdownMenu(field, menu) {
  // Get the specified position for the menu from the parent element.
  const position = menu.parentElement.getAttribute('data-position');

  // Get the element dimensions to compute the menu position settings.
  const input = eqS(field, '[data-dropdown-input]');
  menu.setAttribute('style', 'display: block; opacity: 0;');
  const left = ((input.clientWidth - menu.clientWidth) / 2);
  const topMiddle = -((menu.clientHeight - 35) / 2);
  menu.removeAttribute('style');

  // Compose the style that positions the menu.
  function composeStyle(spec) {
    if (spec === 'down') {
      return `top: 0; left: ${left}px; z-index: 8;`;
    } else if (spec === 'middle') {
      return `top: ${topMiddle}px; left: ${left}px; z-index: 8;`;
    } else if (spec === 'up') {
      return `bottom: 0; left: ${left}px; z-index: 8;`;
    }

    return undefined;
  }

  let style;
  if (position === 'dropdown-up') {
    style = composeStyle('up');
  } else if (position === 'dropdown-middle') {
    style = composeStyle('middle');
  } else if (position === 'dropdown-down') {
    style = composeStyle('down');
  } else {
    style = composeStyle('down');
  }

  // Set the style on the menu; it will display automatically.
  menu.setAttribute('style', style);
}

/**
 * Set the supplied value to a dropdown menu. This involves assigning the
 * value to the data-selected value of the dropdown menu element, and to the
 * value of the embedded input element.
 * @param {String} selector - a selector for the dropdown menu
 * @param {string} value - the value to be assigned to the dropdown menu
 */
export function setValueOfDropdownMenu(selector, value) {
  if (!value) {
    throw new Meteor.Error(
      'missing-parameter',
      'A value must be supplied; use "clearValueOfDropdownMenu()" to clear a dropdown menu, if desired.');
  }

  setValueOfMenu(eqS(dqS(selector), '[data-dropdown-menu]'), value);
}

/**
 * Get the value of a dropdown menu.
 * @param {string} selector - a selector for the dropdown menu
 */
export function getValueOfDropdownMenu(selector) {
  if (selector) {
    dqS(selector).getAttribute('data-selected');
  }
}

/**
 * Clear the value of a dropdown menu.
 * @param {string} selector - a selector for the dropdown menu
 */
export function clearValueOfDropdownMenu(selector) {
  const field = dqS(selector);

  // Clear the value of the input, and reset the label position.
  eqS(field, '[data-dropdown-input]').value = null;
  setLabelAndUnderlineUnfocused(field);

  // Clear the value of the embedded menu.
  clearValueOfMenu(eqS(field, '[data-dropdown-menu]'));
}
