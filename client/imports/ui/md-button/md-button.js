/**
 * @file Defines the on-render callback and event handler(s) for MD Button.
 * @author Derek Gransaull <derek@dgtlife.com>
 * @copyright DGTLife, LLC 2015
 *
 * Created on 9/29/2015
 */
import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { eqS, platform } from '../../api/md-utils.js';
import './md-button.jade';

// On render callback for MD Button.
Template.md_button.onRendered(function onRenderedTabs() {
  const button = this.firstNode;

  /*
   * Chrome on Android does not generate the :active pseudo-class, so this is a
   * workaround.
   */
  if (platform.isChromeOnAndroid) {
    // Add the 'active' state on touchstart.
    button.ontouchstart = function addActiveState() {
      if (!this.hasAttribute('disabled')) {
        this.setAttribute('data-active', 'true');
      }
    };

    // Remove the 'active' state on touchend.
    button.ontouchend = function removeActiveState() {
      if (!this.hasAttribute('disabled')) {
        this.removeAttribute('data-active');
      }
    };
  }

  // Enable the toggle capability of an MD button in Safari on iOS devices.
  if ((platform.isSafariOnIphone || platform.isSafariOnIpad) &&
    (button.hasAttribute('data-toggle'))) {
    button.ontouchend = function enableToggle() {
      if (!this.hasAttribute('disabled')) {
        // Unless the button is disabled, toggle the 'pressed' state.
        if (this.hasAttribute('data-pressed')) {
          this.removeAttribute('data-pressed');
        } else {
          this.setAttribute('data-pressed', 'true');
        }
      }
    };
  }

  /*
   * Firefox does not respond to the flex-related CSS for an MD Button with an
   * icon (as does Chrome and Safari). Since there is no platform selectivity in
   * CSS, this 'hack' allows us to support Firefox (for whatever that's worth).
   */
  if (platform.isFirefoxOnDesktop) {
    if (button.hasAttribute('data-with-icon')) {
      /*
       * It's a button with an icon, so add the 'on-firefox' class to apply the
       * appropriate styles.
       */
      eqS(button, '[data-icon]').classList.add('on-firefox');
      eqS(button, '[data-label]').classList.add('on-firefox');
    }
  }

  // Animate a FAB on render, if configured.
  if ((button.hasAttribute('data-fab')) &&
    (button.hasAttribute('data-animate-on-render'))) {
    Meteor.setTimeout(() => {
      button.setAttribute('data-animate', 'true');
    }, 100);
  }
});

// Event handler for MD Button.
Template.md_button.events({
  // Enable the toggle capability of an MD button.
  'mouseup [data-button][data-toggle]'(event) {
    const button = event.currentTarget;

    // Ignore a disabled button.
    if (!button.hasAttribute('disabled')) {
      // Toggle the 'pressed' state.
      if (button.hasAttribute('data-pressed')) {
        button.removeAttribute('data-pressed');
      } else {
        button.setAttribute('data-pressed', 'true');
      }
    }
  }
});
