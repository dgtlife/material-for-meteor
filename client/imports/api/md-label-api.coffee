###
 * @file Defines the API for MD Label
 * @author Derek Gransaull <derek@dgtlife.com>
 * @copyright DGTLife, LLC 2016
###
eqS = require('./md-utils.js').eqS

###*
# Set the style of a floatable label when the associated input has focus.
# @param {Element} field - the text field (.md-field) element that contains
#                          the label
###
module.exports.setStyleOfLabelFocused = (field) ->
  label = eqS field, '[data-label]'
  prefix = eqS field, '[data-text-field-prefix]'
  if not label.hasAttribute 'data-no-float'
    label.classList.add('floating', 'focused')
  if prefix
    # Remove the prefix padding.
    label.removeAttribute 'style'

###*
# Set the style of a floatable label when the associated input has lost
# focus.
# @param {Element} field - the text field (.md-field) element that contains
#                          the label
###
module.exports.setStyleOfLabelUnfocused = (field) ->
  label = eqS field, '[data-label]'
  input = (eqS field, '[data-text-field-input]') or
    (eqS field, '[data-text-area-input]') or
    (eqS field, '[data-dropdown-input]')
  prefix = eqS field, '[data-text-field-prefix]'

  # Remove the 'focused' class.
  label.classList.remove 'focused'

  # Manage the label.
  if input.value and (input.value.length > 0)
    # It contains input.
    if (not label.hasAttribute 'data-no-float' )
      # It is a floatable label; float it.
      label.classList.add 'floating'
    else
      # It is not a floatable label; hide it.
      label.classList.add 'hide-label'
  else
    # It is (still) empty.
    if prefix
      # Accommodate the prefix.
      prefixWidth = prefix.clientWidth
      label.setAttribute 'style', 'padding-left: ' + prefixWidth + 'px;'
    # Reset the label.
    label.classList.remove('floating', 'focused')

###*
# Set the style of a non-floatable label when the associated input has
# received input.
# @param {Element} field - the text field (.md-field) element that contains
#                          the label
###
module.exports.setStyleOfNonFloatableLabelOnInput = (field) ->
  label = eqS field, '[data-label]'
  input = (eqS field, '[data-text-field-input]') or
    (eqS field, '[data-text-area-input]') or
    (eqS field, '[data-dropdown-input]')

  if label.hasAttribute 'data-no-float'
    # It's a non-floatable label.
    if input.value and (input.value.length > 0)
      # There is input; hide the label.
      label.classList.add 'hide-label'
    else
      # There is no input; show the label.
      label.classList.remove 'hide-label'

###*
# Set the style of a floatable label when the associated input is in error.
# @param {Element} field - the text field (.md-field) element that contains
#                          the label
###
module.exports.setStyleOfLabelErrored = (field) ->
  label = eqS field, '[data-label]'
  if not label.hasAttribute 'data-no-float'
    label.classList.add('errored')

###*
# Set the style of a floatable label when the associated input is valid.
# @param {Element} field - the text field (.md-field) element that contains
#                          the label
###
module.exports.setStyleOfLabelValid = (field) ->
  label = eqS field, '[data-label]'
  if not label.hasAttribute 'data-no-float'
    label.classList.remove('errored')
