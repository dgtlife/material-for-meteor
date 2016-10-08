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

    collapse = @_computeCollapse collapseSpec
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

    collapse = @_computeCollapse collapseSpec
    content = @eqS collapse, '[data-collapse-content]'
    toggle = @eqS collapse, '[data-collapse-toggle]'

    content.classList.add 'collapsed'
    content.removeAttribute 'style'
    toggle.classList.add 'collapsed'

  ###*
  # Compute the value of the collapse element from a collapseSpec value.
  #
  # @param {(string|Object)} collapseSpec - a selector for the collapse element
  #                                         or the collapse element itself
  # @private
  ###
  _computeCollapse: (collapseSpec) ->
    "use strict"

    if _.isString collapseSpec
      if @dqS(collapseSpec) is null
        throw new Meteor.Error 'An invalid selector for a collapse returned null.'
      else
        @dqS collapseSpec
    else if _.isObject collapseSpec
      collapseSpec
    else
      throw new Meteor.Error 'collapseSpec must be a collapse selector (string)' +
          ' or a collapse element (Object).'

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

