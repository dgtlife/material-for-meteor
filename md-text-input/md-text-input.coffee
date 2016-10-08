###
 * @file Defines the API, event handlers, and on-render callbacks for the MD
 *       text input fields--MD Text Field and MD Text Area.
 * @author Derek Gransaull <derek@dgtlife.com>
 * @copyright DGTLife, LLC 2015
 *
 * Created on 10/13/2015
###

#////////////////////    EXTEND MD API FOR MD TEXT INPUT    ////////////////////
_.extend Material.prototype,

  ###*
  # Set the label and underline of a text input field to the focused appearance
  # and position.
  #
  # @param {Object} field - the text input field element
  # @private
  ###
  _setLabelAndUnderlineFocused: (field) ->
    "use strict"

    @_setStyleOfLabelFocused field
    @_setStyleOfUnderlineFocused field

  ###*
  # Set the label and underline of a text input field to the unfocused
  # appearance and position.
  #
  # @param {Object} field - the text input field element
  # @private
  ###
  _setLabelAndUnderlineUnfocused: (field) ->
    "use strict"

    @_setStyleOfLabelUnfocused field
    @_setStyleOfUnderlineUnfocused field

  ###*
  # Set the label and underline of a text input field to the errored
  # appearance and position.
  #
  # @param {Object} field - the text input field element
  # @private
  ###
  _setLabelAndUnderlineErrored: (field) ->
    "use strict"

    @_setStyleOfLabelErrored field
    @_setStyleOfUnderlineErrored field

  ###*
  # Set the label and underline of a text input field to the valid
  # appearance and position.
  #
  # @param {Object} field - the text input field element
  # @private
  ###
  _setLabelAndUnderlineValid: (field) ->
    "use strict"

    @_setStyleOfLabelValid field
    @_setStyleOfUnderlineValid field

  ###*
  # Get the value of an MD text field.
  #
  # @param {string} selector - a selector for the text field element
  ###
  getValueOfTextField: (selector) ->
    "use strict"

    # Return the value of the text field element.
    return @dqS(selector).getAttribute 'data-value'

  ###*
  # Set the value of an MD text field.
  #
  # @param {string} selector - a selector for the text field element
  # @param {string} value - the value to be assigned to the text field
  ###
  setValueOfTextField: (selector, value) ->
    "use strict"

    if not value
      throw new Meteor.Error 'A value must be supplied; use ' +
          '\'clearValueOfTextField()\' to clear a text field, if desired.'

    field = @dqS selector
    # Set the value on the field element.
    field.setAttribute 'data-value', value
    # Set the value on the input element.
    @eqS(field, '[data-text-field-input]').value = value
    # Reset the label position.
    @_setStyleOfLabelUnfocused field

  ###*
  # Clear the value of an MD text field.
  #
  # @param {string} selector - a selector for the text field element
  ###
  clearValueOfTextField: (selector) ->
    "use strict"

    field = @dqS selector
    # Clear the value on the field element.
    field.removeAttribute 'data-value'
    # Clear the value on the input element.
    @eqS(field, '[data-text-field-input]').value = null
    # Reset the label position.
    label = @eqS field, '[data-label]'
    if label.classList.contains 'floating'
      label.classList.remove 'floating'
    # Reset the label and underline style.
    @_setLabelAndUnderlineValid field

  ###*
  # Disable an MD text field.
  #
  # @param {string} selector - a selector for the text field element
  ###
  disableTextField: (selector) ->
    "use strict"

    field = @dqS selector
    # Disable the input element.
    input = @eqS field, '[data-text-field-input]'
    if not input.hasAttribute 'disabled'
      input.setAttribute 'disabled', 'true'
    # Add the 'disabled' class to the underline.
    underline = @eqS field, '.md-field__underline'
    if not underline.classList.contains 'disabled'
      underline.classList.add 'disabled'

  ###*
  # Enable an MD text field.
  #
  # @param {string} selector - a selector for the text field element
  ###
  enableTextField: (selector) ->
    "use strict"

    field = @dqS selector
    # Enable the input element.
    input = @eqS field, '[data-text-field-input]'
    if input.hasAttribute 'disabled'
      input.removeAttribute 'disabled'
    # Remove the 'disabled' class from the underline.
    underline = @eqS field, '.md-field__underline'
    if underline.classList.contains 'disabled'
      underline.classList.remove 'disabled'

  ###*
  # Get the value of an MD text area.
  #
  # @param {string} selector - a selector for the text area field element
  ###
  getValueOfTextArea: (selector) ->
    "use strict"

    # Return the value of the text area input.
    return @eqS(@dqS(selector), '[data-text-area-input]').value

  ###*
  # Set the value of an MD text area.
  #
  # @param {string} selector - a selector for the text area field element
  # @param {string} value - the value to be assigned to the text area
  ###
  setValueOfTextArea: (selector, value) ->
    "use strict"

    if not value
      throw new Meteor.Error 'A value must be supplied; use ' +
          '\'clearValueOfTextArea()\' to clear a text area, if desired.'

    # Set the value of the text area input.
    field = @dqS selector
    @eqS(field, '[data-text-area-input]').value = value
    # Mirror the input value into the size detector.
    @eqS(field, '[data-size-detector]').innerHTML = value
    # Reset the label position.
    @_setStyleOfLabelUnfocused field
    # Reset the height of the text area.
    @setHeightOfTextarea field

  ###*
  # Clear the value of an MD text area.
  #
  # @param {string} selector - a selector for the text area field element
  ###
  clearValueOfTextArea: (selector) ->
    "use strict"

    # Clear the text area input.
    field = @dqS selector
    @eqS(field, '[data-text-area-input').value = null
    # Mirror the input value into the size detector.
    @eqS(field, '[data-size-detector]').innerHTML = null
    # Reset the label position.
    @_setStyleOfLabelUnfocused field
    # Reset the height of the text area.
    @setHeightOfTextarea field

  ###*
  # Activate an observer in order to detect when the value of a field changes
  # (programmatically) and set the appropriate label style.
  #
  ###
  setLabelStyleOnValueChange: (field) ->
    "use strict"

    # A callback that detects (programmatic) changes in the input value and sets
    # the style for the label accordingly.
    __detect__value_change = (mutations) ->
      _.each mutations, (mutation) ->
        if mutation.attributeName is 'data-value'
          # The value has changed. set the label style.
          MD._setStyleOfLabelUnfocused field

    # Activate an observer that listens for attribute changes in the field
    # element.
    _on_attribute_change = new MutationObserver __detect__value_change
    _on_attribute_change.observe field,
      attributes: true

  ###*
  # Set the height of the text area based on its input.
  #
  # @param {Object} field - the text area field element
  ###
  setHeightOfTextarea: (field) ->
    "use strict"

    input = @eqS field, '[data-text-area-input]'
    sizeDetector = @eqS field, '[data-size-detector]'
    newHeight = sizeDetector.clientHeight - 16
    input.setAttribute('style', 'height: ' + newHeight + 'px')

  ###*
  # Set the validation state of an MD text input field.
  #
  # @param {string} selector - a selector for the text field field element
  # @param {string} state - ('errored'|'valid') the state to be assigned to the
  #                         text field
  ###
  setStateOfTextField: (selector, state) ->
    "use strict"

    if not state
      throw new Meteor.Error 'A state ("errored"|"valid") must be supplied.'

    field = @dqS selector
    if state is 'errored'
      @_setLabelAndUnderlineErrored field
    else if state is 'valid'
      @_setLabelAndUnderlineValid field
    else
      throw new Meteor.Error 'Invalid value for state; it must be "errored" or "valid".'

  ###*
  # Set an error on an MD text input field.
  #
  # @param {string} selector - a selector for the text field field element
  # @param {string} errorText - the error text to be displayed
  # @param {boolean} [showHelperText] - if TRUE, helper text will not be hidden
  #                                     on error
  ###
  setErrorOnTextInputField: (selector, errorText, showHelperText) ->
    "use strict"

    field = @dqS selector
    # Make the label and underline red.
    @_setLabelAndUnderlineErrored field
    # Set the error text for the field.
    @eqS(field, '[data-text-input-error-text]').innerHTML = errorText
    # Set the 'data-errored' attribute for the field.
    field.setAttribute 'data-errored', 'true'
    # Hide the helper text, if there is any, and if hiding is required.
    helperTextElement = @eqS(field, '[data-text-input-helper-text]')
    if helperTextElement and not showHelperText
      helperTextElement.setAttribute 'style', 'display: none;'

  ###*
  # Clear an error on an MD text input field. Optionally override the original
  # helper text message, e.g. Valid.
  #
  # @param {string} selector - a selector for the text field field element
  # @param {string} [validMessage] - a validation message to be displayed in
  #                                  place of the original helper text
  ###
  clearErrorOnTextInputField: (selector, validMessage) ->
    "use strict"

    field = @dqS selector
    # Reset the label and underline.
    @_setLabelAndUnderlineValid field
    # Clear the error text for the field.
    @eqS(field, '[data-text-input-error-text]').innerHTML = ''
    # Remove the 'data-errored' attribute.
    field.removeAttribute 'data-errored'
    # Unhide the helper text, if there is any.
    helperTextElement = @eqS(field, '[data-text-input-helper-text]')
    if helperTextElement
      if validMessage
        # Optionally override the helper text, with a validation message.
        helperTextElement.innerHTML = validMessage
      # Show the helper text.
      helperTextElement.removeAttribute 'style'

  ###*
  # Reset MD text fields, i.e. clear the input value, clear any error, and
  # restore any helper text for each field. This is a convenience function for
  # use in resetting forms.
  #
  # @param {Array} fields - an array of selectors for the text fields
  ###
  resetTextFields: (fields) ->
    "use strict"

    _.each fields, (field) ->
      # Clear the field.
      MD.clearValueOfTextField field
      # Clear any residual error.
      MD.clearErrorOnTextInputField field

