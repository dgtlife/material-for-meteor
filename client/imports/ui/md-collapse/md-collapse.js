/**
 * @file Defines the event handler for the MD Collapse.
 * @author Derek Gransaull <derek@dgtlife.com>
 * @copyright DGTLife, LLC 2016
 *
 * Created on 1/19/2016
 */
import { Template } from 'meteor/templating';
import {
  expandContent,
  collapseContent,
  refitContent
} from '../../api/md-collapse-api.js';
import './md-collapse.jade';

// Event handlers for MD Collapse.
Template.md_collapse.events({
  'click [data-collapse-toggle]'(event) {
    const toggle = event.currentTarget;
    const collapse = toggle.parentElement.parentElement;

    // Toggle the content and the button.
    if (toggle.classList.contains('collapsed')) {
      expandContent(collapse);
    } else {
      collapseContent(collapse);
    }

    // Refit content when the screen is resized.
    window.onresize = () => refitContent(collapse);
  }
});
