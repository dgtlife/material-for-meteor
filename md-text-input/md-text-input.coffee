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
  # @param {string} selector - a selector for the text field field element
  ###
  getValueOfTextField: (selector) ->
    "use strict"

    # Return the value of the text field input.
    return @eqS(@dqS(selector), '[data-text-field-input]').value

  ###*
  # Set the value of an MD text field.
  #
  # @param {string} selector - a selector for the text field field element
  # @param {string} value - the value to be assigned to the text field
  ###
  setValueOfTextField: (selector, value) ->
    "use strict"

    if not value
      throw new Meteor.Error 'A value must be supplied; use ' +
          '\'clearValueOfTextField()\' to clear a text field, if desired.'

    # Set the value of the text field input.
    field = @dqS selector
    @eqS(field, '[data-text-field-input]').value = value
    # Reset the label position.
    @_setStyleOfLabelUnfocused field

  ###*
  # Clear the value of an MD text field.
  #
  # @param {string} selector - a selector for the text field field element
  ###
  clearValueOfTextField: (selector) ->
    "use strict"

    # Clear the text field input.
    field = @dqS selector
    @eqS(field, '[data-text-field-input').value = null
    # Reset the label position.
    label = @eqS field, '[data-label]'
    if label.classList.contains 'floating'
      label.classList.remove 'floating'

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
  # @param {boolean} [showHelperText] - if true, helper text will not be hidden
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
  # @param {string} [helperText] - the helper text to be displayed in place of
  #                                the original helper text
  ###
  clearErrorOnTextInputField: (selector, helperText) ->
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
      if helperText
        # Optionally override the helper text, with a validation message.
        helperTextElement.innerHTML = helperText
      # Show the helper text.
      helperTextElement.removeAttribute 'style'

#/////////////////////////////    MD TEXT FIELD    /////////////////////////////
#///////////////////////////////////////////////////////////////////////////////

#/////////////////////  EVENT HANDLERS FOR MD TEXT FIELD  //////////////////////
Template.mdTextField.events
  'focus [data-text-field-input]': (event) ->
    "use strict"

    field = event.currentTarget.parentElement.parentElement
    MD._setLabelAndUnderlineFocused field

  'blur [data-text-field-input]': (event) ->
    "use strict"

    field = event.currentTarget.parentElement.parentElement
    MD._setLabelAndUnderlineUnfocused field

  'input [data-text-field-input]': (event) ->
    "use strict"

    field = event.currentTarget.parentElement.parentElement
    MD._setStyleOfNonFloatableLabelOnInput field

#////////////////    ON-RENDER CALLBACK FOR MD TEXT FIELD    ///////////////////
Template.mdTextField.onRendered ->
  "use strict"

  field = @firstNode
  # Set the underline style for the disabled case.
  if @data.disabled is 'true'
    MD.eqS(field, '[data-underline]').classList.add 'disabled'

  # Set the label position, after the embedded input is loaded.
  MD.eqS(field, '[data-text-field-input]').onload = MD._setStyleOfLabelUnfocused field

#/////////////////////////////    MD TEXT AREA    //////////////////////////////
#///////////////////////////////////////////////////////////////////////////////

#/////////////////////  EVENT HANDLERS FOR MD TEXT AREA  ///////////////////////
Template.mdTextArea.events
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
    # Autogrow the textarea as input wraps.
    MD.setHeightOfTextarea field

#/////////////////    ON-RENDER CALLBACK FOR MD TEXT AREA    ///////////////////
Template.mdTextArea.onRendered ->
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
