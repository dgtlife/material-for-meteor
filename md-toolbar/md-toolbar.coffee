###
  @file Defines the API and the on-render callback for MD Toolbar
  @author Derek Gransaull <derek@dgtlife.com>
  @copyright DGTLife, LLC 2015

  Created on 12/1/2015
###

#////////////////////    EXTEND MD API FOR MD TOOLBAR    ///////////////////////
_.extend Material.prototype,

  ###*
  # Import the content for the identified toolbar.
  #
  # @param {string} id - the id of the toolbar
  # @private
  ###
  importToolbarContent: (id) ->
    "use strict"

    toolbar = @dgEBI id
    # Look for any div nodes containing content for this toolbar.
    numberOfContentDivs = @dqSA('[data-content-for-toolbar="' + id + '"]').length
    if numberOfContentDivs is 0
      throw new Meteor.Error 'Content for toolbar "' + id + '" not found.'
    else if numberOfContentDivs is 1
      # The content goes in the top bar.
      topBarContentDiv = @dqS('[data-content-for-toolbar="' + id + '"]')
      contentNodes = @nodeListToArray topBarContentDiv.childNodes
      _.each contentNodes, (contentNode) ->
        # Move each content node from its temporary parent div, into the new
        # toolbar top bar parent.
        MD.eqS(toolbar, '[data-top-bar]').appendChild contentNode
      # Remove the temporary top bar content div.
      topBarContentDiv.parentElement.removeChild topBarContentDiv
    else
      # Each content div's content goes in the specified bar.
      contentDivs = @nodeListToArray @dqSA('[data-content-for-toolbar="' + id + '"]')
      _.each contentDivs, (contentDiv) ->
        position = contentDiv.getAttribute 'data-bar'
        toolbarBar = MD.eqS(toolbar, '[data-' + position + '-bar]')
        contentNodes = MD.nodeListToArray contentDiv.childNodes
        _.each contentNodes, (contentNode) ->
          # Move each content node from its temporary parent div, into the new
          # toolbar bar parent.
          toolbarBar.appendChild contentNode
        # Remove the temporary bar content div.
        contentDiv.parentElement.removeChild contentDiv
        # Set any justification styles.
        if toolbar.hasAttribute('data-' + position + '-justify')
          justification = toolbar.getAttribute('data-' + position + '-justify')
          toolbarBar.classList.add justification + '-justified'


#//////////////////    ON-RENDER CALLBACK FOR MD SPINNER    ////////////////////
Template.mdToolbar.onRendered ->
  "use strict"

  # Import the content for this toolbar
  MD.importToolbarContent @data.id
