/**
 * @file Defines the API for MD Toolbar
 * @author Derek Gransaull <derek@dgtlife.com>
 * @copyright DGTLife, LLC 2017
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
 * In a tab group, set the selected tab and show/hide the relevant tab panes.
 * Wait for tab panes to render in the app startup case.
 * @param {String|Element} tabGroupSpec - a selector for the tab group or the
 *                                        tab group element itself
 * @param {Number} selectedIndex - the (numerical) index of the selected tab
 * @param {Boolean} [untracked] - TRUE if 'currentTab' should not be updated (as
 *                                for resetTabGroup)
 */
const setSelectedTabAndPane = (tabGroupSpec, selectedIndex, untracked) => {
  if (_.isUndefined(selectedIndex)) {
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
    const tabIndex = parseInt(tab.getAttribute('data-tab-index'), 10);
    const tabName = tab.getAttribute('data-tab-name');
    const tabPaneSelector = `[data-tab-pane-name="${tabName}"]`;
    let tabPane;

    // Tests a mutation object for the existence of a tab pane.
    function tabPaneExists(mutation) {
      const nodes = mutation.addedNodes;
      return (
        (nodes.length > 0) &&
        (nodes[0].nodeName === 'DIV') &&
        nodes[0].classList.contains('__screen') &&
        !!(eqS(nodes[0], tabPaneSelector))
      );
    }

    // We visit each tab, so make the selection there.
    if (tabIndex === selectedIndex) {
      // This is the selected tab.
      tab.setAttribute('data-selected', 'true');

      /*
       * Update the current-tab reactive variable, if required
       */
      if (!untracked) {
        currentTab.set(tabGroupId, {
          name: tabName,
          index: tabIndex
        });
      }

      // Show the corresponding tab pane.
      if (dqS(tabPaneSelector)) {
        tabPane = dqS(tabPaneSelector);
        tabPane.classList.remove('hide');
      } else {
        // Wait for this pane to render.
        waitForElement(
          content,
          true,
          tabPaneSelector,
          tabPaneExists,
          pane => pane.classList.remove('hide'),
          1
        );
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
        waitForElement(
          content,
          true,
          tabPaneSelector,
          tabPaneExists,
          pane => pane.classList.add('hide'),
          1
        );
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
    _.each(
      widths,
      (width, index) => {
        if (index < _tabIndex) {
          margin += width;
        }
      }
    );

    return margin.toString();
  };

  // Position the indicator by setting its left margin and width.
  indicator.setAttribute('style',
    `margin-left: ${marginLeft(selectedIndex)}px; 
     width: ${widths[selectedIndex]}px;`
  );
};

/**
 * Set the selected tab (and show the corresponding pane).
 * @param {String|Element} tabGroupSpec - a selector for the tab group or the
 *                                        tab group element itself
 * @param {Number} selectedIndex - the index of the selected tab
 */
export const setTabGroupSelection = (tabGroupSpec, selectedIndex) => {
  const tabGroup = getElement(tabGroupSpec);

  // Set the selected value of the tab group.
  tabGroup.setAttribute('data-selected', selectedIndex.toString());

  // Set the selected tab (and pane).
  setSelectedTabAndPane(tabGroup, selectedIndex);
};

/**
 * Get the index and label of the selected tab.
 * @param {String|Element} tabGroupSpec - a selector for the tab group or the
 *                                        tab group element itself
 */
export const getTabGroupSelection = (tabGroupSpec) => {
  const tabGroup = getElement(tabGroupSpec);
  const selectedIndex = tabGroup.getAttribute('data-selected');
  const selectedTab = eqS(tabGroup, `[data-tab-index="${selectedIndex}"]`);
  const selectedLabel = eqS(selectedTab, '.md-tab__label').innerText;
  return {
    index: selectedIndex,
    label: selectedLabel
  };
};

/**
 * Reset the selected tab (and show the corresponding pane).
 * @param {String|Element} tabGroupSpec - a selector for the tab group or the
 *                                        tab group element itself
 */
export const resetTabGroup = (tabGroupSpec) => {
  const tabGroup = getElement(tabGroupSpec);

  // Set the selected value of the tab group back to 0;
  tabGroup.setAttribute('data-selected', '0');

  // Set the selected tab and pane to 0.
  setSelectedTabAndPane(tabGroup, 0, true);
};

/**
 * Initialize the state of an MD Tab group ('md-tabs' element) per its
 * 'data-selected' attribute value as preset in the rendered template.
 * @param {String|Element} tabGroupSpec - a selector for the tab group or the
 *                                        tab group element itself
 */
export const initializeTabGroup = (tabGroupSpec) => {
  const tabGroup = getElement(tabGroupSpec);

  // Read the selected value from the DOM.
  const selectedIndex = parseInt(tabGroup.getAttribute('data-selected'), 10);

  // Set the selected tab to match this value.
  setSelectedTabAndPane(tabGroup, selectedIndex);
};

/**
 * Restore an MD Tab group to its last/stored state as provided by currentTab.
 * @param {String} tabGroupId - the tab group id
 */
export const restoreTabGroup = (tabGroupId) => {
  if (currentTab.get(tabGroupId)) {
    // Set the selected tab to match this state.
    setTabGroupSelection(`#${tabGroupId}`, currentTab.get(tabGroupId).index);
  } else {
    // Reset the tab group.
    resetTabGroup(`#${tabGroupId}`);
  }
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
    const selectedIndex = parseInt(tab.getAttribute('data-tab-index'), 10);
    setTabGroupSelection(tabGroup, selectedIndex);
  }
};