#/////////////////////////////    MD TEXT FIELD    /////////////////////////////

#/////////////////////  EVENT HANDLERS FOR MD TEXT FIELD  //////////////////////
Template.md_text_field.events
  'focus [data-text-field-input]': (event) ->
    "use strict"

    field = event.currentTarget.parentElement.parentElement.parentElement
    MD._setLabelAndUnderlineFocused field

  'blur [data-text-field-input]': (event) ->
    "use strict"

    field = event.currentTarget.parentElement.parentElement.parentElement
    MD._setLabelAndUnderlineUnfocused field

  'input [data-text-field-input]': (event) ->
    "use strict"

    input = event.currentTarget
    field = event.currentTarget.parentElement.parentElement.parentElement
    MD._setStyleOfNonFloatableLabelOnInput field
    # Mirror the input value to the field value.
    field.setAttribute('data-value', input.value)

#////////////////    ON-RENDER CALLBACK FOR MD TEXT FIELD    ///////////////////
Template.md_text_field.onRendered ->
  "use strict"

  field = @firstNode
  # Set the underline style for the disabled case.
  if @data.disabled is 'true'
    MD.eqS(field, '[data-underline]').classList.add 'disabled'

  # Set the label position, after the embedded input is loaded.
  input = MD.eqS field, '[data-text-field-input]'
  input.onload = MD._setStyleOfLabelUnfocused field

  # Activate an observer in order to detect value changes and set the label
  # style.
  MD.setLabelStyleOnValueChange field

