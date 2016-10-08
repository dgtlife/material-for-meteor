###
  @file Defines the API, event handlers, and on-render callback for the MD Snackbar.
  @author Derek Gransaull <derek@dgtlife.com>
  @copyright DGTLife, LLC 2015

  Created on 10/13/2015
###

#////////////////////    EXTEND MD API FOR MD SNACKBAR    //////////////////////
_.extend Material.prototype,

  ###*
  # Post a snackbar.
  #
  # @param {Object} snackbar - the snackbar to be posted
  ###
  postSnackbar: (snackbar) ->
    "use strict"

    check snackbar, Object

    # Add a unique _id, if necessary, to allow selection in the DOM.
    if (not snackbar.id) and (not snackbar._id)
      snackbar._id = Random._randomString 3, '123456abcdefg'
    if snackbar.id
      snackbar._id = snackbar.id
      snackbar = _.omit snackbar, 'id'
    # Push the snackbar object into the snackbars array
    @_snackbars.push snackbar
    # Update the 'snackbarCount' reactive variable.
    @reactive.set 'snackbarCount', @_snackbars.length

  ###*
  # Get the current snackbar from the snackbars array.
  #
  # @returns {Array|null} - an array of one snackbar object
  ###
  getCurrentSnackbarElement: ->
    "use strict"

    snackbarCount = @reactive.get 'snackbarCount'
    if snackbarCount is 0
      null
    else
      [@_snackbars[0]]

  ###*
  # Display the snackbar.
  #
  # @param {string} _id - the _id of the current snackbar object
  ###
  displayCurrentSnackbar: (_id) ->
    "use strict"

    # Get the current snackbar.
    currentSnackbar = @dgEBI('snackbar-' + _id)
    # If this is a multi-line snackbar on a narrow screen, increase the vertical
    # padding of the snackbar message to 24px (per the MD spec).
    snackbarMessage = @eqS currentSnackbar, '[data-snackbar-message]'
    if (window.innerWidth < 600) and (snackbarMessage.clientHeight > 48)
      snackbarMessage.classList.add 'multi-line'
    # Set the initial position of the snackbar assembly below the viewport.
    snackbarHeight = currentSnackbar.clientHeight
    snackbar = currentSnackbar.parentElement.parentElement
    snackbar.setAttribute 'style', 'bottom: -' + snackbarHeight + 'px;'

    # Animate the snackbar upwards into the viewport.
    upSpec = - snackbarHeight
    snackbar.style.transform = 'translateY(' + upSpec + 'px)'
    # Let the snackbar stay in the 'up' position for 3 sec, then lower it.
    downSpec = snackbarHeight
    Meteor.setTimeout ->
      if MD.dgEBI('snackbar-' + _id)
        # The current snackbar was not cleared by a swipe, so animate the
        # snackbar down.
        snackbar.style.transform = 'translateY(' + downSpec + 'px)'
        Meteor.setTimeout ->
          # Clear the current snackbar.
          MD._clearDisplayedSnackbar _id
        , 300
    , 3300

    # Check whether any other elements need to move along with the snackbar on a
    # narrow screen.
    if (window.innerWidth < 600) and (@config.elementsToMove.length > 0)
      elementsToMove = @config.elementsToMove
      _.each elementsToMove, (elementId) ->
        element = MD.dgEBI elementId
        # Animate the element upwards the same distance as the snackbar.
        element.style.transition = 'transform 0.3s'
        element.style.transform = 'translateY(' + upSpec + 'px)'
        # Let the element remain in this position for 3 sec.
        Meteor.setTimeout ->
          # Animate the element down with the snackbar. For some reason, the
          # element appears to be included in the downward translation of the
          # snackbar, and does not need to be directly translated down itself.
          element.style.transform = 'translateY(0)'
          # For some reason, removal of the style is not necessary.
        , 3300

  ###*
  # Clear the snackbar that was just displayed from the snackbars array.
  #
  # @param {string} _id - the _id of the current snackbar object
  # @private
  ###
  _clearDisplayedSnackbar: (_id) ->
    "use strict"

    # Remove the current snackbar element from the DOM, if it's still there.
    currentSnackbar = @dgEBI 'snackbar-' + _id
    if currentSnackbar
      currentSnackbar.parentElement.removeChild currentSnackbar
      # Remove the snackbar style, in the event that it was swiped.
      if @dqS('[data-snackbar]').hasAttribute 'style'
        @dqS('[data-snackbar]').removeAttribute 'style'
      # Remove the current snackbar object from the top of the array.
      @_snackbars.shift()
      # Update the 'snackbarCount' reactive variable.
      @reactive.set 'snackbarCount', @_snackbars.length
    else false

  ###*
  # Handle the touchmove event on the snackbar and determine the swipe direction.
  #
  # @param {string} _id - the _id of the current snackbar object
  # @param {Object} event - the event object
  ###
  handleTouchmove: (_id, event) ->
    "use strict"

    currentSnackbar = event.currentTarget
    snackbar = currentSnackbar.parentElement.parentElement
    startTouch = event.originalEvent.touches[0]
    startX = startTouch.pageX
    # Define an event handler for the 'touchend' event.
    __handleSwipe = (eventEnd) ->
      eventEnd.stopImmediatePropagation()

      endTouch = eventEnd.changedTouches[0]
      endX = endTouch.pageX
      if endX > startX
        MD.dismissSnackbarToRight _id, snackbar
      else if endX < startX
        MD.dismissSnackbarToLeft _id, snackbar
      else
        # Just clear the current snackbar.
        MD._clearDisplayedSnackbar _id

    # Add an event listener to listen for the 'touchend' event.
    currentSnackbar.addEventListener 'touchend', __handleSwipe

  ###*
  # Dismiss the snackbar to the right with a transition delay.
  #
  # @param {string} _id - the _id of the current snackbar object
  # @param {Object} snackbar - the MD Snackbar element
  ###
  dismissSnackbarToRight: (_id, snackbar) ->
    "use strict"

    # Set a style that moves the snackbar off-screen to the right.
    snackbar.style.transform += 'translateX(' + (window.innerWidth + 24) + 'px)'
    Meteor.setTimeout ->
      # Clear the current snackbar.
      MD._clearDisplayedSnackbar _id
    , 350

  ###*
  # Dismiss the snackbar to the left with a transition delay.
  #
  # @param {string} _id - the _id of the current snackbar object
  # @param {Object} snackbar - the MD Snackbar element
  ###
  dismissSnackbarToLeft: (_id, snackbar) ->
    "use strict"

    # Set a style that moves the snackbar off-screen to the left.
    snackbar.style.transform += 'translateX(-' + (window.innerWidth + 24) + 'px)'
    Meteor.setTimeout ->
      # Clear the current snackbar.
      MD._clearDisplayedSnackbar _id
    , 350

#//////////////////////    HELPERS FOR MD SNACKBAR    //////////////////////////
Template.md_snackbar.helpers
  currentSnackbar: ->
    "use strict"

    MD.getCurrentSnackbarElement()

#//////////////////    EVENT HANDLERS FOR MD SNACKBAR    ///////////////////////
Template._snackbar.events
  # A touchmove on the snackbar (as the user swipes).
  'touchmove [data-current-snackbar]': (event) ->
    "use strict"
    event.preventDefault()

    MD.handleTouchmove @_id, event

#//////////////////    ON-RENDER CALLBACK FOR MD SNACKBAR    ///////////////////
Template._snackbar.onRendered ->
  "use strict"

  # Display the current snackbar (i.e. the one just rendered).
  MD.displayCurrentSnackbar @data._id
