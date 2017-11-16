/**
 * @file Defines on-render callback for MD Dropdown Menu.
 * @author Derek Gransaull <derek@dgtlife.com>
 * @copyright DGTLife, LLC 2017
 */
import { Template } from 'meteor/templating';
import { eqS, platform } from '../../api/md-utils.js';
import './md-dropdown-menu.jade';

Template.md_dropdown_menu.onRendered(
  function onRenderedDropdownMenu() {
    const dropdownMenu = this.firstNode;

    /*
     * In Firefox, the dropdown arrow is not aligned with the right edge of the
     * dropdown menu element, as it is in Chrome and Safari. Since there is no
     * platform selectivity in CSS, this 'hack' allows us to support Firefox
     * (for whatever that's worth).
     */
    if (platform.isFirefoxOnDesktop) {
      eqS(dropdownMenu, '[data-icon]').classList.add('on-firefox');
    }
  }
);
