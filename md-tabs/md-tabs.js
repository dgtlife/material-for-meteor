/**
 * @file Defines the API, and event handler for MD Tabs.
 * @author Derek Gransaull <derek@dgtlife.com>
 * @copyright DGTLife, LLC 2016
 *
 * Created on 6/27/2016
 */

// ToDo: Add scrolling tab bar capability.

//////////////////////    EXTEND MD API FOR MD RADIO    ////////////////////////
_.extend(Material.prototype, {
  /**
   * Initialize the display of an MD Tab group ('md-tabs' element) that has its
   * 'data-selected' attribute preset.
   * @param {string|object} tabGroupSpec - a selector for the tab group or the
   *                                       group element itself
   */
  initializeTabs(tabGroupSpec) {
    "use strict";
    const tabGroup = this._getElement(tabGroupSpec);
    const selectedIndex = tabGroup.getAttribute('data-selected');

    // Set the selected tab.
    this.setSelectedTab(tabGroup, selectedIndex);
  },

  /**
   * Handler for the click event on an MD Tab.
   *
   * @param {object} tab - the tab element
   */
  handleClickOnTab(tab) {
    "use strict";
    const tabGroup = tab.parentElement.parentElement;
    if (tab.hasAttribute('data-selected')) {
      // Nothing to do.
      return false;
    } else {
      // Set this tab as the selected tab in the group.
      const selectedIndex = tab.getAttribute('data-tab-index');
      this.setTabGroupSelection(tabGroup, selectedIndex);
    }
  },

  /**
   * Set the selected tab in a tab group. Show/hide the relevant tab panes. Wait
   * for tab panes to render in the onload/reload case.
   * @param {string|object} tabGroupSpec - a selector for the tab group or the
   *                                       tab group element itself
   * @param {string} selectedIndex - the index of the selected tab
   */
  setSelectedTab(tabGroupSpec, selectedIndex) {
    "use strict";
    if (!selectedIndex) {
      throw new Meteor.Error('A tab index must be supplied.');
    }

    const tabGroup = this._getElement(tabGroupSpec);
    const tabBar = this.eqS(tabGroup, '.md-tabs__tab-bar');
    const tabBarWidth = tabBar.offsetWidth;
    const indicator = this.eqS(tabGroup, '.md-tabs__indicator');
    const tabs = this.eqSA(tabGroup, '[data-tab]');
    const content = this.dqS('[data-content]');

    /*
     * Set the tab with the matching tabIndex as 'selected' and clear all others.
     * Show the corresponding tab pane, and hide all others.
     */
    const widths = _.map(tabs, (tab) => {
      const tabIndex = tab.getAttribute('data-tab-index');
      const tabName = tab.getAttribute('data-tab-name');
      const tabPaneSelector = '[data-tab-pane-name="' + tabName + '"]';
      let tabPane;

      // We visit each tab, so make the selection here (vs a separate each loop).
      if (tabIndex === selectedIndex) {
        // This is the selected tab. Ensure that it is set to 'selected'.
        if (!tab.hasAttribute('data-selected')) {
          tab.setAttribute('data-selected', 'true');
        }

        // Show the corresponding tab pane.
        if (this.dqS(tabPaneSelector)) {
          tabPane = this.dqS(tabPaneSelector);
          if (tabPane.classList.contains('hide')) {
            tabPane.classList.remove('hide');
          }
        } else {
          // Wait for this pane to render.
          this.waitForElement(content, tabPaneSelector, function (tabPane) {
            if (tabPane.classList.contains('hide')) {
              tabPane.classList.remove('hide');
            }
          }, 500);
        }
      } else {
        // This is not the selected tab. Ensure that it is not set to 'selected'.
        if (tab.hasAttribute('data-selected')) {
          tab.removeAttribute('data-selected');
        }

        // Hide the corresponding tab pane.
        if (this.dqS(tabPaneSelector)) {
          tabPane = this.dqS(tabPaneSelector);
          if (!tabPane.classList.contains('hide')) {
            tabPane.classList.add('hide');
          }
        } else {
          // Wait for this pane to render.
         this.waitForElement(content, tabPaneSelector, function (tabPane) {
            if (!tabPane.classList.contains('hide')) {
              tabPane.classList.add('hide');
            }
          }, 500);
        }
      }

      return tab.offsetWidth;
    });

    // Compute the left margin for the selection indicator.
    function marginLeft(__tabIndex) {
      let margin = 0;
      _.each(widths, function (width, index) {
        if (index < __tabIndex) {
          margin += width;
        }
      });

      return margin;
    }

    // Compute the right margin for the selection indicator.
    function marginRight(__tabIndex) {
      let margin = tabBarWidth;
      _.each(widths, function (width, index) {
        if (index <= __tabIndex) {
          margin -= width;
        }
      });

      return margin;
    }

    // Position the indicator by setting its style.
    indicator.setAttribute('style',
      'margin-left: ' + marginLeft(selectedIndex) + 'px;' +
      'margin-right: ' + marginRight(selectedIndex) + 'px;'
    );
  },

  /**
   * Set the selected tab (and show the corresponding pane).
   * @param {string|object} tabGroupSpec - a selector for the tab group or the
   *                                       tab group element itself
   * @param {string} selectedIndex - the index of the selected tab
   */
  setTabGroupSelection(tabGroupSpec, selectedIndex) {
    "use strict";
    const tabGroup = this._getElement(tabGroupSpec);

    // Set the selected value of the tab group.
    tabGroup.setAttribute('data-selected', selectedIndex);

    // Set the selected tab.
    this.setSelectedTab(tabGroup, selectedIndex);
  },

  /**
   * Get the index and label of the selected tab.
   * @param {string|object} tabGroupSpec - a selector for the tab group or the
   *                                       group element itself
   */
  getTabGroupSelection(tabGroupSpec) {
    "use strict";
    const tabGroup = this._getElement(tabGroupSpec);
    const selectedIndex = tabGroup.getAttribute('data-selected');
    const selectedTab =
            this.eqS(tabGroup, '[data-tab-index="' + selectedIndex + '"]');
    const selectedLabel = this.eqS(selectedTab, '.md-tab__label').innerHTML;
    return {
      index: selectedIndex,
      label: selectedLabel
    };
  }
});

////////////////////    ON-RENDER CALLBACK FOR MD TABS    //////////////////////
Template.md_tabs.onRendered(function () {
  "use strict";
  Meteor.setTimeout(() => {
    MD.initializeTabs(this.firstNode);
  }, 0);
});

///////////////////////  EVENT HANDLERS FOR MD TABS  ///////////////////////////
Template.md_tabs.events({
  'click .md-tab'(event) {
    "use strict";
    MD.handleClickOnTab(event.currentTarget);
  }
});

