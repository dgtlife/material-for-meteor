###
  @file Defines the API, event handlers, and on-render callback for the MD Popup Menu.
  @author Derek Gransaull <derek@dgtlife.com>
  @copyright DGTLife, LLC 2015

  Created on 10/13/2015
###

#///////////////////    EXTEND MD API FOR MD POPUP MENU    /////////////////////
_.extend Material.prototype,

  ###*
  # Handle the click on a menu-trigger element.
  #
  # @param {Object} trigger - the trigger element
  # @private
  ###
  handleClickOnMenuTrigger: (trigger) ->
    "use strict"

    # Get the target popup menu element.
    menu = @dgEBI(trigger.getAttribute 'data-trigger-target')
    if menu.hasAttribute 'data-menu-open'
      # The menu is already open; do nothing.
      return false
    if menu.hasAttribute 'data-popup-menu'
      # It's a standalone popup menu.
      @_openPopupMenu menu
    else if menu.hasAttribute 'data-dropdown-menu'
      # It's a popup menu embedded in a dropdown menu.
      @_openDropdownMenu menu
    else false

  ###*
  # Set the size and position of a popup menu via the style attribute.
  #
  # @param {Object} menu - the menu element
  # @private
  ###
  _setSizeAndPositionOfPopupMenu: (menu) ->
    "use strict"

    # Get the dimensions of the menu element in order to set the size
    # explicitly, and to enable potential animations.
    menu.setAttribute 'style', 'display: block; opacity: 0;'
    dimensions = menu.getBoundingClientRect()
    menu.removeAttribute 'style'
    style = 'height: ' + (dimensions.height - 16) + 'px; ' +
            'width: ' + dimensions.width + 'px;'
    # Get the specified position for the menu from the parent element.
    position = menu.parentElement.getAttribute 'data-position'
    # Compose the style that positions the menu.
    switch position
      when 'top-left' then style += 'bottom: 0; right: 0;'
      when 'top-right' then style += 'bottom: 0; left: 0;'
      when 'bottom-left' then style += 'top: 0; right: 0;'
      when 'bottom-right' then style += 'top: 0; left: 0;'
      else style += 'top: 0; right: 0;'

    # Set the style attribute on the menu.
    menu.setAttribute 'style', style

  ###*
  # Open a popup menu.
  #
  # @param {Object} menu - the menu element
  # @private
  ###
  _openPopupMenu: (menu) ->
    "use strict"

    # Close any open menus.
    @_closeOpenMenus()

    # Set the position of the popup menu.
    @_setSizeAndPositionOfPopupMenu menu

    # Set an animation attribute, if necessary.
    if menu.parentElement.hasAttribute 'data-opening-animation'
      opening_animation = menu.parentElement.getAttribute 'data-opening-animation'
      menu.setAttribute 'data-opening-animation', opening_animation

    # Show the menu by setting the 'data-menu-open' attribute.
    menu.setAttribute 'data-menu-open', 'true'

    # In the mouse case, this menu automatically closes on 'mouseleave'. For the
    # touch case, an event listener for closing the menu with a touch is used.
    # Note: This will close the menu with a click on the document, including an
    # item on this menu.
    #
    # Define the event handler for the 'touchstart' event listener.
    __closeThisMenu = (event) ->
      event.preventDefault();

      # Close this menu.
      MD.closePopupMenu menu
      # Remove the listener.
      document.removeEventListener 'click', __closeThisMenu

    # Attach the event listener after the menu has opened.
    # ToDo: Consider replacing by Meteor.setTimeout by explicit detection.
    Meteor.setTimeout ->
      document.addEventListener 'click', __closeThisMenu
    , 0

  ###*
  # Assign the supplied value to a popup menu. This involves assigning the
  # value to the 'data-selected' attribute of the popup menu element. This is
  # part of the chain of execution after a user clicks a popup menu item.
  #
  # @param {Object} menu - the embedded menu element
  # @param {string} value - the value to be assigned to the popup menu
  # @private
  ###
  _assignValueOfPopupMenu: (menu, value) ->
    "use strict"

    menu.parentElement.setAttribute 'data-selected', value

  ###*
  # Close a popup menu.
  #
  # @param {Object} menu - the menu element
  # @private
  ###
  closePopupMenu: (menu) ->
    "use strict"

    menu.removeAttribute 'data-menu-open'

  ###*
  # Close any open popup or dropdown menu.
  #
  # @private
  ###
  _closeOpenMenus: ->
    "use strict"

    openMenu = @dqS '[data-menu-open]'
    if openMenu
      openMenu.removeAttribute 'data-menu-open'

#///////////////////    EVENT HANDLERS FOR MD POPUP MENU    ////////////////////
# Note that when an md_popup_menu template is imported, e.g. into an md_toolbar
# template, events do not fire in the md_popup_menu template. Hence we must use
# the body to allow arbitrary importing of templates.
Template.body.events
  # Click a button that triggers a popup/dropdown menu.
  'click [data-popup-trigger], click [data-dropdown-trigger]': (event) ->
    "use strict"

    hasRipple = MD.eqS event.currentTarget, '[data-ripple]'
    if hasRipple
      # Wait 50ms so that the ripple animation is partially visible.
      Meteor.setTimeout ->
        MD.handleClickOnMenuTrigger event.currentTarget
      , 50
    else
      MD.handleClickOnMenuTrigger event.currentTarget

  # Close the popup menu when the mouse leaves the menu.
  'mouseleave [data-popup-menu][data-menu-open]': (event) ->
    "use strict"

    MD.closePopupMenu event.currentTarget

#///////////////////  ON-RENDER CALLBACK FOR MD POPUP MENU  ////////////////////
Template.md_popup_menu.onRendered ->
  "use strict"

  # Import any menu items for this menu.
  MD.importMenuItems @data.menu_id
