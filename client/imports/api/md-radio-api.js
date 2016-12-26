/**
 * @file Defines the API for MD Radio
 * @author Derek Gransaull <derek@dgtlife.com>
 * @copyright DGTLife, LLC 2016
 *
 * Created on 11/29/16
 */
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { dqS, eqSA, getElement } from './md-utils.js';

/**
 * Import the radio buttons for the supplied radio group.
 * ToDo: Create a utility function for importing nodes.
 * @param {Element} groupElement - the group element
 */
export const importRadioButtons = (groupElement) => {
  // Get the group value;
  const group = groupElement.getAttribute('data-group');

  // Look for any node containing radio buttons for this radio group.
  const tempButtonContainer = dqS(`[data-buttons-for="${group}"]`);
  if (tempButtonContainer) {
    const buttonNodes = Array.from(tempButtonContainer.childNodes);
    /*
     * Move each radio button node from its temporary container parent, into the
     * new radio group parent.
     */
    _.each(buttonNodes, buttonNode => groupElement.appendChild(buttonNode));

    // Remove the temporary container.
    tempButtonContainer.parentElement.removeChild(tempButtonContainer);
  }
};

/**
 * Set a radio button in a radio group as 'checked'.
 * @param {Element} group - the radio group element
 * @param {string} value - the value to be assigned to the radio group
 */
const setCheckedButton = (group, value) => {
  // Get the radio buttons;
  const buttons = eqSA(group, '[data-radio-button]');

  // Set the button with the matching value as 'checked'; clear the others.
  _.each(buttons, (button) => {
    if (button.getAttribute('data-value') === value) {
      button.setAttribute('data-checked', 'true');
    } else {
      button.removeAttribute('data-checked');
    }
  });
};

/**
 * Initialize the value of a radio group that has its 'data-selected'
 * attribute preset. It sets the button that corresponds to the 'data-selected'
 * value of the group as 'checked'.
 * @param {Element} group - the group element
 */
export const initializeValueOfRadioGroup = group =>
  setCheckedButton(group, group.getAttribute('data-selected'));

/**
 * Enable a radio button that is disabled, by removing the 'disabled' attribute.
 * @param {string} selector - the selector for the radio button
 */
export const enableRadioButton = selector =>
  dqS(selector).removeAttribute('data-disabled');

/**
 * Disable a radio button that is enabled, by setting the 'disabled' attribute.
 * @param {string} selector - a selector for the button
 */
export const disableRadioButton = selector =>
  dqS(selector).setAttribute('data-disabled', 'true');

/**
 * Get the value of a radio group. This is for use 'from a distance', when one
 * is not operating directly on the radio group element.
 * @param {string} selector - a selector for the radio group element
 */
export const getValueOfRadioGroup = selector =>
  dqS(selector).getAttribute('data-selected');

/**
 * Clear the value of a radio group.
 * @param {string|Element} groupSpec - a selector for the group or the group
 *                                     element itself
 */
export const clearValueOfRadioGroup = (groupSpec) => {
  // Get the group element.
  const group = getElement(groupSpec);

  // Remove the "data-checked" attribute from all buttons in this group.
  const buttons = eqSA(group, '[data-radio-button]');
  _.each(buttons, button => button.removeAttribute('data-checked'));

  // Remove the "data-selected" attribute from the group element.
  group.removeAttribute('data-selected');
};

/**
 * Set the value of a radio group.
 * @param {string} selector - a selector for the radio group
 * @param {string} value - the value to be assigned to the radio group
 */
export const setValueOfRadioGroup = (selector, value) => {
  if (!value) {
    throw new Meteor.Error(
      `A value must be supplied; use "clearValueOfRadioGroup()" to clear a 
       radio group, if desired.`
    );
  }

  // Get the group element.
  const group = dqS(selector);

  // Clear the value of the radio group.
  clearValueOfRadioGroup(group);

  // Set the corresponding button as 'checked'.
  setCheckedButton(group, value);

  // Set the data-selected' value of the radio group element.
  group.setAttribute('data-selected', value);
};

/**
 * Assign the 'data-value' of the supplied (clicked) radio button to its
 * radio group element.
 * @param {Element} button - the button element
 */
const assignButtonValueToGroup = (button) => {
  // Clear 'data-checked' from all buttons in the group.
  clearValueOfRadioGroup(button.parentElement);

  // Set the 'data-checked' value for the checked button.
  button.setAttribute('data-checked', 'true');

  // Set the 'data-selected' attribute in the radio group element.
  const value = button.getAttribute('data-value');
  button.parentElement.setAttribute('data-selected', value);
};

/**
 * Handler for the click event on an MD radio button.
 * @param {Element} button - the button element
 */
export const handleClickOnRadioButton = (button) => {
  if (!(button.hasAttribute('data-checked') ||
    button.hasAttribute('data-disabled'))) {
   /*
    * Set the selected value of the radio group (which includes 'checking'
    * the appropriate button).
    */
    assignButtonValueToGroup(button);
  }
};
