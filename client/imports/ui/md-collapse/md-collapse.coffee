###
  @file Defines the event handler for the MD Collapse.
  @author Derek Gransaull <derek@dgtlife.com>
  @copyright DGTLife, LLC 2016

  Created on 1/19/2016
###

expandContent = require('../../api/md-collapse-api.coffee').expandContent
collapseContent = require('../../api/md-collapse-api.coffee').collapseContent
require './md-collapse.jade'

# Event handlers for MD Collapse.
Template.md_collapse.events
  'click [data-collapse-toggle]': (event) ->
    toggle = event.currentTarget
    collapse = toggle.parentElement.parentElement
    # Toggle the content and the button.
    if toggle.classList.contains 'collapsed'
      expandContent collapse
    else
      collapseContent collapse
