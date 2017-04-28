/**
 * @file Defines the API for MD Toolbar
 * @author Derek Gransaull <derek@dgtlife.com>
 * @copyright DGTLife, LLC 2016
 */
import { _ } from 'meteor/underscore';
import {
  dqS,
  eqS,
  eqSA,
  getElement,
  waitForElement
} from './md-utils.js';

// Stores (reactively) the current tab of each rendered tab group.
export const currentTab = new ReactiveDict;

/**
 * Set the selected tab in a tab group. Show/hide the relevant tab panes. Wait
 * for tab panes to render in the onload/reload case.
 * @param {string|Element} tabGroupSpec - a selector for the tab group or the
 *                                        tab group element itself
 * @param {string} selectedIndex - the index of the selected tab
 */
const setSelectedTab = (tabGroupSpec, selectedIndex) => {
  if (!selectedIndex) {
    throw new Meteor.Error('A tab index must be supplied.');
  }

  const tabGroup = getElement(tabGroupSpec);
  const tabGroupId = tabGroup.id;
  const indicator = eqS(tabGroup, '.md-tabs__indicator');
  const tabs = eqSA(tabGroup, '[data-tab]');
  const content = dqS('[data-content]');

  /*
   * Generate an array of tab widths. In the same loop, set the tab with the
   * matching tabIndex as 'selected' and clear all others. Show the
   * corresponding tab pane, and hide all others.
   */
  const widths = _.map(tabs, (tab) => {
    const tabIndex = tab.getAttribute('data-tab-index');
    const tabName = tab.getAttribute('data-tab-name');
    const tabPaneSelector = `[data-tab-pane-name="${tabName}"]`;
    let tabPane;

    // We visit each tab, so make the selection there.
    if (tabIndex === selectedIndex) {
      // This is the selected tab.
      tab.setAttribute('data-selected', 'true');

      // Update the current-tab reactive variable.
      currentTab.set(tabGroupId, tabName);

      // Show the corresponding tab pane.
      if (dqS(tabPaneSelector)) {
        tabPane = dqS(tabPaneSelector);
        tabPane.classList.remove('hide');
      } else {
        // Wait for this pane to render.
        waitForElement(content, tabPaneSelector, (pane) => {
          pane.classList.remove('hide');
        }, 500);
      }
    } else {
      // This is not the selected tab.
      tab.removeAttribute('data-selected');

      // Hide the corresponding tab pane.
      if (dqS(tabPaneSelector)) {
        tabPane = dqS(tabPaneSelector);
        tabPane.classList.add('hide');
      } else {
        // Wait for this pane to render.
        waitForElement(content, tabPaneSelector, (pane) => {
          pane.classList.add('hide');
        }, 500);
      }
    }

    // Return the tab width.
    return tab.offsetWidth;
  });

  /* The selection indicator will be sized based on the selected index and will
   * be positioned from the left edge of the tab bar to allow for any dynamic
   * page width changes during loading.
   */

  // Compute the left margin for the selection indicator.
  const marginLeft = (_tabIndex) => {
    let margin = 0;
    _.each(widths, (width, index) => {
      if (index < _tabIndex) {
        margin += width;
      }
    });

    return margin;
  };

  // Position the indicator by setting its left margin and width.
  indicator.setAttribute('style',
    `margin-left: ${marginLeft(selectedIndex)}px; 
     width: ${widths[selectedIndex]}px;`
  );
};

/**
 * Set the selected tab (and show the corresponding pane).
 * @param {string|Element} tabGroupSpec - a selector for the tab group or the
 *                                        tab group element itself
 * @param {string} selectedIndex - the index of the selected tab
 */
export const setTabGroupSelection = (tabGroupSpec, selectedIndex) => {
  const tabGroup = getElement(tabGroupSpec);

  // Set the selected value of the tab group.
  tabGroup.setAttribute('data-selected', selectedIndex);

  // Set the selected tab.
  setSelectedTab(tabGroup, selectedIndex);
};

/**
 * Get the index and label of the selected tab.
 * @param {string|Element} tabGroupSpec - a selector for the tab group or the
 *                                        tab group element itself
 */
export const getTabGroupSelection = (tabGroupSpec) => {
  const tabGroup = getElement(tabGroupSpec);
  const selectedIndex = tabGroup.getAttribute('data-selected');
  const selectedTab = eqS(tabGroup, `[data-tab-index="${selectedIndex}"]`);
  const selectedLabel = eqS(selectedTab, '.md-tab__label').innerHTML;
  return {
    index: selectedIndex,
    label: selectedLabel
  };
};

/**
 * Initialize the display of an MD Tab group ('md-tabs' element) that has its
 * 'data-selected' attribute preset.
 * @param {string|Element} tabGroupSpec - a selector for the tab group or the
 *                                        tab group element itself
 */
export const initializeTabs = (tabGroupSpec) => {
  const tabGroup = getElement(tabGroupSpec);
  const selectedIndex = tabGroup.getAttribute('data-selected');

  // Set the selected tab.
  setSelectedTab(tabGroup, selectedIndex);
};

/**
 * Handler for the click event on an MD Tab.
 * @param {Element} tab - the tab element
 */
export const handleClickOnTab = (tab) => {
  const tabGroup = tab.parentElement.parentElement;
  if (tab.hasAttribute('data-selected')) {
    // Do nothing.
  } else {
    // Set this tab as the selected tab in the group.
    const selectedIndex = tab.getAttribute('data-tab-index');
    setTabGroupSelection(tabGroup, selectedIndex);
  }
};

