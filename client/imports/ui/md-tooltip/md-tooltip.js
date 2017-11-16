/**
 * @file Defines the on-render callback and event handler(s) for MD Tooltip.
 * @author Derek Gransaull <derek@dgtlife.com>
 * @copyright DGTLife, LLC 2016
 */
import { Template } from 'meteor/templating';
import {
  registerTooltip,
  showTooltip,
  hideTooltip
} from '../../api/md-tooltip-api.js';
import './md-tooltip.jade';

// On-render callback for MD Popup Menu
Template.md_tooltip.onRendered(function onRenderedTooltip() {
  // Register the tooltip with the target element.
  registerTooltip(this.data.target);
});

// Event handlers for MD Tooltip.
Template.body.events({
  'mouseover [data-has-tooltip]'() {
    showTooltip(this.id);
  },

  'mouseout [data-has-tooltip]'() {
    // Hide the tooltip, if necessary.
    hideTooltip(this.id);
  }
});

