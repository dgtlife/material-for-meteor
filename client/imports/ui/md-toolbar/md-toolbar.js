/**
 * @file Defines the on-render callback for MD Toolbar
 * @author Derek Gransaull <derek@dgtlife.com>
 * @copyright DGTLife, LLC 2015
 *
 * Created on 12/1/2015
 */
import { Template } from 'meteor/templating';
import { importToolbarContent } from '../../api/md-toolbar-api.js';
import './md-toolbar.jade';

// On render callback for MD Toolbar.
Template.md_toolbar.onRendered(function onRenderedToolbar() {
  if ((!this.data.use_bar_templates) && (!this.data.content)) {
    // Import the content for this toolbar
    importToolbarContent(this.data.id);
  }

  // ToDo: Determine whether detectTabs can/should be called here.
});

