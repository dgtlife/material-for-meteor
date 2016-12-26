/**
 * @file Defines the API for MD Text Input
 * @author Derek Gransaull <derek@dgtlife.com>
 * @copyright DGTLife, LLC 2016
 *
 * Created on 11/20/16
 */
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import {
  dqS,
  eqS
} from './md-utils.js';
import {
  setStyleOfUnderlineFocused,
  setStyleOfUnderlineUnfocused,
  setStyleOfUnderlineErrored
} from './md-underline-api.coffee';
import {
  setStyleOfLabelFocused,
  setStyleOfLabelUnfocused,
  setStyleOfLabelErrored,
  setStyleOfLabelValid
} from './md-label-api.coffee';

/**
 * Set the label and underline of a text input field to the focused position
 * and appearance.
 * @param {Element} field - the text input field element
 */
export const setLabelAndUnderlineFocused = (field) => {
  setStyleOfLabelFocused(field);
  setStyleOfUnderlineFocused(field);
};

/**
 * Set the label and underline of a text input field to the unfocused position
 * and appearance.
 * @param {Element} field - the text input field element
 */
export const setLabelAndUnderlineUnfocused = (field) => {
  setStyleOfLabelUnfocused(field);
  setStyleOfUnderlineUnfocused(field);
};

/**
 * Set the label and underline of a text input field to the errored position
 * and appearance.
 * @param {Element} field - the text input field element
 */
export const setLabelAndUnderlineErrored = (field) => {
  setStyleOfLabelErrored(field);
  setStyleOfUnderlineErrored(field);
};

/**
 * Set the label and underline of a text input field to the valid position
 * and appearance.
 * @param {Element} field - the text input field element
 */
export const setLabelAndUnderlineValid = (field) => {
  setStyleOfLabelValid(field);
  setStyleOfUnderlineErrored(field);
};

/**
 * Get the value of an MD text field.
 * @param {string} selector - a selector for the text field element
 */
export const getValueOfTextField = selector =>
  dqS(selector).getAttribute('data-value');

/**
 * Set the value of an MD text field.
 * @param {string} selector - a selector for the text field element
 * @param {string} value - the value to be assigned to the text field
 */
export const setValueOfTextField = (selector, value) => {
  if (!value) {
    throw new Meteor.Error(
      `A value must be supplied; use "clearValueOfTextField()" to clear a text 
       field, if desired.`
    );
  }

  const field = dqS(selector);

  // Set the value on the field element.
  field.setAttribute('data-value', value);

  // Set the value on the input element.
  eqS(field, '[data-text-field-input]').value = value;

  // Reset the label position.
  setStyleOfLabelUnfocused(field);
};

/**
 * Clear the value of an MD text field.
 * @param {string} selector - a selector for the text field element
 */
export const clearValueOfTextField = (selector) => {
  const field = dqS(selector);

  // Clear the value on the field element.
  field.removeAttribute('data-value');

  // Clear the value on the input element.
  eqS(field, '[data-text-field-input]').value = null;

  // Reset the label position.
  const label = eqS(field, '[data-label]');
  label.classList.remove('floating');

  // Reset the label and underline style.
  setLabelAndUnderlineValid(field);
};

/**
 * Disable an MD text field.
 * @param {string} selector - a selector for the text field element
 */
export const disableTextField = (selector) => {
  const field = dqS(selector);

  // Disable the input element.
  const input = eqS(field, '[data-text-field-input]');
  input.setAttribute('disabled', 'true');

  // Add the 'disabled' class to the underline.
  const underline = eqS(field, '.md-field__underline');
  underline.classList.add('disabled');
};

/**
 * Enable an MD text field.
 * @param {string} selector - a selector for the text field element
 */
export const enableTextField = (selector) => {
  const field = dqS(selector);

  // Enable the input element.
  const input = eqS(field, '[data-text-field-input]');
  input.removeAttribute('disabled');

  // Remove the 'disabled' class from the underline.
  const underline = eqS(field, '.md-field__underline');
  underline.classList.remove('disabled');
};

/**
 * Set the height of the text area based on its input.
 * @param {Element} field - the text area field element
 */
export const setHeightOfTextarea = (field) => {
  const input = eqS(field, '[data-text-area-input]');
  const sizeDetector = eqS(field, '[data-size-detector]');
  const newHeight = sizeDetector.clientHeight - 16;
  input.setAttribute('style', `height: ${newHeight}px`);
};

/**
 * Get the value of an MD text area.
 * @param {string} selector - a selector for the text area field element
 */
export const getValueOfTextArea = selector =>
  eqS(dqS(selector), '[data-text-area-input]').value;

/**
 * Set the value of an MD text area.
 * @param {string} selector - a selector for the text area field element
 * @param {string} value - the value to be assigned to the text area
 */
