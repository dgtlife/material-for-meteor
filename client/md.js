/**
 * @file Main module of this package on the client.
 * @author Derek Gransaull <derek@dgtlife.com>
 * @copyright DGTLife, LLC 2016
 */
import { run } from './imports/api/md-run.js';
import { enableButton, disableButton } from './imports/api/md-button-api.js';
import {
  collapseContent,
  expandContent
} from './imports/api/md-collapse-api.js';
import {
  setStateOfCheckbox,
  getStateOfCheckbox
} from './imports/api/md-checkbox-api.js';
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
  toggleDrawer,
  initializeLeftDrawerToggle,
  initializeRightDrawerToggle,
  initializeDrawerToggles
} from './imports/api/md-drawer-api.js';
import {
  setValueOfDropdownMenu,
  getValueOfDropdownMenu,
  clearValueOfDropdownMenu
} from './imports/api/md-dropdown-menu-api.js';
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
import {
  menuMode,
  clearQuery,
  showExitButton,
  exitSearch,
  enableSearchBox,
  disableSearchBox
} from './imports/api/md-search-box-api.js';
import { postSnackbar } from './imports/api/md-snackbar-api.js';
import makeDots from './imports/api/md-stepdots-api.js';
import {
  currentTab,
  initializeTabGroup,
  setTabGroupSelection,
  getTabGroupSelection,
  resetTabGroup,
  restoreTabGroup
} from './imports/api/md-tabs-api.js';
import {
  getValueOfTextField,
  setValueOfTextField,
  clearValueOfTextField,
  disableTextField,
  enableTextField,
  getValueOfTextArea,
  setValueOfTextArea,
  clearValueOfTextArea,
  setErrorOnTextInputField,
  clearErrorOnTextInputField
} from './imports/api/md-text-input-api.js';
import { detectTabs } from './imports/api/md-toolbar-api.js';
import { dismissTooltip } from './imports/api/md-tooltip-api.js';
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
import './imports/ui/md-collapse/md-collapse.js';
import './imports/ui/md-dialog/md-dialog.js';
import './imports/ui/md-drawer/md-drawer.js';
import './imports/ui/md-dropdown-menu/md-dropdown-menu.js';
import './imports/ui/md-header-panel/md-header-panel.js';
import './imports/ui/md-icon/md-icon.jade';
import './imports/ui/md-image/md-image.coffee';
import './imports/ui/md-item/md-item.jade';
import './imports/ui/md-menu/md-menu.js';
import './imports/ui/md-popup-menu/md-popup-menu.coffee';
import './imports/ui/md-radio/md-radio.js';
import './imports/ui/md-ripple/md-ripple.coffee';
import './imports/ui/md-scrollable/md-scrollable.js';
import './imports/ui/md-search-box/md-search-box.js';
import './imports/ui/md-snackbar/md-snackbar.coffee';
import './imports/ui/md-spinner/md-spinner.coffee';
import './imports/ui/md-stepdots/md-stepdots.jade';
import './imports/ui/md-tabs/md-tabs.js';
import './imports/ui/md-text-input/md-text-input.coffee';
import './imports/ui/md-toolbar/md-toolbar.js';
import './imports/ui/md-tooltip/md-tooltip.js';
import './imports/md-styles.styl';

// Export these functions. This is the API on the client.
export {
  run,
  // MD Button
  enableButton,
  disableButton,
  // MD Collapse
  collapseContent,
  expandContent,
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
  initializeLeftDrawerToggle,
  initializeRightDrawerToggle,
  initializeDrawerToggles,
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
  // MD Search Box
  menuMode,
  clearQuery,
  showExitButton,
  exitSearch,
  enableSearchBox,
  disableSearchBox,
  // MD Snackbar
  postSnackbar,
  // MD Stepdots
  makeDots,
  // MD Tabs
  currentTab,
  initializeTabGroup,
  setTabGroupSelection,
  getTabGroupSelection,
  resetTabGroup,
  restoreTabGroup,
  // MD Text Input
  getValueOfTextField,
  setValueOfTextField,
  clearValueOfTextField,
  disableTextField,
  enableTextField,
  getValueOfTextArea,
  setValueOfTextArea,
  clearValueOfTextArea,
  setErrorOnTextInputField,
  clearErrorOnTextInputField,
  // MD Toolbar
  detectTabs,
  // MD Tooltip
  dismissTooltip,
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
