###
  @file Defines the API and event handler(s) for MD Ripple.
  @author Derek Gransaull <derek@dgtlife.com>
  @copyright DGTLife, LLC 2015

  Created on 10/13/2015
###

#/////////////////////    EXTEND MD API FOR MD RIPPLE    ///////////////////////
_.extend Material.prototype,

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

    # Set the width and height to be equal to 1.5 times the longer side of the
    # ripple target.
    if target.width >= target.height
      height = target.width * 1.5
      width = target.width * 1.5
    else
      height = target.height * 1.5
      width = target.height * 1.5

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

  ###*
  # Set the size and position of the ripple.
  #
  # @param {Object} ripple - the ripple element
  ###
  setRippleStyle: (ripple) ->
    "use strict"

    target = {}
    target.height = ripple.parentElement.offsetHeight
    target.width = ripple.parentElement.offsetWidth
    eventX = event.offsetX
    eventY = event.offsetY

    # The style for this ripple is not yet set.
    if ripple.parentElement.parentElement.hasAttribute('data-radio-button')
      # It's an MD radio button. Set the pre-determined size and position of
      # its ripple.
      rippleStyle = 'width: 3rem; height: 3rem; top: -1rem; left: -1rem;'
    else if ripple.parentElement.hasAttribute('data-fab')
      if ripple.parentElement.getAttribute('data-fab') is 'mini'
        # It's an MD mini FAB. Set a pre-determined size and position for its
        # ripple.
        rippleStyle = 'width: 2.5rem; height: 2.5rem; top: 0; left: 0;'
      else
        # It's an MD FAB. Set a pre-determined size and position for its ripple.
        rippleStyle = 'width: 3.5rem; height: 3.5rem; top: 0; left: 0;'
    else if ripple.parentElement.hasAttribute('data-icon-button')
      # It's an Icon Button. Set a pre-determined size and position for its ripple.
      rippleStyle = 'width: 3rem; height: 3rem; top: 0; left: 0;'
    else if ripple.hasAttribute('data-offset')
      # It's an element with an offset ripple. Compute the ripple style.
      rippleStyle = MD._computeRippleStyle 'offset', target, eventX, eventY
    else
      # It's an element with the default centered ripple. Compute the ripple
      # style.
      rippleStyle = MD._computeRippleStyle 'center', target

    ripple.setAttribute 'style', rippleStyle

#////////////////////    EVENT HANDLERS FOR MD RIPPLE    ///////////////////////
Template.md_ripple.events
  # Ripple on click or touch.
  'mousedown [data-ripple]': (event) ->
    "use strict"
    event.preventDefault()

    ripple = event.currentTarget
    # Don't ripple on a disabled element.
    if ripple.parentElement.hasAttribute('disabled') or
       ripple.parentElement.hasAttribute('data-disabled') or
       ripple.parentElement.parentElement.hasAttribute('data-disabled')
        false

    # Set the size and position of the ripple, if necessary.
    if not ripple.hasAttribute('style')
      MD.setRippleStyle ripple

    # Set up event listeners/handlers to remove the 'is-rippling' class 500ms
    # after the ripple has started.
    eventNames = ['animationstart', 'webkitAnimationStart', 'mozAnimationStart']
    _.each eventNames, (eventName) ->
      ripple.addEventListener eventName, (animationEvent) ->
        if animationEvent.animationName is 'ripple'
          Meteor.setTimeout ->
            ripple.classList.remove 'is-rippling'
          , 500

    # Add the class to trigger animation of the wave.
    ripple.classList.add 'is-rippling'

  # Ignore double clicks.
  'dblclick [data-ripple]': (event) ->
    "use strict"
    event.preventDefault()

    return false

#/////////////////////  ON-RENDER CALLBACK FOR MD RIPPLE  //////////////////////
Template.md_ripple.onRendered ->
  "use strict"

  # Initialize the ripple size and position.
  MD.setRippleStyle @firstNode
