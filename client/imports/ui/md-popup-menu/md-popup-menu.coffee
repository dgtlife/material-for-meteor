###
  @file Defines the on-render callback and event handlers, for the MD Popup Menu.
  @author Derek Gransaull <derek@dgtlife.com>
  @copyright DGTLife, LLC 2015

  Created on 10/13/2015
###

{ Template } = require 'meteor/templating'
{ Meteor } = require 'meteor/meteor'
eqS = require('../../api/md-utils.js').eqS
importMenuItems = require('../../api/md-menu-api.js').importMenuItems
handleClickOnMenuTrigger =
  require('../../api/md-popup-menu-api.js').handleClickOnMenuTrigger
closePopupMenu = require('../../api/md-menu-common-api.js').closePopupMenu
require './md-popup-menu.jade'

# On-render callback for MD Popup Menu
Template.md_popup_menu.onRendered ->
  # Import any menu items for this menu.
  importMenuItems @data.menu_id

# Event handlers for MD Popup Menu
Template.md_popup_menu.events
  # Click a button that triggers a popup/dropdown menu.
  'click [data-popup-trigger], click [data-dropdown-trigger]': (event) ->
    hasRipple = eqS event.currentTarget, '[data-ripple]'
    if hasRipple
      # Wait 50ms so that the ripple animation is partially visible.
      Meteor.setTimeout ->
        handleClickOnMenuTrigger event.currentTarget
      , 50
    else
      handleClickOnMenuTrigger event.currentTarget

  # Close the popup menu when the mouse leaves the menu.
  'mouseleave [data-popup-menu][data-menu-open]': (event) ->
    closePopupMenu event.currentTarget
