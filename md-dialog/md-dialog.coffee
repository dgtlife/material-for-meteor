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
  importDialogContent: (id) ->
    "use strict"

    dialogContainer = @eqS @dgEBI(id), '[data-dialog-container]'
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

  ###*
  # Compute and set the size and position of the dialog via its style attribute.
  #
  # @param {Object} dialog - the dialog element
  ###
  _setDialogSizeAndPosition: (dialog) ->
    "use strict"

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
                    'height: auto;' +
                    'width: ' + dialogWidth + 'px;'
      dialog.setAttribute 'style', dialogStyle
      dialogHeight = dialog.getBoundingClientRect().height
    # Do not exceed maximum height.
    if dialogHeight > (window.innerHeight - 48)
      dialogHeight = window.innerHeight - 48

    # Assign the vertical position.
    top = (window.innerHeight - dialogHeight) / 2

    # Set the final position of the dialog.
    dialogStyle = 'height: auto; ' +
                  'width: ' + dialogWidth + 'px; ' +
                  'top: ' + top + 'px; ' +
                  'left: ' + left + 'px;'
    dialog.setAttribute 'style', dialogStyle

  ###*
  # Get the dialog element from a dialogSpec value.
  #
  # @param {(string|Object)} dialogSpec - a selector for the dialog element or
  #                                       the dialog element itself
  # @private
  ###
  _getDialog: (dialogSpec) ->
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

    # Get the dialog element.
    dialog = @_getDialog dialogSpec

    # Unless it is closed, do nothing.
    return false unless not dialog.hasAttribute 'data-dialog-open'

    # Close any open dialog(s).
    @closeAnyOpenDialog()

    # Set the size and position of the dialog.
    @_setDialogSizeAndPosition dialog

    # Insert the backdrop.
    backdropType = 'default'
    if dialog.hasAttribute 'data-modal'
      backdropType = 'modal dialog'
    backdropOpacity = 0
    if dialog.hasAttribute 'data-backdrop-opacity'
      backdropOpacity = dialog.getAttribute 'data-backdrop-opacity'
    @_insertBackdrop backdropType, backdropOpacity

    # Add animation attribute and post-animation handler, if necessary.
    if dialog.hasAttribute 'data-opening-animation'
      dialog.setAttribute 'data-opening', 'true'
      # Define an event handler to remove the above attribute after the opening
      # animation has ended.
      eventNames = ['animationend', 'webkitAnimationEnd', 'mozAnimationEnd']
      __onAnimationEnd = (event) ->
        event.preventDefault()

        # Turn OFF the opening animation.
        dialog.removeAttribute 'data-opening'
        # Remove the event listeners.
        _.each eventNames, (eventName) ->
          dialog.removeEventListener eventName, __onAnimationEnd

      # Set up event listeners for the end of the opening animation.
      _.each eventNames, (eventName) ->
        dialog.addEventListener eventName, __onAnimationEnd
    else
      dialog.setAttribute 'data-no-opening-animation', 'true'

    # Show the dialog by setting the 'data-dialog-open' attribute (this is the
    # master switch that makes everything happen).
    dialog.setAttribute 'data-dialog-open', 'true'

    # If it's a scrollable dialog, initialize the scroller, then turn ON the
    # scroll monitor.
    scrollableElement = @eqS dialog, '.md-dialog__content-to-scroll'
    @runScroller(scrollableElement) unless not scrollableElement

    # Turn ON the size and position monitor.
    @_sizeAndPositionMonitor dialog, 'on'

    # Attach the auto-close listener.
    @_attachAutoCloseListener dialog

  ###*
  # Attach a listener to the backdrop to close the dialog when it is clicked.
  #
  # @param {Object} dialog - the dialog element
  ###
  _attachAutoCloseListener: (dialog) ->
    "use strict"

    # Define an event handler to close the dialog in the non-modal cases.
    __closeThisDialog = (event) ->
      event.preventDefault()

      MD.closeDialog dialog

    # Unless it's a modal, attach the 'click' listener.
    if not dialog.hasAttribute 'data-modal'
      backdrop = @dqS '[data-backdrop]'
      backdrop.onclick = __closeThisDialog

  ###*
  # Check whether a dialog is open.
  #
  # @param {(string|Object)} dialogSpec - a selector for the dialog element or
  #                                       the dialog element itself
  ###
  isDialogOpen: (dialogSpec) ->
    "use strict"

    dialog = @_getDialog dialogSpec
    dialog.hasAttribute 'data-dialog-open'

  ###*
  # Close a dialog.
  #
  # @param {(string|Object)} dialogSpec - a selector for the dialog element or
  #                                       the dialog element itself
  ###
  closeDialog: (dialogSpec) ->
    "use strict"

    dialog = @_getDialog dialogSpec
    # Unless it is open, do nothing.
    return false unless dialog.hasAttribute 'data-dialog-open'

    # OK, it's open; so we can actually close it.
    # Put all animation-independent closing tasks in a function, so that they
    # can be executed in either case.
    __closeDialog = ->
      # Remove the backdrop.
      MD._removeBackdrop()
      # Remove the 'open' attribute.
      dialog.removeAttribute 'data-dialog-open'
      # Remove the size and position styles.
      dialog.removeAttribute 'style'
      # Turn OFF the size and position monitor. [currently ignore by ]
      MD._sizeAndPositionMonitor dialog, 'off'
      # If it's a scrollable dialog turn OFF the scroll monitor.
      scrollableElement = MD.eqS dialog, '.md-dialog__content-to-scroll'
      MD.scrollMonitor(scrollableElement, 'off') unless not scrollableElement

    # Account for any animation.
    if dialog.hasAttribute 'data-closing-animation'
      # We are closing with animation.
      dialog.setAttribute 'data-closing', 'true'
      # Define an event handler to continue the closing process after the
      # animation has ended.
      eventNames = ['animationend', 'webkitAnimationEnd', 'mozAnimationEnd']
      __onAnimationEnd = ->
        # Turn OFF the closing animation.
        dialog.removeAttribute 'data-closing'
        # Execute the closing tasks.
        __closeDialog()
        # Remove the event listener.
        _.each eventNames, (eventName) ->
          dialog.removeEventListener eventName, __onAnimationEnd

      # Set up event listeners for the end of the closing animation.
      _.each eventNames, (eventName) ->
        dialog.addEventListener eventName, __onAnimationEnd
    else
      # There will be no animation. Just close.
      __closeDialog()

  ###*
  # Close any open dialog, regardless of how it may have remained open.
  ###
  closeAnyOpenDialog: ->
    "use strict"

    openDialog = @dqS '[data-dialog-open]'
    if openDialog
      openDialog.removeAttribute 'data-dialog-open'
      openDialog.removeAttribute 'style'
      @_removeBackdrop()
      @_sizeAndPositionMonitor openDialog, 'off'
    else false

  ###*
  # Check whether a dialog is closed.
  #
  # @param {(string|Object)} dialogSpec - a selector for the dialog element or
  #                                       the dialog element itself
  ###
  isDialogClosed: (dialogSpec) ->
    "use strict"

    dialog = @_getDialog dialogSpec
    not dialog.hasAttribute 'data-dialog-open'

  ###*
  # Maintain the relative size and positioning of the dialog as the screen size
  # changes.
  #
  # @param {Object} dialog - the dialog element
  # @param {string} state - the state (on|off) of the resize monitor
  ###
  _sizeAndPositionMonitor: (dialog, state) ->
    "use strict"

    resizeHandler = (event) ->
      event.preventDefault()

      dialogIsClosed = not dialog.hasAttribute 'data-dialog-open'
      MD._setDialogSizeAndPosition(dialog) unless dialogIsClosed

    if state is 'on'
      window.addEventListener 'resize', resizeHandler
    else
      # [Currently, this technique does not remove the listener]
      # ToDo: try some other method of listener removal.
      window.removeEventListener 'resize', resizeHandler

  ###*
  # Reposition/refit a dialog (on demand) after its width and or height have
  # been altered.
  #
  # @param {(string|Object)} dialogSpec - a selector for the dialog element or
  #                                       the dialog element itself
  ###
  refit__dialog: (dialogSpec) ->
    "use strict"

    dialog = @_getDialog dialogSpec
    @_setDialogSizeAndPosition dialog

  ###*
  # Open the full-screen dialog (mobile only).
  ###
  openDialogFs: ->
    "use strict"

    @dqS('[data-dialog-fs]').setAttribute 'data-dialog-open', true

  ###*
  # Open the full-screen dialog (mobile only).
  ###
  isDialogFsOpen: ->
    "use strict"

    dialogFs = @dqS('[data-dialog-fs]')
    dialogFs.hasAttribute 'data-dialog-open'

  ###*
  # Close the full-screen dialog (mobile only).
  ###
  closeDialogFs: ->
    "use strict"

    @dqS('[data-dialog-fs]').removeAttribute 'data-dialog-open'

#////////////////////  ON-RENDER CALLBACK FOR MD DIALOG  ///////////////////////
Template.md_dialog.onRendered ->
  "use strict"

  # Import the content for this dialog (if necessary)
  MD.importDialogContent @data.id

#///////////////////    EVENT HANDLERS FOR MD DIALOG FS    /////////////////////
Template.md_dialog_fs.events
  'click [data-dialog-close-button]': ->
    "use strict"

    MD.closeDialogFs()
