/**
 * @file Defines the API for MD Checkbox
 * @author Derek Gransaull <derek@dgtlife.com>
 * @copyright DGTLife, LLC 2016
 *
 * Created on 11/29/16
 */
import { Meteor } from 'meteor/meteor';
import { eqS, getElement } from './md-utils.js';

/**
 * Set the state of an MD Checkbox.
 * @param {(string|Element)} checkboxSpec - a selector for the Checkbox element
 *                                          or the Checkbox element itself
 * @param {boolean} state - (true|false)
 */
export const setStateOfCheckbox = (checkboxSpec, state) => {
  const checkbox = getElement(checkboxSpec);
  if (checkbox) {
    if (state === true) {
      checkbox.setAttribute('data-checked', 'true');
      eqS(checkbox, '.md-checkbox__input').setAttribute('checked', 'true');
      eqS(checkbox, '.md-checkbox__box--checked').classList.remove('md-hide');
      eqS(checkbox, '.md-checkbox__box--unchecked').classList.add('md-hide');
    } else {
      checkbox.removeAttribute('data-checked');
      eqS(checkbox, '.md-checkbox__input').removeAttribute('checked');
      eqS(checkbox, '.md-checkbox__box--checked').classList.add('md-hide');
      eqS(checkbox, '.md-checkbox__box--unchecked').classList.remove('md-hide');
    }

    return true;
  }

  throw new Meteor.Error('The specified Checkbox does not exist.');
};

/**
 * Get the state of an MD Checkbox.
 * @param {(string|Element)} checkboxSpec - a selector for the Checkbox element
 *                                          or the Checkbox element itself
 */
export const getStateOfCheckbox = (checkboxSpec) => {
  const checkbox = getElement(checkboxSpec);
  if (checkbox) {
    return checkbox.hasAttribute('data-checked');
  }

  throw new Meteor.Error('The specified Checkbox does not exist.');
};
