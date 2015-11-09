/**
 * @file Defines the API, and event handler(s) for MD Button.
 * @author Derek Gransaull <derek@dgtlife.com>
 * @copyright DGTLife, LLC 2015
 *
 * Created on 9/29/2015
 */

/*jshint -W106 */     // we are not using camelCase for every identifier

//////////////////////    EXTEND MD API FOR MD BUTTON   ////////////////////////
_.extend(Material.prototype, {

  /**
   * Enable a button that is disabled.
   *
   * @param {string} selector - the selector for the button
   */
  enableButton: function (selector) {
    "use strict";
    var self = this;

    // Remove the 'disabled' attribute.
    if (self.dqS(selector).hasAttribute('disabled'))
      self.dqS(selector).removeAttribute('disabled');
  },

  /**
   * Disable a button that is enabled.
   *
   * @param {string} selector - the selector for the button
   */
  disableButton: function (selector) {
    "use strict";
    var self = this;

    // Set the 'disabled' attribute.
    if (! self.dqS(selector).hasAttribute('disabled'))
      self.dqS(selector).setAttribute('disabled', 'true');
  }
});

///////////////////////  EVENT HANDLERS FOR MD BUTTON  /////////////////////////
Template.md_button.events({
  // Enable the hover capability of an MD button. Begin 'hovered' state.
  'mouseenter [data-button][data-hover]': function (event) {
    "use strict";
    var self=this;
    event.preventDefault();

    var button = event.currentTarget;
    // Ignore a disabled button.
    if (button.hasAttribute('disabled'))
      return false;
    // Add the 'hovered' attribute.
    button.setAttribute('hovered', 'true');
  },

  // Enable the hover capability of an MD button. End 'hovered' state.
  'mouseleave [data-button][data-hover]': function (event) {
    "use strict";
    var self=this;
    event.preventDefault();

    var button = event.currentTarget;
    // Ignore a disabled button.
    if (button.hasAttribute('disabled'))
      return false;
    // Remove the 'hovered' attribute.
    button.removeAttribute('hovered');
  },

  // Enable the toggle capability of an MD button.
  'mouseup [data-button][data-toggle], touchend [data-button][data-toggle]': function (event) {
    "use strict";
    var self=this;
    event.preventDefault();

    var button = event.currentTarget;
    // Ignore a disabled button.
    if (button.hasAttribute('disabled'))
      return false;
    // Toggle the 'pressed' state.
    if (button.hasAttribute('data-pressed')) {
      button.removeAttribute('data-pressed');
    } else {
      button.setAttribute('data-pressed', 'true');
    }
  }
});
