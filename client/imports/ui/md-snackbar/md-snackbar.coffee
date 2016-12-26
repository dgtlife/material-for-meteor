###
  @file Defines the helper, the on-render callback, and event handler for the
        MD Snackbar.
  @author Derek Gransaull <derek@dgtlife.com>
  @copyright DGTLife, LLC 2015

  Created on 10/13/2015
###

{ Template } = require 'meteor/templating'
getCurrentSnackbarElement =
  require('../../api/md-snackbar-api.js').getCurrentSnackbarElement
displayCurrentSnackbar =
  require('../../api/md-snackbar-api.js').displayCurrentSnackbar
handleTouchmove = require('../../api/md-snackbar-api.js').handleTouchmove
require './md-snackbar.jade'

# Helper for MD Snackbar.
Template.md_snackbar.helpers
  currentSnackbar: ->
    getCurrentSnackbarElement()

# On-render callback for MD Snackbar.
Template._snackbar.onRendered ->
# Display the current snackbar (i.e. the one just rendered).
  displayCurrentSnackbar @data._id

# Event Handler for MD Snackbar.
Template._snackbar.events
  # A touchmove on the snackbar (as the user swipes).
  'touchmove [data-current-snackbar]': (event) ->
    event.preventDefault()
    handleTouchmove @_id, event
