/**
 * @file Defines the API for MD Toolbar
 * @author Derek Gransaull <derek@dgtlife.com>
 * @copyright DGTLife, LLC 2016
 *
 * Created on 11/22/16
 */
import { _ } from 'meteor/underscore';
import {
  dqS,
  eqS,
  eqSA,
  getElement,
  waitForElement
} from './md-utils.js';

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
  const tabBar = eqS(tabGroup, '.md-tabs__tab-bar');
  const tabBarWidth = tabBar.offsetWidth;
  const indicator = eqS(tabGroup, '.md-tabs__indicator');
  const tabs = eqSA(tabGroup, '[data-tab]');
  const content = dqS('[data-content]');

  /*
   * Set the tab with the matching tabIndex as 'selected' and clear all others.
   * Show the corresponding tab pane, and hide all others.
   */
  const widths = _.map(tabs, (tab) => {
    const tabIndex = tab.getAttribute('data-tab-index');
    const tabName = tab.getAttribute('data-tab-name');
    const tabPaneSelector = `[data-tab-pane-name="${tabName}"]`;
    let tabPane;

    // We visit each tab, so make the selection here (vs a separate each loop).
    if (tabIndex === selectedIndex) {
      // This is the selected tab. Ensure that it is set to 'selected'.
      tab.setAttribute('data-selected', 'true');

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
      // This is not the selected tab. Ensure that it is not set to 'selected'.
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

    return tab.offsetWidth;
  });

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

  // Compute the right margin for the selection indicator.
  const marginRight = (_tabIndex) => {
    let margin = tabBarWidth;
    _.each(widths, (width, index) => {
      if (index <= _tabIndex) {
        margin -= width;
      }
    });

    return margin;
  };

  // Position the indicator by setting its style.
  indicator.setAttribute('style',
    `margin-left: ${marginLeft(selectedIndex)}px; 
     margin-right: ${marginRight(selectedIndex)}px;`
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

// ToDo: Add scrolling tab bar capability.
