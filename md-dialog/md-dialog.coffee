###
  @file API and on-render callback for the MD Dialog.
  @author Derek Gransaull <derek@dgtlife.com>
  @copyright DGTLife, LLC 2015

  Created on 11/6/2015
###

#/////////////////////    EXTEND MD API FOR MD DIALOG    ///////////////////////
_.extend Material.prototype,

  ###*
  # Import the content for the identified dialog.
  #
  # @param {string} id - the id of the dialog
  # @private
  ###
  _importDialogContent: (id) ->
    "use strict";

    dialogContainer = @eqS @dqS('#' + id), '[data-dialog-container]'
    # Look for any node containing content for this dialog.
    tempContentContainer = @dqS('[data-content-for="' + id + '"]')
    if tempContentContainer
      contentNodes = @nodeListToArray tempContentContainer.childNodes
      _.each contentNodes, (contentNode) ->
        # Move each content node from its temporary container parent, into the
        # new dialog parent.
        dialogContainer.appendChild contentNode

      # Remove the temporary container.
      tempContentContainer.parentElement.removeChild tempContentContainer
    else
      false

  _initializeDialogPosition: (dialog) ->
    "use strict"

    console.log dialog
    console.log 'setting style'

    # Assign the dialog width. Use the specified width, if provided.
    if dialog.hasAttribute 'data-width'
      dialogWidth = dialog.getAttribute 'data-width'
      # Do not exceed maximum width.
      if dialogWidth > (window.innerWidth - 80)
        dialogWidth = window.innerWidth - 80
    else
      # Default width.
      dialogWidth = window.innerWidth - 80

    # Assign the horizontal position.
    left = (window.innerWidth - dialogWidth) / 2

    # Get/assign the dialog height.
    if dialog.hasAttribute 'data-height'
      dialogHeight = dialog.getAttribute 'data-height'
    else
      dialogStyle = 'opacity: 0; ' +
                    'display: block; ' +
                    'width: ' + dialogWidth + 'px;'
      dialog.setAttribute 'style', dialogStyle
      dialogHeight = dialog.getBoundingClientRect().height
    # Do not exceed maximum height.
    if dialogHeight > (window.innerHeight - 48)
      dialogHeight = window.innerHeight - 48

    # Assign the vertical position.
    top = (window.innerHeight - dialogHeight) / 2

    # Set the final position of the dialog.
    dialogStyle = 'height: ' + dialogHeight + 'px; ' +
                  'width: ' + dialogWidth + 'px; ' +
                  'top: ' + top + 'px; ' +
                  'left: ' + left + 'px;'

    console.log dialogStyle
    dialog.setAttribute 'style', dialogStyle

  ###*
  # Compute the value of the dialog element from a dialogSpec value.
  #
  # @param {(string|Object)} dialogSpec - a selector for the dialog element or
  #                                       the dialog element itself
  # @private
  ###
  _computeDialog: (dialogSpec) ->
    "use strict"

    if _.isString dialogSpec
      if @dqS(dialogSpec) is null
        throw new Meteor.Error 'An invalid selector for a dialog returned null.'
      else
        @dqS dialogSpec
    else if _.isObject dialogSpec
      dialogSpec
    else
      throw new Meteor.Error 'dialogSpec must be a dialog selector (string)' +
                             ' or a dialog element (Object).'

  ###*
  # Open a dialog.
  #
  # @param {(string|Object)} dialogSpec - a selector for the dialog element or
  #                                       the dialog element itself
  # @private
  ###
  openDialog: (dialogSpec) ->
    "use strict"

    # Close any open dialog(s).
    @closeAnyOpenDialog()

    # Get the dialog element.
    dialog = @_computeDialog dialogSpec

    # If it's a modal, insert the modal backdrop.
    if dialog.hasAttribute 'data-modal'
      @_insertBackdrop('modal')
    # If it's a non-modal with a backdrop, insert the default backdrop.
    if dialog.hasAttribute 'data-with-backdrop'
      @_insertBackdrop()

    # Size and position the dialog.
    @_initializeDialogPosition dialog

    # Show the dialog.
    dialog.setAttribute 'data-dialog-open', 'true'

    # Attach auto close click handler.
    MD._attachAutoCloseListener dialog

  _attachAutoCloseListener: (dialog) ->
    # Define and attach an event handler to close the dialog in the non-modal
    # cases.
    closeThisDialog = (event) ->
      "use strict"
      event.preventDefault()

      # In order to prevent clicks on this dialog from closing it, we need to
      # ensure that the dialog itself is not in the event propagation path. On
      # Chrome, we probe the event.path. On Safari we look at the immediate or
      # next level parent.
      if event.path
        # We are on Chrome.
        pathNodes = event.path
        clickedOnSameDialog =
          _.find pathNodes, (pathNode) ->
            pathNode is dialog
      else
        # We are on Safari (or Firefox?)
        if event.target
          if event.target.classList.contains 'md-dialog'
            clickedOnSameDialog = true
          else if event.target.classList.contains 'md-dialog__container'
            clickedOnSameDialog = true
          else if event.target.classList.contains 'md-dialog__title'
            clickedOnSameDialog = true
          else if event.target.classList.contains 'md-dialog__content'
            clickedOnSameDialog = true
          else if event.target.classList.contains 'md-dialog__actions'
            clickedOnSameDialog = true
          else
            clickedOnSameDialog = false
        else
          clickedOnSameDialog = false

      if clickedOnSameDialog
        # The click is on this dialog; do nothing.
        false
      else
        # Otherwise, we can close it, and remove the listener.
        MD.closeDialog dialog
        document.removeEventListener 'click', closeThisDialog

    # Unless it's a modal, wait a tad for the dialog to open before attaching
    # the listener.
    if not dialog.hasAttribute 'data-modal'
      Meteor.setTimeout ->
        document.addEventListener 'click', closeThisDialog
      , 10

  isDialogOpen: (dialogSpec) ->
    "use strict"

    dialog = @_computeDialog dialogSpec
    dialog.hasAttribute 'data-dialog-open'

  closeDialog: (dialogSpec) ->
    "use strict"

    dialog = @_computeDialog dialogSpec
    if dialog.hasAttribute 'data-dialog-open'
      # It's open; close it.
      dialog.removeAttribute 'data-dialog-open'
      dialog.removeAttribute 'style'
      @_removeBackdrop()
      document.body.click()
    else false

  closeAnyOpenDialog: ->
    "use strict"

    openDialog = @dqS '[data-dialog-open]'
    if openDialog
      openDialog.removeAttribute 'data-dialog-open'
      openDialog.removeAttribute 'style'
      @_removeBackdrop()
    else false

  isDialogClosed: (dialogSpec) ->
    "use strict"

    dialog = @_computeDialog dialogSpec
    not dialog.hasAttribute 'data-dialog-open'

  _insertBackdrop: (type) ->
    "use strict"

    # Create the backdrop element.
    backdrop = document.createElement 'div'
    backdrop.setAttribute 'data-backdrop', 'true'
    backdrop.classList.add 'md-backdrop'
    # If it's a modal dialog, set the modal backdrop class.
    if type is 'modal'
      backdrop.classList.add 'md-backdrop--modal'
    # Insert the backdrop into the DOM.
    document.body.appendChild backdrop
    # Display the backdrop.
    backdrop.setAttribute 'data-backdrop-open', 'true'

  _removeBackdrop: ->
    "use strict"

    backdrop = @dqS '[data-backdrop]'
    if backdrop
      backdrop.parentElement.removeChild backdrop
    else false

#////////////////////  ON-RENDER CALLBACK FOR MD DIALOG  ///////////////////////
Template.md_dialog.onRendered ->
  "use strict"

  # Import the content for this dialog (if necessary)
  MD._importDialogContent @data.id

  # Reset the position, when the window is resized.
  # window.addEventListener 'resize', ->
  #   MD._positionDialog @data.id
