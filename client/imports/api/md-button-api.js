/**
 * @file Defines the API for MD Button
 * @author Derek Gransaull <derek@dgtlife.com>
 * @copyright DGTLife, LLC 2016
 *
 * Created on 11/29/16
 */
import { getElement } from './md-utils.js';

/**
 * Enable a button that is disabled, by removing the 'disabled' attribute.
 * @param {(string|Element)} buttonSpec - a selector for the button element or
 *                                        the button element itself
 */
export const enableButton = buttonSpec =>
  getElement(buttonSpec).removeAttribute('disabled');

/**
 * Disable a button that is enabled.
 * @param {(string|Element)} buttonSpec - a selector for the button element or
 *                                        the button element itself
 */
export const disableButton = buttonSpec =>
  getElement(buttonSpec).setAttribute('disabled', 'true');
