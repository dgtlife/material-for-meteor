/**
 * @file Defines the API, event handler(s), and on-render callback for the
 *       MD Radio Button and MD Radio Group.
 * @author Derek Gransaull <derek@dgtlife.com>
 * @copyright DGTLife, LLC 2015
 *
 * Created on 10/13/2015
 */

/*jshint -W106 */     // we are not using camelCase for every identifier

//////////////////////    EXTEND MD API FOR MD RADIO    ////////////////////////
_.extend(Material.prototype, {

  /**
   * Import the radio buttons for the supplied radio group.
   * @param {object} groupElement - the group element
   * @returns {boolean} - returns false if no temp button container is found
   */
  importRadioButtons: function (groupElement) {
    "use strict";
    var self = this;

    var group, tempButtonContainer, buttonNodes;

    // Get the group value;
    group = groupElement.getAttribute('data-group');

    // Look for any node containing radio buttons for this radio group.
    tempButtonContainer = self.dqS('[data-buttons-for="' + group + '"]');
    if (tempButtonContainer) {
      buttonNodes = self.nodeListToArray(tempButtonContainer.childNodes);
      _.each(buttonNodes, function (buttonNode) {
        // Move each radio button node from its temporary container parent, into the
        // new radio group parent.
        groupElement.appendChild(buttonNode);
      });

      // Remove the temporary container.
      tempButtonContainer.parentElement.removeChild(tempButtonContainer);
    } else {
      return false;
    }
  },

  /**
   * Handler for the click event on an MD radio button.
   * @param {object} buttonElement - the button element
   * @returns {boolean} - returns false if the button is already selected
   */
  handleClickOnRadioButton: function (buttonElement) {
    "use strict";
    var self = this;

    if (buttonElement.hasAttribute('data-checked') ||
      buttonElement.hasAttribute('data-disabled')) {
      // Nothing to do.
      return false;
    } else {
      // Set the selected value of the radio group (which includes 'checking'
      // the appropriate button).
      self._assignButtonValueToGroup(buttonElement);
    }
  },

  /**
   * Set a radio button in a radio group as 'checked'.
   * @param {object} groupElement - the radio group element
   * @param {string} value - the value to be assigned to the radio group
   * @private
   */
  _setCheckedButton: function (groupElement, value) {
    "use strict";
    var self = this;

    // Get the radio buttons;
    var buttonElements = self.eqSA(groupElement, '[data-radio-button]');

    // Set the button with the matching value as 'checked'; clear the others.
    _.each(buttonElements, function (buttonElement) {
      if (buttonElement.getAttribute('data-value') === value) {
        if (!buttonElement.hasAttribute('data-checked'))
          buttonElement.setAttribute('data-checked', 'true');
      } else {
        if (buttonElement.hasAttribute('data-checked'))
          buttonElement.removeAttribute('data-checked');
      }
    });
  },

  /**
   * Assign the 'data-value' of the supplied (clicked) radio button to its
   * radio group element.
   * @param {object} buttonElement - the button element
   */
  _assignButtonValueToGroup: function (buttonElement) {
    "use strict";
    var self = this;
    var value;

    // Clear 'data-checked' from all buttons in the group.
    self.clearValueOfRadioGroup(buttonElement.parentElement);

    // Set the 'data-checked' value for the checked button.
    buttonElement.setAttribute('data-checked', 'true');

    // Set the 'data-selected' attribute in the radio group element.
    value = buttonElement.getAttribute('data-value');
    buttonElement.parentElement.setAttribute('data-selected', value);
  },

  /**
   * Compute the value of the radio group element from a groupSpec value.
   * @param {string|object} groupSpec - a selector for the group or the group
   *                                    element itself
   * @private
   */
  _computeGroup: function (groupSpec) {
    "use strict";
    var self = this;
    if (_.isString(groupSpec)) {
      return self.dqS('#' + groupSpec + ']');
    } else if (_.isObject(groupSpec)) {
      return groupSpec;
    } else {
      throw new Meteor.Error(
        'groupSpec must be the group id (string) or the group element (Object).'
      );
    }
  },

  /**
   * Initialize the value of a radio group that has its 'data-selected'
   * attribute preset.
   * @param {object} groupElement - the group element
   */
  initializeValueOfRadioGroup: function (groupElement) {
    "use strict";
    var self = this;

    // Get the 'data-selected' value from the group element.
    var value = groupElement.getAttribute('data-selected');

    // Set the corresponding button as 'checked'.
    self._setCheckedButton(groupElement, value);
  },

  /**
   * Enable a radio button that is disabled.
   * @param {string} selector - the selector for the radio button
   */
  enableRadioButton: function (selector) {
    "use strict";
    var self = this;

    // Remove the 'disabled' attribute.
    if (self.dqS(selector).hasAttribute('data-disabled'))
      self.dqS(selector).removeAttribute('data-disabled');
  },

  /**
   * Disable a radio button that is enabled.
   * @param {string} selector - a selector for the button
   */
  disableRadioButton: function (selector) {
    "use strict";
    var self = this;

    // Set the 'disabled' attribute.
    if (!self.dqS(selector).hasAttribute('data-disabled'))
      self.dqS(selector).setAttribute('data-disabled', 'true');
  },

  /**
   * Set the value of a radio group.
   * @param {string} selector - a selector for the radio group
   * @param {string} value - the value to be assigned to the radio group
   */
  setValueOfRadioGroup: function (selector, value) {
    "use strict";
    var self = this;
    if (!value)
      throw new Meteor.Error('A value must be supplied; use ' +
      '\'clearValueOfRadioGroup()\' to clear a radio group, if desired.');

    // Get the group element.
    var groupElement = self.dqS(selector);

    // Clear the value of the radio group.
    self.clearValueOfRadioGroup(groupElement);

    // Set the corresponding button as 'checked'.
    self._setCheckedButton(groupElement, value);

    // Set the data-selected' value of the radio group element.
    groupElement.setAttribute('data-selected', value);
  },

  /**
   * Get the value of a radio group. This is for use 'from a distance', when one
   * is not operating directly on the radio group element.
   * @param {string} selector - a selector for the radio group element
   */
  getValueOfRadioGroup: function (selector) {
    "use strict";
    var self = this;
    return self.dqS(selector).getAttribute('data-selected');
  },

  /**
   * Clear the value of a radio group.
   * @param {string|object} groupSpec - a selector for the group or the group
   *                                    element itself
   */
  clearValueOfRadioGroup: function (groupSpec) {
    "use strict";
    var self = this;
    var groupElement, buttonElements;

    // Get the groupElement.
    groupElement = self._getElement(groupSpec);

    // Remove the "data-checked" attribute from all buttons in this group.
    buttonElements = self.eqSA(groupElement, '[data-radio-button]');
    _.each(buttonElements, function (buttonElement) {
      buttonElement.removeAttribute('data-checked');
    });

    // Remove the "data-selected" attribute from the group element.
    groupElement.removeAttribute('data-selected');
  }
});

////////////////////  EVENT HANDLERS FOR MD RADIO GROUP  ///////////////////////
Template.md_radio_group.events({
  // Click on a radio button.
  'click [data-radio-button]'(event) {
    "use strict";
    MD.handleClickOnRadioButton(event.currentTarget);
  }
});

////////////////    ON-RENDER CALLBACK FOR MD RADIO GROUP    ///////////////////
Template.md_radio_group.onRendered(function () {
  "use strict";

  // Import the radio buttons for this radio group.
  MD.importRadioButtons(this.lastNode);

  // Set the initial value of the radio group.
  MD.initializeValueOfRadioGroup(this.lastNode);
});
