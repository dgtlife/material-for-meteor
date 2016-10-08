###
  @file Defines the on-render callback for MD Spinner
  @author Derek Gransaull <derek@dgtlife.com>
  @copyright DGTLife, LLC 2015

  Created on 10/30/2015
###

#//////////////////    ON-RENDER CALLBACK FOR MD SPINNER    ////////////////////
Template.md_spinner.onRendered ->
  "use strict"

  spinner = @firstNode
  if spinner.getAttribute('data-color') is 'mono' and
    spinner.hasAttribute('data-color-1')
      color = spinner.getAttribute('data-color-1')
      MD.eqS(spinner, '[data-spinner-layer-1]').style['border-color'] = color
      MD.eqS(spinner, '[data-spinner-layer-2]').style['border-color'] = color
      MD.eqS(spinner, '[data-spinner-layer-3]').style['border-color'] = color
      MD.eqS(spinner, '[data-spinner-layer-4]').style['border-color'] = color
  else if spinner.getAttribute('data-color') is 'multi' and
    spinner.hasAttribute('data-color-1') and
    spinner.hasAttribute('data-color-2') and
    spinner.hasAttribute('data-color-3') and
    spinner.hasAttribute('data-color-4')
      MD.eqS(spinner, '[data-spinner-layer-1]').style['border-color'] =
        spinner.getAttribute('data-color-1')
      MD.eqS(spinner, '[data-spinner-layer-2]').style['border-color'] =
        spinner.getAttribute('data-color-2')
      MD.eqS(spinner, '[data-spinner-layer-3]').style['border-color'] =
        spinner.getAttribute('data-color-3')
      MD.eqS(spinner, '[data-spinner-layer-4]').style['border-color'] =
        spinner.getAttribute('data-color-4')
  else
    return false
