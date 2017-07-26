/**
 * @file API and on-render callback for the MD Dialog.
 * @author Derek Gransaull <derek@dgtlife.com>
 *   @copyright DGTLife, LLC 2017
 */
import { Template } from 'meteor/templating';
import { importDialogContent, closeDialogFs } from '../../api/md-dialog-api.js';
import './md-dialog.jade';

// On render callback for MD Dialog.
Template.md_dialog.onRendered(
  function onRenderedDialog() {
    // Import the content for this dialog.
    importDialogContent(this.data.id);
  }
);

// Event handler for MD Dialog FS
Template.md_dialog_fs.events({
  'click [data-dialog-close-button]'() {
    closeDialogFs();
  }
});