export const setValueOfTextArea = (selector, value) => {
  if (!value) {
    throw new Meteor.Error(
      `A value must be supplied; use "clearValueOfTextArea()" to clear a text 
       area, if desired.`
    );
  }

  // Set the value of the text area input.
  const field = dqS(selector);
  eqS(field, '[data-text-area-input]').value = value;

  // Mirror the input value into the size detector.
  eqS(field, '[data-size-detector]').innerHTML = value;

  // Reset the label position.
  setStyleOfLabelUnfocused(field);

  // Reset the height of the text area.
  setHeightOfTextarea(field);
};

/**
 * Clear the value of an MD text area.
 * @param {string} selector - a selector for the text area field element
 */
export const clearValueOfTextArea = (selector) => {
  const field = dqS(selector);

  // Clear the text area input.
  eqS(field, '[data-text-area-input').value = null;

  // Mirror the input value into the size detector.
  eqS(field, '[data-size-detector]').innerHTML = '';

  // Reset the label position.
  setStyleOfLabelUnfocused(field);

  // Reset the height of the text area.
  setHeightOfTextarea(field);
};

/**
 * Activate an observer that detects when the value of a field changes
 * programmatically and unfocuses the label.
 * @param {Element} field - the text field/area element
 */
export const unfocusLabelOnValueChange = (field) => {
  // Detects changes in the input value and unfocuses the label.
  const detectValueChange = (mutations) => {
    _.each(mutations, (mutation) => {
      if (mutation.attributeName === 'data-value') {
        // The value has changed; set the label style.
        setStyleOfLabelUnfocused(field);
      }
    });
  };

  /*
   * Activate an observer that listens for attribute changes in the field
   * element.
   */
  const onAttributeChange = new MutationObserver(detectValueChange);
  onAttributeChange.observe(field, {
    attributes: true
  });
};

/**
 * Set the validation state of an MD text input field.
 * @param {string} selector - a selector for the text field field element
 * @param {string} state - ('errored'|'valid') the state to be assigned to the
 *                        text field
 */
export const setStateOfTextField = (selector, state) => {
  if (!state) {
    throw new Meteor.Error('A state ("errored"|"valid") must be supplied.');
  }

  const field = dqS(selector);
  if (state === 'errored') {
    setLabelAndUnderlineErrored(field);
  } else if (state === 'valid') {
    setLabelAndUnderlineValid(field);
  } else {
    throw new Meteor.Error(
      'Invalid value for state; it must be "errored" or "valid".'
    );
  }
};

/**
 * Set an error on an MD text input field.
 * @param {string} selector - a selector for the text field field element
 * @param {string} errorText - the error text to be displayed
 * @param {boolean} [showHelperText] - if TRUE, helper text will not be hidden
 *                                     on error
 */
export const setErrorOnTextInputField = (
  selector, errorText, showHelperText) => {
  const field = dqS(selector);

  // Make the label and underline red.
  setLabelAndUnderlineErrored(field);

  // Set the error text for the field.
  eqS(field, '[data-text-input-error-text]').innerHTML = errorText;

  // Set the 'data-errored' attribute for the field.
  field.setAttribute('data-errored', 'true');

  // Hide the helper text, if there is any, and if hiding is required.
  const helperTextElement = eqS(field, '[data-text-input-helper-text]');
  if (helperTextElement && !showHelperText) {
    helperTextElement.setAttribute('style', 'display: none;');
  }
};

/**
 * Clear an error on an MD text input field. Optionally override the original
 * helper text message, e.g. Valid.
 * @param {string} selector - a selector for the text field field element
 * @param {string} [validMessage] - a validation message to be displayed in
 *                                  place of the original helper text
 */
export const clearErrorOnTextInputField = (selector, validMessage) => {
  const field = dqS(selector);

  // Reset the label and underline.
  setLabelAndUnderlineValid(field);

  // Clear the error text for the field.
  eqS(field, '[data-text-input-error-text]').innerHTML = '';

  // Remove the 'data-errored' attribute.
  field.removeAttribute('data-errored');

  // Unhide the helper text, if there is any.
  const helperTextElement = eqS(field, '[data-text-input-helper-text]');
  if (helperTextElement) {
    if (validMessage) {
      // Optionally override the helper text, with a validation message.
      helperTextElement.innerHTML = validMessage;
    }

    // Show the helper text.
    helperTextElement.removeAttribute('style');
  }
};

/**
 * Reset MD text fields, i.e. clear the input value, clear any error, and
 * restore any helper text for each field. This is a convenience function for
 * use in resetting forms.
 * @param {Array} fields - an array of selectors for the text fields
 */
export const resetTextFields = (fields) => {
  _.each(fields, (field) => {
    // Clear the field.
    clearValueOfTextField(field);

    // Clear any residual error.
    clearErrorOnTextInputField(field);
  });
};
