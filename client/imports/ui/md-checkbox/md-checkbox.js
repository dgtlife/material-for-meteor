/**
 * @file Defines the API, and event handler for MD Checkbox.
 * @author Derek Gransaull <derek@dgtlife.com>
 * @copyright DGTLife, LLC 2016
 *
 * Created on 6/26/2016
 */

import { Template } from 'meteor/templating';
import { setStateOfCheckbox } from '../../api/md-checkbox-api.js';
import './md-checkbox.jade';

// On-render callback for MD Checkbox.
Template.md_checkbox.onRendered(function onRenderedCheckbox() {
  // Handle pre-checked state.
  if (this.data.checked || (this.data.checked === '')) {
    setStateOfCheckbox(this.firstNode, true);
  }
});

// Event handlers for MD Checkbox.
Template.md_checkbox.events({
  // Toggle the checked state of the MD Checkbox.
  'click [data-checkbox]'(event) {
    const checkbox = event.currentTarget;
    if (!checkbox.hasAttribute('data-disabled')) {
      if (checkbox.hasAttribute('data-checked')) {
        setStateOfCheckbox(checkbox, false);
      } else {
        setStateOfCheckbox(checkbox, true);
      }
    }
  }
});

