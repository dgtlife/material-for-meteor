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
   * @param {string|Object} tabGroupSpec - a selector for the tab group or the
   *                                       group element itself
   */
  initializeTabs(tabGroupSpec) {
    "use strict";
    const tabGroup = this._getElement('tabs', tabGroupSpec);
    const tabId = tabGroup.getAttribute('data-selected');

    // Set the selected tab.
    this.setSelectedTab(tabGroup, tabId);
  },

  /**
   * Handler for the click event on an MD Tab.
   *
   * @param {Object} tab - the tab element
   * @returns {boolean} - returns false if the tab is already selected
   */
  handleClickOnTab(tab) {
    "use strict";
    const tabGroup = tab.parentElement.parentElement;
    if (tab.hasAttribute('data-selected')) {
      // Nothing to do.
      return false;
    } else {
      // Set this tab as the selected tab in the group.
      const tabId = tab.getAttribute('data-tab-id');
      this.setTabGroupSelection(tabGroup, tabId);
    }
  },

  /**
   * Set the selected tab in a tab group. Show/hide the relevant tab panes. Wait
   * for tab panes to render in the reload case.
   * @param {string|Object} tabGroupSpec - a selector for the tab group or the
   *                                       group element itself
   * @param {string} tabId - the id of the selected tab
   */
  setSelectedTab(tabGroupSpec, tabId) {
    "use strict";

    //console.log('setSelectedTab was called');
    if (! tabId) {
      throw new Meteor.Error('A tab id must be supplied.');
    }

    const toolbar = this.dqS('[data-toolbar]');
    const tabGroup = this._getElement('tabs', tabGroupSpec);
    const tabBar = this.eqS(tabGroup, '.md-tabs__tab-bar');
    const tabBarWidth = tabBar.offsetWidth;
    const indicator = this.eqS(tabGroup, '.md-tabs__indicator');
    const tabs = this.eqSA(tabGroup, '[data-tab-id]');
    const content = this.dqS('[data-content]');

    /*
     * Set the tab with the matching tabId as 'selected' and clear all others.
     * Show the corresponding tab pane, and hide all others.
     */
    const widths = _.map(tabs, (tab) => {
      const currentTabId = tab.getAttribute('data-tab-id');
      const tabPaneSelector = '[data-tab-pane-id="' + currentTabId + '"]';
      let tabPane;

      function waitForTabPane (selector, callback) {
        function _detectTabPane(mutations) {
          _.each(mutations, function (mutation) {
            if (mutation.addedNodes.length > 0) {
              if (mutation.addedNodes[0].nodeName === 'DIV') {
                if (MD.eqS(mutation.addedNodes[0], selector)) {
                  tabPane = MD.eqS(mutation.addedNodes[0], selector);
                  Meteor.setTimeout(function () {
                    callback(tabPane);
                  }, 500);
                  onContentChildren.disconnect();
                }
              }
            }
          });
        }

        const onContentChildren = new MutationObserver(_detectTabPane);
        onContentChildren.observe(content, {
          childList: true,
          subtree: true
        });
      }

      // We visit each tab, so make the selection here (vs a separate each loop).
      if (currentTabId === tabId) {
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
          waitForTabPane(tabPaneSelector, function (tabPane) {
            if (tabPane.classList.contains('hide')) {
              tabPane.classList.remove('hide');
            }
          });
        }
      } else {
        // This is not the selected tab. Ensure that it is not set to 'selected'.
        if (tab.hasAttribute('data-selected')) {
          tab.removeAttribute('data-selected');
        }

        // Hide the corresponding tab pane.
        if (this.dqS(tabPaneSelector)) {
          tabPane = this.dqS(tabPaneSelector);
          if (! tabPane.classList.contains('hide')) {
            tabPane.classList.add('hide');
          }
        } else {
          // Wait for this pane to render.
          waitForTabPane(tabPaneSelector, function (tabPane) {
            if (! tabPane.classList.contains('hide')) {
              tabPane.classList.add('hide');
            }
          });
        }
      }

      return tab.offsetWidth;
    });

    // Compute the left margin for the selection indicator.
    function marginLeft(__tabId) {
      let margin = 0;
      _.each(widths, function (width, index) {
        if (index < __tabId) {
          margin += width;
        }
      });

      return margin;
    }

    // Compute the right margin for the selection indicator.
    function marginRight(__tabId) {
      let margin = tabBarWidth;
      _.each(widths, function (width, index) {
        if (index <= __tabId) {
          margin -= width;
        }
      });

      return margin;
    }

    // Position the indicator by setting its style.
    indicator.setAttribute('style',
      'margin-left: ' + marginLeft(tabId) + 'px;' +
      'margin-right: ' + marginRight(tabId) + 'px;'
    );
  },

  /**
   * Set the selected tab (and show the corresponding pane).
   * @param tabGroupSpec
   * @param tabId
   */
  setTabGroupSelection(tabGroupSpec, tabId) {
    "use strict";
    const tabGroup = this._getElement('tabs', tabGroupSpec);

    // Set the selected value of the tab group.
    tabGroup.setAttribute('data-selected', tabId);

    // Set the selected tab.
    this.setSelectedTab(tabGroup, tabId);
  },

  /**
   * Get the (index of the) selected tab.
   * @param tabGroupSpec
   * @returns {string}
   */
  getTabGroupSelection(tabGroupSpec) {
    "use strict";
    const tabGroup = this._getElement('tabs', tabGroupSpec);
    const index = tabGroup.getAttribute('data-selected');
    const selectedTab = this.eqS(tabGroup, '[data-tab-id="' + index + '"]');
    const label = this.eqS(selectedTab, '.md-tab__label').innerHTML;
    return {
      index: index,
      label: label
    };
  }
});

////////////////////    ON-RENDER CALLBACK FOR MD TABS    //////////////////////
Template.md_tabs.onRendered(function () {
  "use strict";
  MD.initializeTabs(this.firstNode);
});

///////////////////////  EVENT HANDLERS FOR MD TABS  ///////////////////////////
Template.md_tabs.events({
  'click .md-tab'(event) {
    "use strict";
    MD.handleClickOnTab(event.currentTarget);
  }
});

