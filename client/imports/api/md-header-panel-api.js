/**
 * @file Defines the API for MD Header Panel
 * @author Derek Gransaull <derek@dgtlife.com>
 * @copyright DGTLife, LLC 2016
 */
import { Meteor } from 'meteor/meteor';
import { dqS, eqS, scrollMonitor } from './md-utils.js';

/**
 * Show the Header Drop Shadow.
 * @param {Element} shadow - the Shadow element
 */
const showDropShadow = shadow => shadow.classList.add('show-shadow');

/**
 * Hide the Header Drop Shadow.
 * @param {Element} shadow - the Shadow element
 */
const hideDropShadow = shadow => shadow.classList.remove('show-shadow');

/**
 * Collapse the Header.
 * @param {Element} header - the Header element
 */
const collapseHeader = header => header.classList.add('collapsed');

/**
 * Expand the Header.
 * @param {Element} header - the Header element
 */
const expandHeader = header => header.classList.remove('collapsed');

/**
 * Hide the Middle bar.
 * @param {Element} header - the Header element
 */
const hideMiddleBar = (header) => {
  const middleBar = eqS(header, '[data-middle-bar]');
  if (middleBar) {
    middleBar.classList.add('collapsed');
  }
};

/**
 * Show the Middle bar.
 * @param {Element} header - the Header element
 */
const showMiddleBar = (header) => {
  const middleBar = eqS(header, '[data-middle-bar]');
  if (middleBar) {
    middleBar.classList.remove('collapsed');
  }
};

/**
 * Reset the Header Panel, i.e clear the state from the last instantiation.
 */
export const resetHeaderPanelSystem = () => {
  const headerPanel = dqS('[data-header-panel]');
  if (headerPanel) {
    const header = eqS(headerPanel, '[data-header]');
    const headerShadow = eqS(headerPanel, '[data-header-shadow]');
    const contentPanel = eqS(headerPanel, '[data-content-panel]');
    const contentContainer = eqS(headerPanel, '[data-content-container]');
    const content = eqS(headerPanel, '[data-content]');

    // Clear the existing mode from all relevant elements.
    content.removeAttribute('data-mode');
    contentContainer.removeAttribute('data-mode');
    contentPanel.removeAttribute('data-mode');
    headerPanel.removeAttribute('data-mode');

    // Reset the scroll status and position of the Content.
    contentContainer.removeAttribute('data-scroll-status');
    contentContainer.scrollTop = 0;

    // Turn OFF the Scroll Monitor for the Content.
    scrollMonitor(contentContainer, 'off', null, null, null);

    // Expand the Header.
    expandHeader(header);

    // Ensure that the Shadow is hidden.
    hideDropShadow(headerShadow);
  }
};

/**
 * Initialize the Header Panel based on various configuration settings.
 */
export const initializeHeaderPanelSystem = () => {
  const headerPanel = dqS('[data-header-panel]');
  if (headerPanel) {
    const header = eqS(headerPanel, '[data-header]');
    const headerShadow = eqS(header, '[data-header-shadow]');
    const contentPanel = eqS(headerPanel, '[data-content-panel]');
    const contentContainer = eqS(headerPanel, '[data-content-container]');
    const content = eqS(headerPanel, '[data-content]');
    let mode;

    // Get the (current) mode.
    if (headerPanel.hasAttribute('data-mode')) {
      mode = headerPanel.getAttribute('data-mode');
    } else {
      // It's the default mode.
      mode = 'standard';
    }

    // Ensure the mode is set on all other relevant elements.
    contentPanel.setAttribute('data-mode', mode);
    contentContainer.setAttribute('data-mode', mode);
    content.setAttribute('data-mode', mode);

    // Process the mode.
    if (mode === 'standard') {
      // Standard: show the Drop Shadow.
      showDropShadow(headerShadow);
    } else if (mode === 'seamed') {
      // Seamed: ensure that the Drop Shadow is hidden.
      hideDropShadow(headerShadow);
    } else if (mode === 'scroll') {
      // Scroll: ensure that the Drop Shadow is hidden.
      hideDropShadow(headerShadow);
    } else if (mode === 'waterfall') {
      // Waterfall: ensure that the Drop Shadow is initially hidden.
      hideDropShadow(headerShadow);

      // Hides the Drop Shadow when the Content is fully scrolled up.
      const onScrolledUp = () => {
        hideDropShadow(headerShadow);
      };

      // Shows the Drop Shadow when the Content is scrolling.
      const onScrolling = () => {
        showDropShadow(headerShadow);
      };

      // Turn ON a Scroll Monitor for the Content.
      scrollMonitor(
        contentContainer, 'on', onScrolledUp, null, onScrolling
      );
    } else if (mode === 'waterfall-collapse') {
      /*
       * Waterfall-collapse: collapses the Header on scrolling down, and expands
       * the Header (if so configured) only when the Content is fully scrolled
       * up.
       */

      // Handles up/down scrolling.
      const onScrolling = (direction) => {
        // Show the Drop Shadow.
        showDropShadow(headerShadow);

        if (direction === 'down') {
          // Collapse the Header to the Top toolbar and Tab bar.
          collapseHeader(header);
          hideMiddleBar(header);
        }

        if ((direction === 'up') &&
          (headerPanel.hasAttribute('data-expand-on-scroll'))) {
          /*
           * The Header is configured to expand-on-scroll (rather than the
           * default of expand-on-fully-scrolled-up).
           */
          expandHeader(header);
        }
      };

      // Handles the fully scrolled up position.
      const onScrolledUp = () => {
        if (!headerPanel.hasAttribute('data-expand-on-scroll')) {
          // Expand the Header.
          expandHeader(header);
          showMiddleBar(header);
        }

        // Ensure that the Shadow is hidden.
        hideDropShadow(headerShadow);
      };

      // Turn ON a Scroll Monitor for the Content Container.
      scrollMonitor(
        contentContainer, 'on', onScrolledUp, null, onScrolling
      );

      // Cover
    } else if (mode === 'cover') {
      // Ensure that the 'cover' mode is set on the Content.
      content.setAttribute('data-mode', 'cover');
    } else {
      // We did not find a supported mode. Throw an error.
      throw new Meteor.Error('Unrecognized Header Panel mode.');
    }
  }
};
