###
  @file Defines on-render callback for MD Dropdown Menu.
  @author Derek Gransaull <derek@dgtlife.com>
  @copyright DGTLife, LLC 2015
  Created on 10/15/2015
###
{ Template } = require 'meteor/templating'
require './md-dropdown-menu.jade'
platform = require('../../api/md-utils.js').platform
eqS = require('../../api/md-utils.js').eqS

# On-render callback for MD Dropdown Menu.
Template.md_dropdown_menu.onRendered ->
  dropdownMenu = @firstNode
  # In Firefox, the dropdown arrow is not aligned with the right edge of the
  # dropdown menu element, as it is in Chrome and Safari. Since there is no
  # platform selectivity in CSS, this 'hack' allows us to support Firefox (for
  # whatever that's worth).
  if platform.isFirefoxOnDesktop
    eqS(dropdownMenu, '[data-icon]').classList.add 'on-firefox'
