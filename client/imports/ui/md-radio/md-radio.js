/**
 * @file Defines the on-render callback and event handler(s) for the
 *       MD Radio Button and MD Radio Group.
 * @author Derek Gransaull <derek@dgtlife.com>
 * @copyright DGTLife, LLC 2015
 *
 * Created on 10/13/2015
 */
import { Template } from 'meteor/templating';
import {
  importRadioButtons,
  initializeValueOfRadioGroup,
  handleClickOnRadioButton
} from '../../api/md-radio-api.js';
import './md-radio.jade';

// On-render callback for MD Radio Group.
Template.md_radio_group.onRendered(function onRenderedRadio() {
  // Import the radio buttons for this radio group.
  importRadioButtons(this.lastNode);

  // Set the initial value of the radio group.
  initializeValueOfRadioGroup(this.lastNode);
});

// Event handlers for MD Radio Group.
Template.md_radio_group.events({
  // Click on a radio button.
  'click [data-radio-button]'(event) {
    handleClickOnRadioButton(event.currentTarget);
  }
});
