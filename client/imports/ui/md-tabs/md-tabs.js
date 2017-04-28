/**
 * @file Defines the on-render callback and the event handler for MD Tabs.
 * @author Derek Gransaull <derek@dgtlife.com>
 * @copyright DGTLife, LLC 2016
 */
import { Template } from 'meteor/templating';
import {
  currentTab,
  initializeTabs,
  handleClickOnTab
} from '../../api/md-tabs-api.js';
import './md-tabs.jade';

// On-render callback for MD Tabs.
Template.md_tabs.onRendered(function onRenderedTabs() {
  // Initialize the current-tab variable for this tab group.
  currentTab.set(this.id, '');

  // Initialize the tab group.
  initializeTabs(this.firstNode);
});

// Event handler for MD Tabs.
Template.md_tabs.events({
  'click .md-tab'(event) {
    handleClickOnTab(event.currentTarget);
  }
});

// On-destroyed callback for MD Tabs.
Template.md_tabs.onDestroyed(function onDestroyedTabs() {
  // Clear the current-tab variable for this tab group.
  delete currentTab.keys[this.id];
});
