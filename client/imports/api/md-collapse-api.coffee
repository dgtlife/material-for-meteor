###
 * @file Defines the API for MD Collapse
 * @author Derek Gransaull <derek@dgtlife.com>
 * @copyright DGTLife, LLC 2016
 *
 * Created on 11/29/16
###
eqS = require('./md-utils.js').eqS
getElement = require('./md-utils.js').getElement

###*
# Expand the content in an MD Collapse.
# @param {(string|Element)} collapseSpec - a selector for the collapse element
#                                          or the collapse element itself
###
module.exports.expandContent = (collapseSpec) ->
  collapse = getElement collapseSpec
  content = eqS collapse, '[data-collapse-content]'
  sizer = eqS content, '[data-collapse-sizer]'
  toggle = eqS collapse, '[data-collapse-toggle]'

  content.classList.remove 'collapsed'
  content.style.height = sizer.scrollHeight + 'px'
  toggle.classList.remove 'collapsed'

###*
# Collapse the content in an MD Collapse.
# @param {(string|Element)} collapseSpec - a selector for the collapse element
#                                          or the collapse element itself
###
module.exports.collapseContent = (collapseSpec) ->
  collapse = getElement collapseSpec
  content = eqS collapse, '[data-collapse-content]'
  toggle = eqS collapse, '[data-collapse-toggle]'

  content.classList.add 'collapsed'
  content.removeAttribute 'style'
  toggle.classList.add 'collapsed'