#/////////////////////////////    MD TEXT AREA    //////////////////////////////

#/////////////////////  EVENT HANDLERS FOR MD TEXT AREA  ///////////////////////
Template.md_text_area.events
  'focus [data-text-area-input]': (event) ->
    "use strict"

    # Set the label and underline styles, and maintain size.
    field = event.currentTarget.parentElement.parentElement
    MD._setLabelAndUnderlineFocused field

  'blur [data-text-area-input]': (event) ->
    "use strict"

    # Reset the label and underline styles, and maintain size.
    field = event.currentTarget.parentElement.parentElement
    MD._setLabelAndUnderlineUnfocused field

  'input [data-text-area-input]': (event) ->
    "use strict"

    input = event.currentTarget
    field = event.currentTarget.parentElement.parentElement
    # Set the label and underline styles.
    MD._setStyleOfNonFloatableLabelOnInput field
    # Mirror the input into the size detector.
    MD.eqS(input.parentElement, '[data-size-detector]').innerHTML = input.value
    # Auto-grow the textarea as input wraps.
    MD.setHeightOfTextarea field

#/////////////////    ON-RENDER CALLBACK FOR MD TEXT AREA    ///////////////////
Template.md_text_area.onRendered ->
  "use strict"

  field = @firstNode
  # Set underline style for the disabled case.
  if @data.disabled is 'true'
    MD.eqS(field, '[data-underline]').classList.add 'disabled'

  # Set the label position.
  MD._setStyleOfLabelUnfocused field

  # Set the height of the text area, after the input is loaded.
  MD.eqS(field, '[data-text-area-input]').onload = MD.setHeightOfTextarea field

  # Reset the height when the window size changes to capture any effects of
  # responsive changes that affect the height of the text block size detector.
  window.addEventListener 'resize', ->
    MD.setHeightOfTextarea field
