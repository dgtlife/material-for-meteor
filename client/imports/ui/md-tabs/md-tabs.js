/**
 * @file Defines the on-render callback and the event handler for MD Tabs.
 * @author Derek Gransaull <derek@dgtlife.com>
 * @copyright DGTLife, LLC 2016
 *
 * Created on 6/27/2016
 */
import { Template } from 'meteor/templating';
import {
  initializeTabs,
  handleClickOnTab
} from '../../api/md-tabs-api.js';
import './md-tabs.jade';

// On render callback for MD Tabs.
Template.md_tabs.onRendered(function onRenderedTabs() {
  initializeTabs(this.firstNode);
});

// Event handler for MD Tabs.
Template.md_tabs.events({
  'click .md-tab'(event) {
    handleClickOnTab(event.currentTarget);
  }
});
