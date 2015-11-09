###
  @file Defines the API, event handler(s), and on-render callback for MD
        Dropdown Menu.
  @author Derek Gransaull <derek@dgtlife.com>
  @copyright DGTLife, LLC 2015

  Created on 10/15/2015
###

#//////////////////    EXTEND MD API FOR MD DROPDOWN MENU    ///////////////////
_.extend Material.prototype,

  ###*
  # Open a dropdown menu.
  #
  # @param {Object} menu - the popup menu element embedded in the dropdown menu
  # @param {Object} field - the dropdown menu field element
  # @private
  ###
  _openDropdownMenu: (menu, field) ->
    "use strict"

    # Close any open menus.
    @_closeOpenMenus()
    # Get the specified position for the menu from the parent element.
    position = menu.parentElement.getAttribute 'data-position'

    # Compose the style that positions the menu.
    input = @eqS field, '[data-dropdown-input]'
    left = (input.clientWidth - menu.clientWidth) / 2
    topMiddle = - ((menu.clientHeight - 35) / 2)
    composeStyle = (spec) ->
      if spec is 'down'
        'top: 0; left: ' + left + 'px; visibility: visible; z-index: 100;'
      else if spec is 'middle'
        'top: ' + topMiddle + 'px; left: ' + left + 'px; visibility: visible; z-index: 100;'
      else if spec is 'up'
        'bottom: 0; left: ' + left + 'px; visibility: visible; z-index: 100;'
    switch position
      when 'dropdown-up' then style = composeStyle 'up'
      when 'dropdown-middle' then style = composeStyle 'middle'
      when 'dropdown-down' then style = composeStyle 'down'
      else style = composeStyle 'down'

    # Set the style on the menu; it will display automatically.
    menu.setAttribute 'style', style
    # Set the 'data-menu-open' attribute to indicate that the menu is open.
    menu.setAttribute 'data-menu-open', 'true'

    # Attach a listener for closing the menu with a click.
    # [The following code is inspired by Material Design Lite, menu.js,
    # lines 406 - 417, however, we just wait a tad before attaching the event
    # listener.]
    # Define an event handler for the 'click' event listener
    closeThisMenu = (event) ->
      "use strict"
      event.preventDefault()

      # Close this menu, and reset the label and underline.
      MD._closeMenu menu
      MD._setLabelAndUnderlineUnfocused field

      # Detach the event listeners.
      document.removeEventListener 'click', closeThisMenu

    # Attach the event listeners.
    Meteor.setTimeout ->
      document.addEventListener 'click', closeThisMenu
    , 0

  ###*
  # Assign the supplied value to a dropdown menu. This involves assigning the
  # value to the data-selected value of the dropdown menu element, and to the
  # value of the embedded input element. (This is part of the chain of execution
  # after a user clicks a dropdown menu item.)
  #
  # @param {Object} menu - the embedded menu element
  # @param {string} value - the value to be assigned to the dropdown menu
  # @private
  ###
  _assignValueOfDropdownMenu: (menu, value) ->
    "use strict"

    field = menu.parentElement.parentElement
    input = @eqS field, '[data-dropdown-input]'
    field.setAttribute 'data-selected', value
    input.value = value
    @_setLabelAndUnderlineUnfocused field

  ###*
  # Set the supplied value to a dropdown menu. This involves assigning the
  # value to the data-selected value of the dropdown menu element, and to the
  # value of the embedded input element.
  #
  # @param {Object} selector - a selector for the dropdown menu
  # @param {string} value - the value to be assigned to the dropdown menu
  ###
  setValueOfDropdownMenu: (selector, value) ->
    "use strict"

    if not value
      throw new Meteor.Error 'A value must be supplied; use ' +
          '\'clearValueOfDropdownMenu()\' to clear a dropdown menu, if desired.'

    field = @dqS selector
    embeddedMenu = @eqS field, '[data-dropdown-menu]'
    @setValueOfMenu embeddedMenu, value

  ###*
  # Get the value of a dropdown menu.
  #
  # @param {string} selector - a selector for the dropdown menu
  ###
  getValueOfDropdownMenu: (selector) ->
    "use strict"

    @dqS(selector).getAttribute 'data-selected'

  ###*
  # Clear the value of a dropdown menu.
  #
  # @param {string} selector - a selector for the dropdown menu
  ###
  clearValueOfDropdownMenu: (selector) ->
    "use strict"

    field = @dqS selector
    input = @eqS field, '[data-dropdown-input]'
    embeddedMenu = @eqS field, '[data-dropdown-menu]'

    # Clear the value of the input, and reset the label position.
    input.value = null
    @_setLabelAndUnderlineUnfocused field
    # Clear the value of the embedded menu.
    @clearValueOfMenu embeddedMenu

  ###*
  # Toggle the state (open|closed) of a dropdown menu.
  #
  # @param {Object} menu - the popup menu element embedded in the dropdown menu
  ###
  toggleDropdownMenu: (menu) ->
    "use strict"

    field = menu.parentElement.parentElement
    if menu.getAttribute 'data-menu-open'
      # It's open; close it.
      @_closeMenu menu
      @_setLabelAndUnderlineUnfocused field
    else
      @_setLabelAndUnderlineFocused field
      @_openDropdownMenu menu, field

#/////////////////  ON-RENDER CALLBACK FOR MD DROPDOWN MENU  ///////////////////
#Template.md_dropdown_menu.onRendered ->
#  "use strict"
