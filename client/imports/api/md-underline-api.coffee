###
 * @file Defines the API for MD Underline
 * @author Derek Gransaull <derek@dgtlife.com>
 * @copyright DGTLife, LLC 2016
 *
 * Created on 11/28/16
###
eqS = require('./md-utils.js').eqS

###*
# Set the style of the underline in a text field when the associated input has
# focus.
# @param {Element} field - the text field (.md-field) element that contains
#                          the underline
###
module.exports.setStyleOfUnderlineFocused = (field) ->
  eqS(field, '[data-underline]').classList.add 'focused'
  eqS(field, '[data-underline--modified]').classList.add 'focused'


###*
# Set the style of the underline in a text field when the associated input has
# lost focus.
# @param {Element} field - the text field (.md-field) element that contains
#                          the underline
###
module.exports.setStyleOfUnderlineUnfocused = (field) ->
  eqS(field, '[data-underline]').classList.remove 'focused'
  eqS(field, '[data-underline--modified]').classList.remove 'focused'

###*
# Set the style of the underline in a text field when the associated input is
# in error.
# @param {Element} field - the text field (.md-field) element that contains
#                          the underline
###
module.exports.setStyleOfUnderlineErrored = (field) ->
  eqS(field, '[data-underline]').classList.add 'errored'
  eqS(field, '[data-underline--modified]').classList.add 'errored'

###*
# Set the style of the underline in a text field when the associated input is
# valid.
# @param {Element} field - the text field (.md-field) element that contains
#                          the underline
###
module.exports.setStyleOfUnderlineValid = (field) ->
  eqS(field, '[data-underline]').classList.remove 'errored'
  eqS(field, '[data-underline--modified]').classList.remove 'errored'
