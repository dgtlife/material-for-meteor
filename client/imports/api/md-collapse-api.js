/**
 * @file Defines the API for MD Collapse
 * @author Derek Gransaull <derek@dgtlife.com>
 * @copyright DGTLife, LLC 2016
 */
import { eqS, getElement } from './md-utils.js';

/**
 * Expand the content in an MD Collapse.
 * @param {(string|Element)} collapseSpec - a selector for the collapse element
 *                                          or the collapse element itself
 */
export const expandContent = (collapseSpec) => {
  const collapse = getElement(collapseSpec);
  const content = eqS(collapse, '[data-collapse-content]');
  const sizer = eqS(content, '[data-collapse-sizer]');
  const toggle = eqS(collapse, '[data-collapse-toggle]');

  content.classList.remove('collapsed');
  content.style.height = `${sizer.clientHeight}px`;
  toggle.classList.remove('collapsed');
};

/**
 * Collapse the content in an MD Collapse.
 * @param {(string|Element)} collapseSpec - a selector for the collapse element
 *                                          or the collapse element itself
 */
export const collapseContent = (collapseSpec) => {
  const collapse = getElement(collapseSpec);
  const content = eqS(collapse, '[data-collapse-content]');
  const toggle = eqS(collapse, '[data-collapse-toggle]');

  content.classList.add('collapsed');
  content.removeAttribute('style');
  toggle.classList.add('collapsed');
};

/**
 * Refit the expanded content of an MD Collapse when the screen is resized
 * @param {(string|Element)} collapseSpec - a selector for the collapse element
 *                                          or the collapse element itself
 */
export const refitContent = (collapseSpec) => {
  const collapse = getElement(collapseSpec);
  const content = eqS(collapse, '[data-collapse-content]');
  const sizer = eqS(content, '[data-collapse-sizer]');

  // Set the height of the expanded content.
  if (!content.classList.contains('collapsed')) {
    content.style.height = `${sizer.clientHeight}px`;
  }
};
