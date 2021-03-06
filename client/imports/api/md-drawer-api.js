/**
 * @file Defines the API for MD Drawer
 * @author Derek Gransaull <derek@dgtlife.com>
 * @copyright DGTLife, LLC 2016
 */
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { Hammer } from 'meteor/hammer:hammer';
import {
  dgEBI,
  dqS,
  insertBackdrop,
  removeBackdrop,
  platform
} from './md-utils.js';

/**
 * Dock a drawer.
 * @param {Element} drawer - the drawer element
 * @param {number} width - the width of the drawer
 * @param {string} position - the position of the drawer
 * @param {Element} headerPanel - the header panel element
 */
export const dockDrawer = (drawer, width, position, headerPanel) => {
  const _headerPanel = headerPanel;

  // Compose the padding property for the header panel.
  const padding = `padding-${position}`;
  drawer.setAttribute('data-opened', 'true');
  drawer.setAttribute('data-docked', 'true');
  _headerPanel.style[padding] = `${width}px`;
  _headerPanel.setAttribute(`data-docked-${position}`, 'true');
};

/**
 * Undock a drawer.
 * @param {Element} drawer - the drawer element
 * @param {number} width - the width of the drawer
 * @param {string} position - the position of the drawer
 * @param {Element} headerPanel - the header panel element
 */
export const undockDrawer = (drawer, width, position, headerPanel) => {
  const _headerPanel = headerPanel;

  // Compose the padding property for the header panel.
  const padding = `padding-${position}`;
  drawer.removeAttribute('data-opened');
  drawer.removeAttribute('data-docked');
  _headerPanel.style[padding] = '0';
  _headerPanel.removeAttribute(`data-docked-${position}`);
};

/**
 * Initialize the docked/undocked state of the drawer, i.e. dock or undock the
 * drawer based on the screen width and responsive width setting.
 * @param {Element} drawer - the drawer element
 * @param {number} width - the width of the drawer
 * @param {string} position - the position of the drawer
 * @param {Element} headerPanel - the header panel element
 */
const initializeDockedStatus = (drawer, width, position, headerPanel) => {
  const responsiveWidth = drawer.getAttribute('data-responsive-width') || 960;
  if (window.innerWidth < responsiveWidth) {
    // Undock the drawer.
    undockDrawer(drawer, width, position, headerPanel);
  } else {
    // Dock the drawer.
    dockDrawer(drawer, width, position, headerPanel);
  }
};

/**
 * Initialize the drawer-to-header-panel docking. This creates media query
 * listeners and handlers to dock/undock the drawer and header panel.
 * @param {Element} drawer - the drawer element
 * @param {number} width - the width of the drawer
 * @param {string} position - the position of the drawer
 * @param {Element} headerPanel - the header panel element
 */
const initializeDockingListeners = (drawer, width, position, headerPanel) => {
  /*
   * Create a media query listener for the responsive-width and a handler to
   * control the docking/undocking transitions for this drawer.
   */
  const responsiveWidth = drawer.getAttribute('data-responsive-width') || 960;
  const mediaQueryString = `(min-width: ${responsiveWidth}px)`;

  // Define handlers for left and right drawer transitions.
  const handleDocking = (mql) => {
    if (mql.matches) {
      // Dock the drawer.
      dockDrawer(drawer, width, position, headerPanel);
    } else {
      // Undock the drawer.
      undockDrawer(drawer, width, position, headerPanel);
    }
  };

  // Create the media query listener.
  const drawerMql = window.matchMedia(mediaQueryString);
  drawerMql.addListener(handleDocking);
};

/**
 * Compute the drawer element from a drawerSpec.
 * @param {string|Element} drawerSpec - the drawer spec
 */
const getDrawer = (drawerSpec) => {
  if (_.isString(drawerSpec)) {
    return dqS(`[data-drawer=${drawerSpec}]`);
  }

  if (_.isObject(drawerSpec)) {
    return drawerSpec;
  }

  throw new Meteor.Error(
    'drawerSpec must be the position (string) or the drawer element (Node).'
  );
};

/**
 * Close a drawer.
 * @param {string|Element} drawerSpec - the drawer position or the drawer
 *                                      element
 * @param {boolean} [keepBackdrop] - TRUE, if the backdrop should be retained,
 *                                   e.g. for a dialog being launched from a
 *                                   menu item on the drawer.
 */
export const closeDrawer = (drawerSpec, keepBackdrop) => {
  const drawer = getDrawer(drawerSpec);
  if (drawer.hasAttribute('data-docked')) {
    // If the drawer is docked, do nothing.
  } else {
    drawer.removeAttribute('data-opened');
    drawer.classList.remove('with-shadow');
    if (!keepBackdrop) {
      removeBackdrop();
    }
  }
};

/**
 * Open a drawer. Once open, initialize listeners and handlers for closing.
 * @param {string|Element} drawerSpec - the drawer position or the drawer
 *                                      element
 */
