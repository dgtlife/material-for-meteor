/**
 * @file Defines the on-render callback for MD Drawer
 * @author Derek Gransaull <derek@dgtlife.com>
 * @copyright DGTLife, LLC 2017
 */
import { Template } from 'meteor/templating';
import { dqS } from '../../api/md-utils.js';
import { initializeDrawer } from '../../api/md-drawer-api.js';
import './md-drawer.jade';

// On-render callback for MD Drawer.
Template.md_drawer.onRendered(
  function onRenderedDrawer() {
    // Ensure there is a header panel present.
    if (dqS('[data-header-panel]')) {
      // Initialize the drawer.
      initializeDrawer(this.data.position);
    } else {
      throw new Meteor.Error(
        'missing-component',
        'No header panel found. The drawer requires a header panel.'
      );
    }
  }
);
