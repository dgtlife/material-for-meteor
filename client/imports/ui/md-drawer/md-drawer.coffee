###
  @file Defines the on-render callback for MD Drawer
  @author Derek Gransaull <derek@dgtlife.com>
  @copyright DGTLife, LLC 2015

  Created on 12/11/2015
###

{ Template } = require 'meteor/templating'
require './md-drawer.jade'
dqS = require('../../api/md-utils.js').dqS
initializeDrawer = require('../../api/md-drawer-api.js').initializeDrawer

# On-render callback for MD Drawer.
Template.md_drawer.onRendered ->
  # Ensure there is a header panel present.
  if not dqS '[data-header-panel]'
    throw new Meteor.Error(
      'No header panel found. The drawer requires a header panel.'
    )
  else
    # Initialize the drawer.
    initializeDrawer @data.position
