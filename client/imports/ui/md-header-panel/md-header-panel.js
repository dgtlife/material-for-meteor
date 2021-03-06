/**
 * @file Defines the on-render callback for MD Header Panel
 * @author Derek Gransaull <derek@dgtlife.com>
 * @copyright DGTLife, LLC 2015
 */
import { Template } from 'meteor/templating';
import { initializeHeaderPanelSystem } from '../../api/md-header-panel-api.js';
import './md-header-panel.jade';

// On render callback for MD Header Panel.
Template.md_header_panel.onRendered(
  () => initializeHeaderPanelSystem()
);
