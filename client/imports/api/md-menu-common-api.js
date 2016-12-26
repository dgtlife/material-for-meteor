/**
 * @file Contain API functions for MD Popup Menu and MD Dropdown Menu that would
 * otherwise be involved in circular imports.
 * @author Derek Gransaull <derek@dgtlife.com>
 * @copyright DGTLife, LLC 2016
 *
 * Created on 11/30/16
 */
import { dqS } from './md-utils.js';

/**
 * Close a popup menu.
 * @param {Element} menu - the menu element
 */
export const closePopupMenu = menu => menu.removeAttribute('data-menu-open');

/**
 * Close any open popup or dropdown menu.
 */
export const closeOpenMenus = () => {
  const openMenu = dqS('[data-menu-open]');
  if (openMenu) {
    openMenu.removeAttribute('data-menu-open');
  }
};
