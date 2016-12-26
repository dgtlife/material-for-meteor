###
  @file Defines the on-render callback for MD Spinner
  @author Derek Gransaull <derek@dgtlife.com>
  @copyright DGTLife, LLC 2015

  Created on 10/30/2015
###
eqS = require('../../api/md-utils.js').eqS
require './md-spinner.jade'

# On-render callback for MD Spinner.
Template.md_spinner.onRendered ->
  spinner = @firstNode
  if spinner.getAttribute('data-color') is 'mono' and
    spinner.hasAttribute('data-color-1')
      color = spinner.getAttribute('data-color-1')
      eqS(spinner, '[data-spinner-layer-1]').style['border-color'] = color
      eqS(spinner, '[data-spinner-layer-2]').style['border-color'] = color
      eqS(spinner, '[data-spinner-layer-3]').style['border-color'] = color
      eqS(spinner, '[data-spinner-layer-4]').style['border-color'] = color
  else if spinner.getAttribute('data-color') is 'multi' and
    spinner.hasAttribute('data-color-1') and
    spinner.hasAttribute('data-color-2') and
    spinner.hasAttribute('data-color-3') and
    spinner.hasAttribute('data-color-4')
      eqS(spinner, '[data-spinner-layer-1]').style['border-color'] =
        spinner.getAttribute('data-color-1')
      eqS(spinner, '[data-spinner-layer-2]').style['border-color'] =
        spinner.getAttribute('data-color-2')
      eqS(spinner, '[data-spinner-layer-3]').style['border-color'] =
        spinner.getAttribute('data-color-3')
      eqS(spinner, '[data-spinner-layer-4]').style['border-color'] =
        spinner.getAttribute('data-color-4')
  else
    return false
