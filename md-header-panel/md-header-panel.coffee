###
  @file Defines the on-render callback for MD Toolbar
  @author Derek Gransaull <derek@dgtlife.com>
  @copyright DGTLife, LLC 2015

  Created on 12/1/2015
###

#////////////////////    EXTEND MD API FOR MD HEADER    ////////////////////////
_.extend Material.prototype,

  initializeHeaderPanelSystem: ->
    "use strict"

    headerPanel = @dqS '[data-header-panel]'
    header = @eqS headerPanel, '[data-header]'
    headerShadow = @eqS headerPanel, '[data-header-shadow]'
    contentPanel = @eqS headerPanel, '[data-content-panel]'
    content = @eqS contentPanel, '[data-content]'
    if @eqS content, '[data-covering-content]'
      coveringContent = @eqS content, '[data-covering-content]'

    # Clear any settings from a previous mode.
#    if headerPanel.hasAttribute 'data-expand-on-scroll'
#      headerPanel.removeAttribute 'data-expand-on-scroll'
    if contentPanel.hasAttribute 'data-mode'
      contentPanel.removeAttribute 'data-mode'
    if content.hasAttribute 'data-mode'
      content.removeAttribute 'data-mode'
    if coveringContent.hasAttribute 'data-mode'
      coveringContent.removeAttribute 'data-mode'
    @scrollMonitor content, 'off'

    # Get the (current) mode.
    if headerPanel.hasAttribute 'data-mode'
      mode = headerPanel.getAttribute 'data-mode'
    else
      # It's the default mode, which is 'standard'
      mode = 'standard'

    # Apply the mode.
    # Standard
    if mode is 'standard'
      # Show the drop shadow.
      @_showDropShadow headerShadow
    # Seamed
    else if mode is 'seamed'
      # Ensure that the shadow is hidden.
      @_hideDropShadow headerShadow
    # Scroll
    else if mode is 'scroll'
      # Ensure that the shadow is hidden.
      @_hideDropShadow headerShadow
      # Ensure that the 'scroll' mode is set on the content.
      content.setAttribute 'data-mode', 'scroll'
    # Waterfall
    else if mode is 'waterfall'
      # Ensure that the shadow is initially hidden.
      @_hideDropShadow headerShadow

      # A callback to hide the shadow when the content is fully scrolled down
      onScrolledDown = ->
        "use script"

        # Ensure that the shadow is hidden.
        MD._hideDropShadow headerShadow

      # A callback to show the shadow when the content is scrolling (up or down)
      onScrolling = ->
        "use script"

        # Show the drop shadow.
        MD._showDropShadow headerShadow

      # Turn ON a scroll monitor for the content.
      @scrollMonitor content, 'on', onScrolledDown, null, onScrolling
    # Waterfall-collapse
    else if mode is 'waterfall-collapse'
      # Ensure that the shadow is initially hidden.
      @_hideDropShadow headerShadow

      # A callback to expand the header (if configured) and to hide the shadow
      # when the content is fully scrolled down
      onScrolledDown = ->
        "use script"

        if not headerPanel.hasAttribute 'data-expand-on-scroll'
          # Expand the header.
          MD._expandHeader header
          # Show the middle, and bottom bars.
          MD._showMiddleAndBottomBars header

        # Ensure that the shadow is hidden.
        MD._hideDropShadow headerShadow

      # A callback to show the shadow when the content is scrolling
      onScrolling = (direction) ->
        "use script"

        # Show the drop shadow.
        MD._showDropShadow headerShadow

        if direction is 'up'
          # Collapse the header.
          MD._collapseHeader header
          # Hide the medium, and bottom bars.
          if MD.eqS header, '[data-middle-bar]'
            if not MD.eqS(header, '[data-middle-bar]').classList.contains 'collapsed'
              MD.eqS(header, '[data-middle-bar]').classList.add 'collapsed'
          if MD.eqS header, '[data-bottom-bar]'
            if not MD.eqS(header, '[data-bottom-bar]').classList.contains 'collapsed'
              MD.eqS(header, '[data-bottom-bar]').classList.add 'collapsed'

        if direction is 'down'
          if headerPanel.hasAttribute 'data-expand-on-scroll'
            # Expand the header, if it's configured to expand-on-scroll rather
            # than the implicit default of expand-on-fully-scrolled-down.
            MD._expandHeader header
            # Show the middle, and bottom bars.
            MD._showMiddleAndBottomBars header

      # Turn ON a scroll monitor for the content.
      @scrollMonitor content, 'on', onScrolledDown, null, onScrolling
    # Cover
    else if mode is 'cover'
      # Ensure that the 'cover' mode is set on the relevant elements:
      # the content panel,
      contentPanel.setAttribute 'data-mode', 'cover'
      # the content,
      content.setAttribute 'data-mode', 'cover'
      # and the covering content.
      coveringContent.setAttribute 'data-mode', 'cover'
    else
      # We did not find a supported mode. Throw an error.
      throw new Meteor.Error 'Unrecognized header panel mode.'

  ###*
  # Hide the header drop shadow.
  #
  # @param {Object} shadow - the shadow element
  ###
  _hideDropShadow: (shadow) ->
    "use strict"

    if shadow.classList.contains 'show-shadow'
      shadow.classList.remove 'show-shadow'

  ###*
  # Show the header drop shadow.
  #
  # @param {Object} shadow - the shadow element
  ###
  _showDropShadow: (shadow) ->
    "use strict"

    if not shadow.classList.contains 'show-shadow'
      shadow.classList.add 'show-shadow'

  ###*
  # Collapse the header.
  #
  # @param {Object} header - the header element
  ###
  _collapseHeader: (header) ->
    "use strict"

    if not header.classList.contains 'collapsed'
      header.classList.add 'collapsed'

  ###*
  # Expand the header.
  #
  # @param {Object} header - the header element
  ###
  _expandHeader: (header) ->
    "use strict"

    if header.classList.contains 'collapsed'
      header.classList.remove 'collapsed'

  ###*
  # Show the middle and bottom bars.
  #
  # @param {Object} header - the header element
  ###
  _showMiddleAndBottomBars: (header) ->
    "use strict"

    # Show the middle bar.
    if @eqS header, '[data-middle-bar]'
      if @eqS(header, '[data-middle-bar]').classList.contains 'collapsed'
        @eqS(header, '[data-middle-bar]').classList.remove 'collapsed'
    # Show the bottom bar.
    if @eqS header, '[data-bottom-bar]'
      if @eqS(header, '[data-bottom-bar]').classList.contains 'collapsed'
        @eqS(header, '[data-bottom-bar]').classList.remove 'collapsed'

#//////////////////    ON-RENDER CALLBACK FOR MD HEADER    /////////////////////
Template.body.onRendered ->
  "use strict"

  if MD.config.usingHeaderPanel
    MD.initializeHeaderPanelSystem()

