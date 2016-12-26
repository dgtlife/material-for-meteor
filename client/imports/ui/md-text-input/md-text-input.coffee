###
 * @file Defines the on-render callbacks and event handlers, for the MD text
 *       input fields--MD Text Field and MD Text Area.
 * @author Derek Gransaull <derek@dgtlife.com>
 * @copyright DGTLife, LLC 2015
 *
 * Created on 10/13/2015
###

{ Template } = require 'meteor/templating'
eqS = require('../../api/md-utils.js').eqS
setLabelAndUnderlineFocused =
  require('../../api/md-text-input-api.js').setLabelAndUnderlineFocused
setLabelAndUnderlineUnfocused =
  require('../../api/md-text-input-api.js').setLabelAndUnderlineUnfocused
unfocusLabelOnValueChange =
  require('../../api/md-text-input-api.js').unfocusLabelOnValueChange
setHeightOfTextarea =
  require('../../api/md-text-input-api.js').setHeightOfTextarea
setStyleOfNonFloatableLabelOnInput =
  require('../../api/md-label-api.coffee').setStyleOfNonFloatableLabelOnInput
setStyleOfLabelUnfocused =
  require('../../api/md-label-api.coffee').setStyleOfLabelUnfocused
require './md-text-input.jade'
require '../md-label/md-label.coffee'
require '../md-underline/md-underline.coffee'

# On-render callback for MD Text Field.
Template.md_text_field.onRendered ->
  field = @firstNode
  # Set the underline style for the disabled case.
  if @data.disabled is 'true'
    eqS(field, '[data-underline]').classList.add 'disabled'

  # Set the label position, after the embedded input is loaded.
  input = eqS field, '[data-text-field-input]'
  input.onload = setStyleOfLabelUnfocused field

  # Activate an observer in order to detect value changes and set the label
  # style.
  unfocusLabelOnValueChange field

# Event handlers for MD Text Field
Template.md_text_field.events
  'focus [data-text-field-input]': (event) ->
    field = event.currentTarget.parentElement.parentElement.parentElement
    setLabelAndUnderlineFocused field

  'blur [data-text-field-input]': (event) ->
    field = event.currentTarget.parentElement.parentElement.parentElement
    setLabelAndUnderlineUnfocused field

  'input [data-text-field-input]': (event) ->
    input = event.currentTarget
    field = event.currentTarget.parentElement.parentElement.parentElement
    setStyleOfNonFloatableLabelOnInput field
    # Mirror the input value to the field value.
    field.setAttribute('data-value', input.value)

# On-render callback for MD Text Area.
Template.md_text_area.onRendered ->
  field = @firstNode
  # Set underline style for the disabled case.
  if @data.disabled is 'true'
    eqS(field, '[data-underline]').classList.add 'disabled'

  # Set the label position.
  setStyleOfLabelUnfocused field

  # Set the height of the text area, after the input is loaded.
  eqS(field, '[data-text-area-input]').onload = setHeightOfTextarea field

  # Reset the height when the window size changes to capture any effects of
  # responsive changes that affect the height of the text block size detector.
  window.addEventListener 'resize', ->
    setHeightOfTextarea field

# Event handlers for MD Text Area
Template.md_text_area.events
  'focus [data-text-area-input]': (event) ->
    # Set the label and underline styles, and maintain size.
    field = event.currentTarget.parentElement.parentElement
    setLabelAndUnderlineFocused field

  'blur [data-text-area-input]': (event) ->
    # Reset the label and underline styles, and maintain size.
    field = event.currentTarget.parentElement.parentElement
    setLabelAndUnderlineUnfocused field

  'input [data-text-area-input]': (event) ->
    input = event.currentTarget
    field = event.currentTarget.parentElement.parentElement
    # Set the label and underline styles.
    setStyleOfNonFloatableLabelOnInput field
    # Mirror the input into the size detector.
    eqS(input.parentElement, '[data-size-detector]').innerHTML = input.value
    # Auto-grow the textarea as input wraps.
    setHeightOfTextarea field
