/**
 * @file Defines the on-render callback and the event handler for MD Tabs.
 * @author Derek Gransaull <derek@dgtlife.com>
 * @copyright DGTLife, LLC 2017
 */
import { Template } from 'meteor/templating';
import {
  currentTab,
  initializeTabGroup,
  handleClickOnTab
} from '../../api/md-tabs-api.js';
import './md-tabs.jade';

// On-render callback for MD Tabs.
Template.md_tabs.onRendered(
  function onRenderedTabs() {
    /*
     * Initialize the tab group based on its template configuration, if it has
     * not already been initialized (e.g. by restoreTabs)
     */
    if (!currentTab.get(this.data.id)) {
      initializeTabGroup(this.firstNode);
    }
  }
);

// Event handler for MD Tabs.
Template.md_tabs.events({
  'click .md-tab'(event) {
    handleClickOnTab(event.currentTarget);
  }
});
