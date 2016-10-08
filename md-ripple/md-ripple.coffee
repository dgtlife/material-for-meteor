###
  @file Defines the API and event handler(s) for MD Ripple.
  @author Derek Gransaull <derek@dgtlife.com>
  @copyright DGTLife, LLC 2015

  Created on 10/13/2015
###

#/////////////////////    EXTEND MD API FOR MD RIPPLE    ///////////////////////
_.extend Material.prototype,

  ###*
  # Event handler for launching the ripple.
  #
  # @param {Object} ripple - the ripple element
  # @param {number} eventX - the x coordinate of the mouse/touch event relative
  #                          to the ripple target
  # @param {number} eventY - the y coordinate of the mouse/touch event relative
  #                          to the ripple target
  ###
  launchRipple: (ripple, eventX, eventY) ->
    "use strict"

    # Don't ripple on a disabled element.
    if ripple.parentElement.hasAttribute('disabled') or
       ripple.parentElement.hasAttribute('data-disabled') or
       ripple.parentElement.parentElement.hasAttribute('data-disabled')
        false

    # Set the size and position of the ripple, if necessary.
    if ripple.hasAttribute('data-offset') or (not ripple.hasAttribute 'style')
      MD.setRippleStyle ripple, eventX, eventY

    # Add the class to trigger animation of the wave.
    ripple.classList.add 'is-rippling'

    Meteor.setTimeout ->
      # Remove the class after 350ms
      ripple.classList.remove 'is-rippling'
      # If it's an offset ripple remove the style as it's a function of the
      # touch coordinates.
      if ripple.hasAttribute 'data-offset'
        ripple.removeAttribute 'style'
    , 350

  ###*
  # Set the size and position of the ripple.
  #
  # @param {Object} ripple - the ripple element
  # @param {number} [eventX] - the distance (in pixels) from the left edge of
  #                            the target rectangle to the event position
  # @param {number} [eventY] - the distance (in pixels) from the top edge of
  #                            the target rectangle to the event position
  ###
  setRippleStyle: (ripple, eventX, eventY) ->
    "use strict"

    target = {}
    target.height = ripple.parentElement.offsetHeight
    target.width = ripple.parentElement.offsetWidth
    # The style for this ripple is not yet set.
    if ripple and ripple.parentElement and
      ripple.parentElement.parentElement and
      ripple.parentElement.parentElement.hasAttribute('data-radio-button')
        # It's an MD Radio button. Set the pre-determined size and position of
        # its ripple.
        rippleStyle = 'width: 3rem; height: 3rem; top: -1rem; left: -1rem;'
    else if ripple and ripple.parentElement and
      ripple.parentElement.parentElement and
      ripple.parentElement.parentElement.hasAttribute('data-checkbox')
        # It's an MD Checkbox. Set the pre-determined size and position of its
        # ripple.
        rippleStyle = 'width: 3rem; height: 3rem; top: -0.75rem; left: -0.75rem;'
    else if ripple and ripple.parentElement and
      ripple.parentElement.hasAttribute('data-fab')
        if ripple.parentElement.getAttribute('data-fab') is 'mini'
          # It's an MD mini FAB. Set a pre-determined size and position for its
          # ripple.
          rippleStyle = 'width: 2.5rem; height: 2.5rem; top: 0; left: 0;'
        else
          # It's an MD FAB. Set a pre-determined size and position for its ripple.
          rippleStyle = 'width: 3.5rem; height: 3.5rem; top: 0; left: 0;'
    else if ripple and ripple.parentElement and
      ripple.parentElement.hasAttribute('data-icon-button')
        # It's an Icon Button. Set a pre-determined size and position for its ripple.
        rippleStyle = 'width: 3rem; height: 3rem; top: 0; left: 0;'
    else if ripple and ripple.hasAttribute('data-offset')
      # It's an element with an offset ripple. Compute the ripple style.
      rippleStyle = @_computeRippleStyle 'offset', target, eventX, eventY
    else
      # It's an element with the default centered ripple. Compute the ripple
      # style.
      rippleStyle = @_computeRippleStyle 'center', target

    ripple.setAttribute 'style', rippleStyle

  ###*
  # Compute the CSS styles for size and position of the ripple.
  #
  # @param {string} origin - 'center'|'offset', i.e. where should the ripple
  #                          originate from
  # @param {Object} target - the dimensions of the target, i.e. the element
  #                          that contains the ripple
  # @param {number} [eventX] - the distance (in pixels) from the left edge of
  #                            the target rectangle to the event position
  # @param {number} [eventY] - the distance (in pixels) from the top edge of
  #                            the target rectangle to the event position
  # @private
  ###
  _computeRippleStyle: (origin, target, eventX, eventY) ->
    "use strict"

    # Set the width and height to be equal to 2 times the longer side of the
    # ripple target.
    if target.width >= target.height
      height = target.width * 2
      width = target.width * 2
    else
      height = target.height * 2
      width = target.height * 2

    # Set the position.
    if origin is 'center'
      # Center the ripple on the ripple target.
      top = - ((height - target.height) / 2)
      left = - ((width - target.width) / 2)
    else
      # Center the ripple on the click/touch position.
      top = - ((height / 2) - eventY)
      left = - ((width / 2) - eventX)

    # Compose the ripple style.
    rippleStyle = 'width: ' + width + 'px; ' +
                  'height: ' + height + 'px; ' +
                  'top: ' + top + 'px; ' +
                  'left: ' + left + 'px;'
    return rippleStyle

#////////////////////    EVENT HANDLERS FOR MD RIPPLE    ///////////////////////
Template.md_ripple.events
  # Trigger the ripple with a mousedown in a mouse environment.
  'mousedown [data-ripple]': (event) ->
    "use strict"

    # Chrome on Android fires the touchstart, then the mousedown, whereas Safari
    # on iOS fires only the touchstart. So if the ripple has already been
    # launched, do nothing.
    if event.currentTarget.classList.contains 'is-rippling'
      return false

    # Launch the ripple.
    MD.launchRipple event.currentTarget, event.offsetX, event.offsetY

  # Trigger the ripple with a touchstart in a touch environment.
  'touchstart [data-ripple]': (event) ->
    "use strict"

    # The touch event object is quite different from the mouse event object. We
    # must compute the touch coordinates relative to the ripple target.
    ripple = event.currentTarget
    rippleRect = ripple.getBoundingClientRect()
    touch = event.originalEvent.touches[0]
    offsetX = touch.pageX - (window.pageXOffset + rippleRect.left)
    offsetY = touch.pageY - (window.pageYOffset + rippleRect.top)

    # Launch the ripple.
    MD.launchRipple ripple, offsetX, offsetY

  # Ignore double clicks.
  'dblclick [data-ripple]': (event) ->
    "use strict"
    event.preventDefault()

    return false

#/////////////////////  ON-RENDER CALLBACK FOR MD RIPPLE  //////////////////////
Template.md_ripple.onRendered ->
  "use strict"

  ripple = @firstNode
  # Pre-position the ripple, unless it is an offset ripple.
  Meteor.setTimeout ->
    if ripple
      MD.setRippleStyle(ripple) unless ripple.hasAttribute 'data-offset'
  , 0
