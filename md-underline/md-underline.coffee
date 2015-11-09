###
  @file Defines the API for the MD Underline.
  @author Derek Gransaull <derek@dgtlife.com>
  @copyright DGTLife, LLC 2015

  Created on 10/17/2015
###

#///////////////////    EXTEND MD API FOR MD UNDERLINE    //////////////////////
_.extend Material.prototype,

  ###*
  # Set the style of the underline in a text field when the associated input has
  # focus.
  #
  # @param {Object} field - the text field (.md-field) element that contains
  #                         the underline
  # @private
  ###
  _setStyleOfUnderlineFocused: (field) ->
    "use strict"

    @eqS(field, '[data-underline]').classList.add 'focused'
    @eqS(field, '[data-underline--modified]').classList.add 'focused'


  ###*
  # Set the style of the underline in a text field when the associated input has
  # lost focus.
  #
  # @param {Object} field - the text field (.md-field) element that contains
  #                         the underline
  # @private
  ###
  _setStyleOfUnderlineUnfocused: (field) ->
    "use strict"

    @eqS(field, '[data-underline]').classList.remove 'focused'
    @eqS(field, '[data-underline--modified]').classList.remove 'focused'

  ###*
  # Set the style of the underline in a text field when the associated input is
  # in error.
  #
  # @param {Object} field - the text field (.md-field) element that contains
  #                         the underline
  # @private
  ###
  _setStyleOfUnderlineErrored: (field) ->
    "use strict"

    @eqS(field, '[data-underline]').classList.add 'errored'
    @eqS(field, '[data-underline--modified]').classList.add 'errored'

  ###*
  # Set the style of the underline in a text field when the associated input is
  # valid.
  #
  # @param {Object} field - the text field (.md-field) element that contains
  #                         the underline
  # @private
  ###
  _setStyleOfUnderlineValid: (field) ->
    "use strict"

    @eqS(field, '[data-underline]').classList.remove 'errored'
    @eqS(field, '[data-underline--modified]').classList.remove 'errored'
