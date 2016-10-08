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
  # Set the position of a dropdown menu via the style attribute.
  #
  # @param {Object} field - the field element
  # @param {Object} menu - the embedded menu element
  # @private
  ###
  _setPositionOfDropdownMenu: (field, menu) ->
    "use strict"

    # Get the specified position for the menu from the parent element.
    position = menu.parentElement.getAttribute 'data-position'
    # Get the element dimensions to compute the menu position settings.
    input = @eqS field, '[data-dropdown-input]'
    menu.setAttribute 'style', 'display: block; opacity: 0;'
    left = (input.clientWidth - menu.clientWidth) / 2
    topMiddle = - ((menu.clientHeight - 35) / 2)
    menu.removeAttribute 'style'
    # Compose the style that positions the menu.
    composeStyle = (spec) ->
      if spec is 'down'
        'top: 0; left: ' + left + 'px; z-index: 8;'
      else if spec is 'middle'
        'top: ' + topMiddle + 'px; left: ' + left + 'px; z-index: 8;'
      else if spec is 'up'
        'bottom: 0; left: ' + left + 'px; z-index: 8;'
    switch position
      when 'dropdown-up' then style = composeStyle 'up'
      when 'dropdown-middle' then style = composeStyle 'middle'
      when 'dropdown-down' then style = composeStyle 'down'
      else style = composeStyle 'down'

    # Set the style on the menu; it will display automatically.
    menu.setAttribute 'style', style

  ###*
  # Open a dropdown menu.
  #
  # @param {Object} menu - the popup menu element embedded in the dropdown menu
  # @private
  ###
  _openDropdownMenu: (menu) ->
    "use strict"

    # Close any open menus.
    @_closeOpenMenus()

    # Get the field element.
    field = menu.parentElement.parentElement
    # Set the label and underline to focused style.
    @_setLabelAndUnderlineFocused field

    # Set the position of the popup menu.
    @_setPositionOfDropdownMenu field, menu

    # Set an animation attribute, if necessary.
    if menu.parentElement.hasAttribute 'data-opening-animation'
      opening_animation = menu.parentElement.getAttribute 'data-opening-animation'
      menu.setAttribute 'data-opening-animation', opening_animation

    # Set the 'data-menu-open' attribute to indicate that the menu is open.
    menu.setAttribute 'data-menu-open', 'true'

    # Attach a listener for closing the menu with a click.
    # Note: This will close the menu with a click on the document, including any
    # item on this menu.
    #
    # Define an event handler for the click event listener
    __closeThisMenu = (event) ->
      event.preventDefault()

      # Ensure that the trigger was not clicked.
      target = event.target
      if target.hasAttribute('data-trigger-target') and
        (target.getAttribute('data-trigger-target') is menu.id)
          # We have clicked the dropdown trigger of an open menu. Do not close.
          return false

      # Close this menu.
      MD.closePopupMenu menu
      # Reset the label and underline.
      MD._setLabelAndUnderlineUnfocused field
      # Remove the event listeners.
      document.removeEventListener 'click', __closeThisMenu

    # Attach the event listeners.
    Meteor.setTimeout ->
      document.addEventListener 'click', __closeThisMenu
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

#//////////////////  ON-RENDER CALLBACK FOR MD DROPDOWN MENU  //////////////////
Template.md_dropdown_menu.onRendered ->
  "use strict"

  dropdownMenu = @firstNode
  # In Firefox, the dropdown arrow is not aligned with the right edge of the
  # dropdown menu element, as it is in Chrome and Safari. Since there is no
  # platform selectivity in CSS, this 'hack' allows us to support Firefox (for
  # whatever that's worth).
  if MD.platform.isFirefoxOnDesktop
    MD.eqS(dropdownMenu, '[data-icon]').classList.add 'on-firefox'
