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
   * @param {(string|Object)} buttonSpec - a selector for the button element or
   *                                       the button element itself
   */
  enableButton: function (buttonSpec) {
    "use strict";
    var self = this;

    var button = self._getElement(buttonSpec);

    // Remove the 'disabled' attribute.
    if (button.hasAttribute('disabled'))
      button.removeAttribute('disabled');
  },

  /**
   * Disable a button that is enabled.
   *
   * @param {(string|Object)} buttonSpec - a selector for the button element or
   *                                       the button element itself
   */
  disableButton: function (buttonSpec) {
    "use strict";
    var self = this;

    var button = self._getElement(buttonSpec);

    // Set the 'disabled' attribute.
    if (! button.hasAttribute('disabled'))
      button.setAttribute('disabled', 'true');
  }
});

///////////////////////  EVENT HANDLERS FOR MD BUTTON  /////////////////////////
Template.md_button.events({
  // Enable the toggle capability of an MD button.
  'mouseup [data-button][data-toggle]': function (event) {
    "use strict";

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

//////////////////////  ON-RENDER CALLBACK FOR MD BUTTON  //////////////////////
Template.md_button.onRendered(function () {
  "use strict";
  var self = this;

  var button = self.firstNode;
  // Chrome on Android does not generate the :active pseudo-class, so this is a
  // workaround.
  if (MD.platform.isChromeOnAndroid) {
    // Add the 'active' state on touchstart.
    button.ontouchstart = function () {
      "use strict";
      var self = this;

      if (self.hasAttribute('disabled'))
        return false;
      // Set the 'active' state.
      if (! self.hasAttribute('data-active')) {
        self.setAttribute('data-active', 'true');
      }
    };
    // Remove the 'active' state on touchend.
    button.ontouchend = function () {
      "use strict";
      var self = this;

      if (self.hasAttribute('disabled'))
        return false;
      // Remove the 'active' state.
      if (self.hasAttribute('data-active')) {
        self.removeAttribute('data-active');
      }
    };
  }

  // Enable the toggle capability of an MD button in Safari on iOS devices.
  if (MD.platform.isSafariOnIphone || MD.platform.isSafariOnIpad) {
    if (button.hasAttribute('data-toggle')) {
      button.ontouchend = function () {
        "use strict";
        var self=this;

        // Ignore a disabled button.
        if (self.hasAttribute('disabled'))
          return false;
        // Toggle the 'pressed' state.
        if (self.hasAttribute('data-pressed')) {
          self.removeAttribute('data-pressed');
        } else {
          self.setAttribute('data-pressed', 'true');
        }
      };
    }
  }

  // Firefox does not respond to the flex-related CSS for an MD Button with an
  // icon (as does Chrome and Safari). Since there is no platform selectivity in
  // CSS, this 'hack' allows us to support Firefox (for whatever that's worth).
  if (MD.platform.isFirefoxOnDesktop) {
    if (button.hasAttribute('data-with-icon')) {
      // It's a button with an icon, so add the 'on-firefox' class to apply the
      // appropriate styles.
      MD.eqS(button, '[data-icon]').classList.add('on-firefox');
      MD.eqS(button, '[data-label]').classList.add('on-firefox');
    }
  }

  // Animate a FAB on render, if configured.
  if ((button.hasAttribute('data-fab')) && (button.hasAttribute('data-animate-on-render'))) {
    Meteor.setTimeout(function () {
      button.setAttribute('data-animate', 'true');
    }, 100);
  }
});
