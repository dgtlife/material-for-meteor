/**
 * @file Defines the API, and event handler for MD Checkbox.
 * @author Derek Gransaull <derek@dgtlife.com>
 * @copyright DGTLife, LLC 2016
 *
 * Created on 6/26/2016
 */

/////////////////////    EXTEND MD API FOR MD CHECKBOX    //////////////////////
_.extend(Material.prototype, {
  /**
   * Set the state of a Checkbox.
   * @param {(string|Object)} checkboxSpec - a selector for the Checkbox element
   *                                         or the Checkbox element itself
   * @param {boolean} state - (true|false)
   */
  setStateOfCheckbox(checkboxSpec, state) {
    "use strict";

    const checkbox = this._getCheckbox(checkboxSpec);
    if (checkbox) {
      if (state === true) {
        checkbox.setAttribute('data-checked', 'true');
        this.eqS(checkbox, '.md-checkbox__input').setAttribute('checked', 'true');
        this.eqS(checkbox, '.md-checkbox__box--checked').classList.remove('hide');
        this.eqS(checkbox, '.md-checkbox__box--unchecked').classList.add('hide');
      }

      if (state === false) {
        checkbox.removeAttribute('data-checked');
        this.eqS(checkbox, '.md-checkbox__input').removeAttribute('checked');
        this.eqS(checkbox, '.md-checkbox__box--checked').classList.add('hide');
        this.eqS(checkbox, '.md-checkbox__box--unchecked').classList.remove('hide');
      }
    } else {
      throw new Meteor.Error(
        'The specified Checkbox does not exist.'
      );
    }
  },

  /**
   * Get the state of a Checkbox.
   * @param {(string|Object)} checkboxSpec - a selector for the Checkbox element
   *                                         or the Checkbox element itself
   */
  getStateOfCheckbox(checkboxSpec) {
    "use strict";

    const checkbox = this._getCheckbox(checkboxSpec);
    if (checkbox) {
      return checkbox.hasAttribute('data-checked');
    } else {
      throw new Meteor.Error(
        'The specified Checkbox does not exist.'
      );
    }


  },

  /**
   * Get the Checkbox element from a checkboxSpec value.
   * @param {(string|Object)} checkboxSpec - a selector for the Checkbox element
   *                                         or the Checkbox element itself
   */
  _getCheckbox(checkboxSpec) {
    "use strict";

    if (_.isString(checkboxSpec)) {
      return this.dqS(checkboxSpec);
    } else if (_.isObject(checkboxSpec)) {
      return checkboxSpec;
    } else {
      throw new Meteor.Error(
        'checkboxSpec must be a Checkbox selector (string) or ' +
        'a Checkbox element (Object).'
      );
    }
  }
});

//////////////////////  EVENT HANDLERS FOR MD CHECKBOX  ////////////////////////
Template.md_checkbox.events({
  // Toggle the checked state of the MD Checkbox.
  'click [data-checkbox]'(event) {
    "use strict";

    const checkbox = event.currentTarget;
    if (checkbox.hasAttribute('data-checked')) {
      MD.setStateOfCheckbox(checkbox, false);
    } else {
      MD.setStateOfCheckbox(checkbox, true);
    }
  }
});
