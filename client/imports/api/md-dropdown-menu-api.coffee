###
 * @file Defines the API for MD Dropdown Menu
 * @author Derek Gransaull <derek@dgtlife.com>
 * @copyright DGTLife, LLC 2016
 *
 * Created on 11/20/16
###
{ Meteor } = require 'meteor/meteor'
dqS = require('./md-utils.js').dqS
eqS = require('./md-utils.js').eqS
setLabelAndUnderlineUnfocused =
  require('./md-text-input-api.js').setLabelAndUnderlineUnfocused
setLabelAndUnderlineFocused =
  require('./md-text-input-api.js').setLabelAndUnderlineFocused
closeOpenMenus = require('./md-menu-common-api.js').closeOpenMenus
closePopupMenu = require('./md-menu-common-api.js').closePopupMenu
setValueOfMenu = require('./md-menu-api.js').setValueOfMenu
clearValueOfMenu = require('./md-menu-api.js').clearValueOfMenu

###*
# Assign the supplied value to a dropdown menu. This involves assigning the
# value to the data-selected value of the dropdown menu element, and to the
# value of the embedded input element. (This is part of the chain of execution
# after a user clicks a dropdown menu item.)
# @param {Element} menu - the embedded menu element
# @param {string} value - the value to be assigned to the dropdown menu
###
module.exports.assignValueOfDropdownMenu = (menu, value) ->
  field = menu.parentElement.parentElement
  input = eqS field, '[data-dropdown-input]'
  field.setAttribute 'data-selected', value
  input.value = value
  setLabelAndUnderlineUnfocused field


###*
# Open a dropdown menu.
# @param {Element} menu - the popup menu element embedded in the dropdown menu
###
module.exports.openDropdownMenu = (menu) ->
  # Close any open menus.
  closeOpenMenus()

  # Get the field element.
  field = menu.parentElement.parentElement

  # Set the label and underline to focused style.
  setLabelAndUnderlineFocused field

  # Set the position of the popup menu.
  setPositionOfDropdownMenu field, menu

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
  closeThisMenu = (event) ->
    event.preventDefault()

    # Ensure that the trigger was not clicked.
    target = event.target
    if target.hasAttribute('data-trigger-target') and
      (target.getAttribute('data-trigger-target') is menu.id)
        # We have clicked the dropdown trigger of an open menu. Do not close.
        return false

    # Close this menu.
    closePopupMenu menu

    # Reset the label and underline.
    setLabelAndUnderlineUnfocused field

    # Remove the event listeners.
    document.removeEventListener 'click', closeThisMenu

  # Attach the event listeners.
  Meteor.defer ->
    document.addEventListener 'click', closeThisMenu

###*
# Set the position of a dropdown menu via the style attribute.
# @param {Element} field - the field element
# @param {Element} menu - the embedded menu element
###
setPositionOfDropdownMenu = (field, menu) ->
  # Get the specified position for the menu from the parent element.
  position = menu.parentElement.getAttribute 'data-position'

  # Get the element dimensions to compute the menu position settings.
  input = eqS field, '[data-dropdown-input]'
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
# Set the supplied value to a dropdown menu. This involves assigning the
# value to the data-selected value of the dropdown menu element, and to the
# value of the embedded input element.
# @param {Object} selector - a selector for the dropdown menu
# @param {string} value - the value to be assigned to the dropdown menu
###
module.exports.setValueOfDropdownMenu = (selector, value) ->
  if not value
    throw new Meteor.Error 'A value must be supplied; use ' +
        '"clearValueOfDropdownMenu()" to clear a dropdown menu, if desired.'

  field = dqS selector
  embeddedMenu = eqS field, '[data-dropdown-menu]'
  setValueOfMenu embeddedMenu, value

###*
# Get the value of a dropdown menu.
# @param {string} selector - a selector for the dropdown menu
###
module.exports.getValueOfDropdownMenu = (selector) ->
  dqS(selector).getAttribute 'data-selected'

###*
# Clear the value of a dropdown menu.
# @param {string} selector - a selector for the dropdown menu
###
module.exports.clearValueOfDropdownMenu = (selector) ->
  field = dqS selector
  input = eqS field, '[data-dropdown-input]'
  embeddedMenu = eqS field, '[data-dropdown-menu]'

  # Clear the value of the input, and reset the label position.
  input.value = null
  setLabelAndUnderlineUnfocused field

  # Clear the value of the embedded menu.
  clearValueOfMenu embeddedMenu

