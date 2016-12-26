###
  @file API and on-render callback for the MD Dialog.
  @author Derek Gransaull <derek@dgtlife.com>
  @copyright DGTLife, LLC 2015

  Created on 11/6/2015
###
{ Template } = require 'meteor/templating'
importDialogContent = require('../../api/md-dialog-api.js').importDialogContent
closeDialogFs = require('../../api/md-dialog-api.js').closeDialogFs
require './md-dialog.jade'

# On render callback for MD Dialog.
Template.md_dialog.onRendered ->
  # Import the content for this dialog.
  importDialogContent @data.id

# Event handler for MD Dialog FS
Template.md_dialog_fs.events
  'click [data-dialog-close-button]': ->
    closeDialogFs()
