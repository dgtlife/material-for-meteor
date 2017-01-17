/**
 * @file Defines the API for MD Scrollable
 * @author Derek Gransaull <derek@dgtlife.com>
 * @copyright DGTLife, LLC 2017
 *
 * Created on 1/16/2017
 */

/**
 * Hide the Bottom Overflow Indicator of a scrollable element.
 * @param {Element} indicator - the indicator element
 */
export const hideBottomOverflowIndicator = indicator =>
  indicator.classList.add('at-bottom');

/**
 * Hide the Top Overflow Indicator of a scrollable element.
 * @param {Element} indicator - the indicator element
 */
export const hideTopOverflowIndicator = indicator =>
  indicator.classList.add('at-top');

/**
 * Show the Bottom Overflow Indicator of a scrollable element.
 * @param {Element} indicator - the indicator element
 */
export const showBottomOverflowIndicator = indicator =>
  indicator.classList.remove('at-bottom');

/**
 * Show the Top Overflow Indicator of a scrollable element.
 * @param {Element} indicator - the indicator element
 */
export const showTopOverflowIndicator = indicator =>
  indicator.classList.remove('at-top');

