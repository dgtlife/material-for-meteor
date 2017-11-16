/**
 * @file Defines on-render callback and event handler(s) for MD Ripple.
 * @author Derek Gransaull <derek@dgtlife.com>
 * @copyright DGTLife, LLC 2017
 */
import { Template } from 'meteor/templating';
import {
  launchRipple,
  setRippleStyle
} from '../../api/md-ripple-api.js';
import './md-ripple.jade';

// On-render callback for MD Ripple.
Template.md_ripple.onRendered(
  function onRenderedRipple() {
    const ripple = this.firstNode;
    const isRippleForHiddenMenuItem = (
      ripple.parentElement.classList.contains('md-item') &&
      (ripple.parentElement.offsetWidth === 0)
    );
    if (
      (!ripple.hasAttribute('data-offset')) &&
      (!isRippleForHiddenMenuItem)
    ) {
      setRippleStyle(ripple);
    }
  }
);

// Event handlers for MD Ripple.
Template.md_ripple.events({
  // Trigger the ripple with a 'mousedown' in a mouse environment.
  'mousedown [data-ripple]'(event) {
    /*
     * Chrome on Android fires the 'touchstart', then the 'mousedown', whereas
     * Safari on iOS fires only the 'touchstart'. So if the ripple has already
     * been launched, do nothing.
     */
    if (!event.currentTarget.classList.contains('is-rippling')) {
      // Launch the ripple.
      launchRipple(event.currentTarget, event.offsetX, event.offsetY);
    }
  },

  // Trigger the ripple with a 'touchstart' in a touch environment.
  'touchstart [data-ripple]'(event) {
    /*
     * The touch event object is quite different from the mouse event object. We
     * must compute the touch coordinates relative to the ripple target.
     */
    const ripple = event.currentTarget;
    const rippleRect = ripple.getBoundingClientRect();
    const touch = event.originalEvent.touches[0];
    const offsetX = touch.pageX - (window.pageXOffset + rippleRect.left);
    const offsetY = touch.pageY - (window.pageYOffset + rippleRect.top);

    // Launch the ripple.
    launchRipple(ripple, offsetX, offsetY);
  },

  // Ignore double clicks.
  'dblclick [data-ripple]'(event) {
    event.preventDefault();
    return false;
  }
});
