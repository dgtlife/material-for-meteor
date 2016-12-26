###
  @file Defines on-render callback and event handler(s) for MD Ripple.
  @author Derek Gransaull <derek@dgtlife.com>
  @copyright DGTLife, LLC 2015

  Created on 10/13/2015
###
{ Template } = require 'meteor/templating'
{ Meteor } = require 'meteor/meteor'
launchRipple = require('../../api/md-ripple-api.coffee').launchRipple
setRippleStyle = require('../../api/md-ripple-api.coffee').setRippleStyle
require './md-ripple.jade'

# On-render callback for MD Ripple.
Template.md_ripple.onRendered ->
  ripple = @firstNode
  setRippleStyle(ripple) unless ripple.hasAttribute 'data-offset'

# Event handlers for MD Ripple.
Template.md_ripple.events
  # Trigger the ripple with a 'mousedown' in a mouse environment.
  'mousedown [data-ripple]': (event) ->
    # Chrome on Android fires the 'touchstart', then the 'mousedown', whereas
    # Safari on iOS fires only the 'touchstart'. So if the ripple has already
    # been launched, do nothing.
    if event.currentTarget.classList.contains 'is-rippling'
      return false

    # Launch the ripple.
    launchRipple event.currentTarget, event.offsetX, event.offsetY

  # Trigger the ripple with a 'touchstart' in a touch environment.
  'touchstart [data-ripple]': (event) ->
    # The touch event object is quite different from the mouse event object. We
    # must compute the touch coordinates relative to the ripple target.
    ripple = event.currentTarget
    rippleRect = ripple.getBoundingClientRect()
    touch = event.originalEvent.touches[0]
    offsetX = touch.pageX - (window.pageXOffset + rippleRect.left)
    offsetY = touch.pageY - (window.pageYOffset + rippleRect.top)

    # Launch the ripple.
    launchRipple ripple, offsetX, offsetY

  # Ignore double clicks.
  'dblclick [data-ripple]': (event) ->
    event.preventDefault()
    return false