export const openDrawer = (drawerSpec) => {
  const drawer = getDrawer(drawerSpec);
  if (drawer.hasAttribute('data-docked')) {
    // If the drawer is docked, do nothing.
  } else {
    // Insert the backdrop.
    insertBackdrop('drawer');

    // Open the drawer.
    drawer.setAttribute('data-opened', 'true');
    drawer.classList.add('with-shadow');

    // Attach a click listener to the backdrop to close the drawer.
    dqS('[data-backdrop]').onclick = function handleClick() {
      if (!this.classList.contains('md-backdrop--modal')) {
        closeDrawer(drawer);
      } else {
        closeDrawer(drawer, true);
      }
    };
  }
};

/**
 * Toggle a drawer.
 * @param {string} position - the position (left|right) of the drawer
 */
export const toggleDrawer = (position) => {
  // Check input.
  if (!((position === 'left') || (position === 'right'))) {
    throw new Meteor.Error('Parameter must be "left" or "right".');
  }

  // Get the drawer.
  const drawer = dqS(`[data-drawer=${position}]`);

  // Toggle the drawer state.
  if (drawer.hasAttribute('data-opened')) {
    closeDrawer(drawer);
  } else {
    openDrawer(drawer);
  }
};

/**
 * Initialize a left drawer-toggle button, by attaching an onclick event
 * listener to the drawer-toggle button, if it exists, and a click handler to
 * toggle the corresponding drawer.
 */
export const initializeLeftDrawerToggle = () => {
  const leftDrawerToggle = dqS('[data-drawer-toggle=left]');
  if (leftDrawerToggle && !leftDrawerToggle.onclick) {
    leftDrawerToggle.onclick = () => toggleDrawer('left');
  }
};

/**
 * Initialize a right drawer-toggle button, by attaching an onclick event
 * listener to the drawer-toggle button, if it exists, and a click handler to
 * toggle the corresponding drawer.
 */
export const initializeRightDrawerToggle = () => {
  const rightDrawerToggle = dqS('[data-drawer-toggle=right]');
  if (rightDrawerToggle && !rightDrawerToggle.onclick) {
    rightDrawerToggle.onclick = () => toggleDrawer('right');
  }
};

/**
 * Initialize drawer-toggle buttons for both drawers.
 */
export const initializeDrawerToggles = () => {
  initializeLeftDrawerToggle();
  initializeRightDrawerToggle();
};

/**
 * Initialize a listener/handler to open the drawer with a pan gesture. A right
 * pan on the header panel opens the left drawer, while the left pan opens the
 * right drawer.
 * @param {Element} targetElement - the element that receives the gesture
 */
const initializePanToOpen = (targetElement) => {
  /*
   * Attach an event listener to the target element (screen container) for edge
   * pans to open the drawers (unless we are in iOS Safari in browser mode.
   * In iOS Safari in browser mode a left/right pan/swipe is used for
   * Back/Forward navigation).
   */
  if (
    (platform.isPhone || platform.isTablet) &&
    !(
      (platform.isSafariOnIphone || platform.isSafariOnIpad) &&
      (!window.navigator.standalone)
    )
  ) {
    const panListener = new Hammer(targetElement);
    panListener.on(
      'panright panleft',
      (event) => {
        const panX = event.center.x;

        // panX !== 0 is needed to mitigate a bug with the event firing position.
        if ((event.type === 'panright') && (panX !== 0) && (panX <= 40)) {
          openDrawer('left');
        }

        if ((event.type === 'panleft') && ((window.innerWidth - panX) <= 40)) {
          openDrawer('right');
        }
      }
    );
  }
};

/**
 * Set the width and the initial off-screen position of the drawer. Also set
 * the height of any drawer toolbar.
 * @param {string} position - the position (left|right) of the drawer
 */
export const initializeDrawer = (position) => {
  const drawer = dqS(`[data-drawer=${position}]`);
  const headerPanel = dqS('[data-header-panel]');
  const screenContainer = dgEBI('__screen-container');
  if (drawer && headerPanel) {
    // Register with the header panel.
    headerPanel.setAttribute('data-with-drawer', 'true');

    // Set the width of the drawer.
    const width = drawer.getAttribute('data-width') || 192;
    drawer.style.width = `${width}px`;

    // Initialize docked/undocked state of the drawer.
    initializeDockedStatus(drawer, width, position, headerPanel);

    // Initialize drawer/header-panel docking.
    initializeDockingListeners(drawer, width, position, headerPanel);

    // Initialize the drawer-toggle buttons.
    initializeDrawerToggles();

    /*
     * Initialize a pan-to-open listener and handler to open drawers on touch
     * devices.
     */
    initializePanToOpen(screenContainer);
  } else {
    throw new Meteor.Error('An MD Drawer requires an MD Header Panel.');
  }
};
