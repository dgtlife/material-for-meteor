/**
 * @file Main module of this package on the client.
 * @author Derek Gransaull <derek@dgtlife.com>
 * @copyright DGTLife, LLC 2016
 *
 * Created on 11/17/16
 */
import { run } from './imports/api/md-run.js';
import { enableButton, disableButton } from './imports/api/md-button-api.js';
import { setStateOfCheckbox, getStateOfCheckbox } from './imports/api/md-checkbox-api.js';
import {
  openDialog,
  closeDialog,
  closeAnyOpenDialog,
  refitDialog,
  isDialogOpen,
  isDialogClosed,
  closeDialogFs,
  openDialogFs,
  isDialogFsOpen
} from './imports/api/md-dialog-api.js';
import {
  dockDrawer,
  undockDrawer,
  closeDrawer,
  openDrawer,
  toggleDrawer
} from './imports/api/md-drawer-api.js';
import {
  setValueOfDropdownMenu,
  getValueOfDropdownMenu,
  clearValueOfDropdownMenu
} from './imports/api/md-dropdown-menu-api.coffee';
import {
  resetHeaderPanelSystem,
  initializeHeaderPanelSystem
} from './imports/api/md-header-panel-api.js';

import {
  setValueOfMenu,
  getValueOfMenu,
  clearValueOfMenu
} from './imports/api/md-menu-api.js';
import {
  enableRadioButton,
  disableRadioButton,
  setValueOfRadioGroup,
  getValueOfRadioGroup,
  clearValueOfRadioGroup
} from './imports/api/md-radio-api.js';
import { postSnackbar } from './imports/api/md-snackbar-api.js';
import { setTabGroupSelection, getTabGroupSelection } from './imports/api/md-tabs-api.js';
import {
  getValueOfTextField,
  setValueOfTextField,
  clearValueOfTextField,
  disableTextField,
  enableTextField,
  getValueOfTextArea,
  setValueOfTextArea,
  clearValueOfTextArea
} from './imports/api/md-text-input-api.js';
import { detectTabs } from './imports/api/md-toolbar-api.js';
import {
  dgEBI,
  dqS,
  dqSA,
  eqS,
  eqSA,
  waitForElement,
  clearSelectedElements,
  handleClickOnSelectableElement,
  getSelectedElements
} from './imports/api/md-utils.js';
import './imports/ui/md-button/md-button.js';
import './imports/ui/md-card/md-card.jade';
import './imports/ui/md-checkbox/md-checkbox.js';
import './imports/ui/md-chip/md-chip.js';
import './imports/ui/md-collapse/md-collapse.coffee';
import './imports/ui/md-dialog/md-dialog.coffee';
import './imports/ui/md-drawer/md-drawer.coffee';
import './imports/ui/md-dropdown-menu/md-dropdown-menu.coffee';
import './imports/ui/md-header-panel/md-header-panel.js';
import './imports/ui/md-icon/md-icon.jade';
import './imports/ui/md-image/md-image.coffee';
import './imports/ui/md-item/md-item.jade';
import './imports/ui/md-menu/md-menu.js';
import './imports/ui/md-popup-menu/md-popup-menu.coffee';
import './imports/ui/md-radio/md-radio.js';
import './imports/ui/md-ripple/md-ripple.coffee';
import './imports/ui/md-snackbar/md-snackbar.coffee';
import './imports/ui/md-spinner/md-spinner.coffee';
import './imports/ui/md-tabs/md-tabs.js';
import './imports/ui/md-text-input/md-text-input.coffee';
import './imports/ui/md-toolbar/md-toolbar.js';
import './imports/ui/md-tooltip/md-tooltip.js';
import './imports/md-styles.styl';

// Export these functions to the client.
export {
  run,
  // MD Button
  enableButton,
  disableButton,
  // MD Checkbox
  setStateOfCheckbox,
  getStateOfCheckbox,
  // MD Dialog
  openDialog,
  closeDialog,
  closeAnyOpenDialog,
  refitDialog,
  isDialogOpen,
  isDialogClosed,
  openDialogFs,
  closeDialogFs,
  isDialogFsOpen,
  // MD Drawer
  dockDrawer,
  undockDrawer,
  openDrawer,
  closeDrawer,
  toggleDrawer,
  // MD Dropdown Menu
  setValueOfDropdownMenu,
  getValueOfDropdownMenu,
  clearValueOfDropdownMenu,
  // MD Header Panel
  resetHeaderPanelSystem,
  initializeHeaderPanelSystem,
  // MD Menu
  setValueOfMenu,
  getValueOfMenu,
  clearValueOfMenu,
  // MD Radio
  enableRadioButton,
  disableRadioButton,
  setValueOfRadioGroup,
  getValueOfRadioGroup,
  clearValueOfRadioGroup,
  // MD Snackbar
  postSnackbar,
  // MD Tabs
  setTabGroupSelection,
  getTabGroupSelection,
  // MD Text Input
  getValueOfTextField,
  setValueOfTextField,
  clearValueOfTextField,
  disableTextField,
  enableTextField,
  getValueOfTextArea,
  setValueOfTextArea,
  clearValueOfTextArea,
  // MD Toolbar
  detectTabs,
  // MD Utils
  dgEBI,
  dqS,
  dqSA,
  eqS,
  eqSA,
  waitForElement,
  clearSelectedElements,
  handleClickOnSelectableElement,
  getSelectedElements
};
