###
  @file Defines the API and the on-render callback for MD Drawer
  @author Derek Gransaull <derek@dgtlife.com>
  @copyright DGTLife, LLC 2015

  Created on 12/11/2015
###

#////////////////////    EXTEND MD API FOR MD DRAWER    ////////////////////////
_.extend Material.prototype,

  ###*
  # Set the width and the initial off-screen position of the drawer. Also set
  # the height of any drawer toolbar.
  #
  # @param {string} position - the position (left|right) of the drawer
  ###
  initializeDrawer: (position) ->
    "use strict"

    drawer = @dqS '[data-drawer=' + position + ']'
    headerPanel = @dqS '[data-header-panel]'
    if drawer and headerPanel
      # Register with the header panel.
      if not headerPanel.hasAttribute 'data-with-drawer'
        headerPanel.setAttribute('data-with-drawer', 'true')

      # Set the width of the drawer.
      width = drawer.getAttribute('data-width') or 192
      drawer.style.width = width + 'px'

      # Initialize docked/undocked state of the drawer.
      @_initializeDockedStatus drawer, width, position, headerPanel

      # Initialize drawer/header-panel docking.
      @_initializeDockingListeners drawer, width, position, headerPanel

      # Initialize the drawer-toggle buttons.
      @_initializeDrawerToggles()

      # Initialize a pan-to-open listener/handler for the drawer (for touch
      # screens).
      @_initializePanToOpen drawer, headerPanel
    else
      throw new Meteor.Error 'An MD Drawer requires an MD Header Panel.'

  ###*
  # Initialize the docked/undocked state of the drawer, i.e. dock or undock the
  # drawer based on the screen width and responsive width setting.
  #
  # @param {Object} drawer - the drawer element
  # @param {number} width - the width of the drawer
  # @param {string} position - the position of the drawer
  # @param {Object} headerPanel - the header panel element
  ###
  _initializeDockedStatus: (drawer, width, position, headerPanel) ->
    "use strict"

    responsiveWidth = drawer.getAttribute('data-responsive-width') or 960
    if window.innerWidth < responsiveWidth
      # Undock the drawer.
      @_undockDrawer drawer, width, position, headerPanel
    else
      # Dock the drawer.
      @_dockDrawer drawer, width, position, headerPanel


  ###*
  # Initialize the drawer-to-header-panel docking. This creates media query
  # listeners and handlers to dock/undock the drawer and header panel.
  #
  # @param {Object} drawer - the drawer element
  # @param {number} width - the width of the drawer
  # @param {string} position - the position of the drawer
  # @param {Object} headerPanel - the header panel element
  ###
  _initializeDockingListeners: (drawer, width, position, headerPanel) ->
    "use strict"

    # Create a media query listener for the responsive-width and a handler to
    # control the docking/undocking transitions for this drawer.
    responsiveWidth = drawer.getAttribute('data-responsive-width') or 960
    mediaQueryString = '(min-width: ' + responsiveWidth + 'px)'

    # Define handlers for left and right drawer transitions.
    __handleDocking = (mql) ->
      if mql.matches
        # Dock the drawer.
        MD._dockDrawer drawer, width, position, headerPanel
      else
        # Undock the drawer.
        MD._undockDrawer drawer, width, position, headerPanel

    # Create the media query listener.
    drawerMql = window.matchMedia mediaQueryString
    drawerMql.addListener __handleDocking

  ###*
  # Dock a drawer.
  #
  # @param {Object} drawer - the drawer element
  # @param {number} width - the width of the drawer
  # @param {string} position - the position of the drawer
  # @param {Object} headerPanel - the header panel element
  ###
  _dockDrawer: (drawer, width, position, headerPanel) ->
    "use strict"

    # Compose the padding property for the header panel.
    padding = 'padding-' + position
    drawer.setAttribute 'data-opened', 'true'
    drawer.setAttribute 'data-docked', 'true'
    headerPanel.style[padding] = width + 'px'
    headerPanel.setAttribute 'data-docked-' + position, 'true'

  ###*
  # Undock a drawer.
  #
  # @param {Object} drawer - the drawer element
  # @param {number} width - the width of the drawer
  # @param {string} position - the position of the drawer
  # @param {Object} headerPanel - the header panel element
  ###
  _undockDrawer: (drawer, width, position, headerPanel) ->
    "use strict"

    # Compose the padding property for the header panel.
    padding = 'padding-' + position
    drawer.removeAttribute 'data-opened'
    drawer.removeAttribute 'data-docked'
    headerPanel.style[padding] = '0'
    headerPanel.removeAttribute 'data-docked-' + position

  ###*
  # Initialize the drawer toggle buttons. This attaches an onclick event
  # listener to each drawer-toggle button, if it exists, and defines a handler
  # to toggle the corresponding drawer.
  #
  # @private
  ###
  _initializeDrawerToggles: ->
    "use strict"

    # Define click handlers for the left and right drawer-toggle buttons.
    __toggleLeftDrawer = ->
      MD.toggleDrawer 'left'

    __toggleRightDrawer = ->
      MD.toggleDrawer 'right'

    # Attach click listeners to the drawer-toggle buttons, if they exist.
    if @dqS '[data-drawer-toggle=left]'
      @dqS('[data-drawer-toggle=left]').onclick = __toggleLeftDrawer

    if @dqS '[data-drawer-toggle=right]'
      @dqS('[data-drawer-toggle=right]').onclick = __toggleRightDrawer

  ###*
  # Initialize a listener/handler to open the drawer with a pan gesture. A right
  # pan on the header panel opens the left drawer, while the left pan opens the
  # right drawer.
  #
  # @param {Object} drawer - the drawer element
  # @param {Object} headerPanel - the header panel element
  ###
  _initializePanToOpen: (drawer, headerPanel) ->
    "use strict"

    # Attach an event listener to the header panel for an edge pan to open the
    # drawer, unless we are in iOS Safari in browser mode. In iOS Safari in
    # browser mode a left/right pan/swipe is used for Back/Forward navigation.
    if not (@platform.isSafariOnIos and not window.navigator.standalone)
      # Define a callback to handle the pan.
      __handlePan = (event) ->
        panX = event.center.x
        if (event.type is 'panright') and (panX <= 30)
          MD.openDrawer 'left'
        else if (event.type is 'panleft') and ((window.innerWidth - panX) <= 30)
          MD.openDrawer 'right'

      # Define a listener for the pan.
      headerPanelListener = new Hammer headerPanel
      headerPanelListener.on 'panright panleft', __handlePan

  ###*
  # Open a drawer. Once open, initialize listeners and handlers for closing.
  #
  # @param {string|Object} drawerSpec - the drawer position or the drawer element
  ###
  openDrawer: (drawerSpec) ->
    "use strict"

    drawer = @_computeDrawer drawerSpec
    # If the drawer is docked, do nothing.
    if drawer.hasAttribute('data-docked')
      return false
    # Insert the backdrop.
    @_insertBackdrop 'drawer'
    # Open the drawer.
    drawer.setAttribute 'data-opened', 'true'
    drawer.classList.add 'with-shadow'

    # Define a callback to close the drawer.
    __closeDrawer = ->
      MD.closeDrawer drawer

    # Attach a click listener to the backdrop to close the drawer.
    backdrop = @dqS '[data-backdrop]'
    backdrop.onclick = __closeDrawer

    # Attach a listener to the drawer panel for an edge pan to close the drawer,
    # unless we are in iOS Safari in browser mode. In iOS Safari in browser mode
    # a left/right swipe is used for Back/Forward navigation.
    if not (@platform.isSafariOnIos and not window.navigator.standalone)
      # Define a callback to handle the pan.
      __handlePan = (event) ->
        position = event.target.getAttribute 'data-drawer'
        if (event.type is 'panleft') and (position is 'left')
          MD.closeDrawer('left', true)
        else if (event.type is 'panright') and (position is 'right')
          MD.closeDrawer('right', true)
        else
          return false

      # Define a listener for the pan.
      drawerListener = new Hammer drawer
      drawerListener.on 'panright panleft', __handlePan

  ###*
  # Close a drawer.
  #
  # @param {string|Object} drawerSpec - the drawer position or the drawer element
  # @param {boolean} [keepBackdrop] - TRUE, if the backdrop should be retained,
  #                                   e.g. for a dialog being launched from a
  #                                   menu item on the drawer
  ###
  closeDrawer: (drawerSpec, keepBackdrop) ->
    "use strict"

    drawer = @_computeDrawer drawerSpec
    # If the drawer is docked, do nothing.
    if drawer.hasAttribute('data-docked')
      return false
    drawer.removeAttribute 'data-opened'
    drawer.classList.remove 'with-shadow'
    @_removeBackdrop() unless keepBackdrop


  ###*
  # Compute the drawer element from a drawerSpec.
  #
  # @param {string|Object} drawerSpec - the drawer spec
  ###
  _computeDrawer: (drawerSpec) ->
    "use strict"

    if _.isString drawerSpec
      @dqS '[data-drawer=' + drawerSpec + ']'
    else if _.isObject drawerSpec
      drawerSpec
    else
      throw new Meteor.Error 'drawerSpec must be the position (string) or ' +
          'the drawer element (Object).'

  ###*
  # Toggle a drawer.
  #
  # @param {string} position - the position (left|right) of the drawer
  ###
  toggleDrawer: (position) ->
    "use strict"

    # Check input.
    if (not position is 'left') or (not position is 'right')
      throw new Meteor.Error 'Parameter must be \'left\' or \'right\'.'

    # Get the drawer.
    drawer = @dqS '[data-drawer=' + position + ']'
    # Toggle the drawer state.
    if drawer.hasAttribute 'data-opened'
      @closeDrawer drawer
    else
      @openDrawer drawer

#/////////////////////    EVENT HANDLERS FOR MD DRAWER    //////////////////////


#//////////////////    ON-RENDER CALLBACK FOR MD DRAWER    /////////////////////
Template.md_drawer.onRendered ->
  "use strict"

  # Ensure there is a header panel present.
  if not MD.dqS '[data-header-panel]'
    throw new Meteor.Error 'No header panel found. The drawer requires a header panel.'
  else
    # Initialize the drawer.
    MD.initializeDrawer @data.position
