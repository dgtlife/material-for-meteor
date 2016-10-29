###
  @file API, and event handler for the MD Collapse.
  @author Derek Gransaull <derek@dgtlife.com>
  @copyright DGTLife, LLC 2016

  Created on 1/19/2016
###
#////////////////////    EXTEND MD API FOR MD COLLAPSE    //////////////////////
_.extend Material.prototype,

  ###*
  # Expand the content in an MD Collapse.
  #
  # @param {(string|Object)} collapseSpec - a selector for the collapse element
  #                                         or the collapse element itself
  ###
  expand__content: (collapseSpec) ->
    "use strict"

    collapse = @_getElement collapseSpec
    content = @eqS collapse, '[data-collapse-content]'
    sizer = @eqS content, '[data-collapse-sizer]'
    toggle = @eqS collapse, '[data-collapse-toggle]'

    content.classList.remove 'collapsed'
    content.style.height = sizer.scrollHeight + 'px'
    toggle.classList.remove 'collapsed'

  ###*
  # Collapse the content in an MD Collapse.
  #
  # @param {(string|Object)} collapseSpec - a selector for the collapse element
  #                                         or the collapse element itself
  ###
  collapse__content: (collapseSpec) ->
    "use strict"

    collapse = @_getElement collapseSpec
    content = @eqS collapse, '[data-collapse-content]'
    toggle = @eqS collapse, '[data-collapse-toggle]'

    content.classList.add 'collapsed'
    content.removeAttribute 'style'
    toggle.classList.add 'collapsed'

# /////////////////////  EVENT HANDLERS FOR MD COLLAPSE  ///////////////////////
Template.md_collapse.events
  'click [data-collapse-toggle]': (event) ->
    "use strict"

    toggle = event.currentTarget
    collapse = toggle.parentElement.parentElement
    # Toggle the content and the button.
    if toggle.classList.contains 'collapsed'
      MD.expand__content collapse
    else
      MD.collapse__content collapse

