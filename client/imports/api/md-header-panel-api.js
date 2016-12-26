/**
 * @file Defines the API for MD Header Panel
 * @author Derek Gransaull <derek@dgtlife.com>
 * @copyright DGTLife, LLC 2016
 *
 * Created on 11/19/16
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
 * Hide the Bottom bar.
 * @param {Element} header - the Header element
 */
const hideBottomBar = (header) => {
  const bottomBar = eqS(header, '[data-bottom-bar]');
  if (bottomBar) {
    bottomBar.classList.add('collapsed');
  }
};

/**
 * Show the Middle and Bottom bars.
 * @param {Element} header - the Header element
 */
const showMiddleAndBottomBars = (header) => {
  const middleBar = eqS(header, '[data-middle-bar]');
  const bottomBar = eqS(header, '[data-bottom-bar]');

  // Show the Middle bar.
  if (middleBar) {
    middleBar.classList.remove('collapsed');
  }

  // Show the Bottom bar.
  if (bottomBar) {
    bottomBar.classList.remove('collapsed');
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
    const content = eqS(headerPanel, '[data-content]');
    const coveringContent = eqS(content, '[data-covering-content]');

    if (content) {
      // Clear the 'cover' mode from Content.
      content.removeAttribute('data-mode');

      // Reset the scroll status and position of the Content.
      content.removeAttribute('data-scroll-status');
      content.scrollTop = 0;
    }

    if (coveringContent) {
      // Clear the 'cover' mode from Covering Content.
      coveringContent.removeAttribute('data-mode');

      // Reset the scroll status and position of the Covering Content.
      coveringContent.removeAttribute('data-scroll-status');
      coveringContent.scrollTop = 0;
    }

    // Expand the Header, if it is collapsed.
    expandHeader(header);

    // Show the Middle and Bottom bars, if they are in collapsed mode.
    showMiddleAndBottomBars(header);

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
    const content = eqS(headerPanel, '[data-content]');
    const coveringContent = eqS(content, '[data-covering-content]');
    let mode;

    // Get the (current) mode.
    if (headerPanel.hasAttribute('data-mode')) {
      mode = headerPanel.getAttribute('data-mode');
    } else {
      // It's the default mode, which is 'standard'
      mode = 'standard';
    }

    // Standard
    if (mode === 'standard') {
      // Show the Drop Shadow.
      showDropShadow(headerShadow);

      // Seamed
    } else if (mode === 'seamed') {
      // Ensure that the Shadow is hidden.
      hideDropShadow(headerShadow);

      // Scroll
    } else if (mode === 'scroll') {
      // Ensure that the Shadow is hidden.
      hideDropShadow(headerShadow);

      // Ensure that the 'scroll' mode is set on the Content.
      content.setAttribute('data-mode', 'scroll');

      // Waterfall
    } else if (mode === 'waterfall') {
      // Ensure that the Shadow is initially hidden.
      hideDropShadow(headerShadow);

      // Hides the Shadow when the Content is fully scrolled down.
      const onScrolledDown = () => {
        // Ensure that the Shadow is hidden.
        hideDropShadow(headerShadow);
      };

      // Shows the Shadow when the Content is scrolling.
      const onScrolling = () => {
        showDropShadow(headerShadow);
      };

      // Turn ON a Scroll Monitor for the Content.
      scrollMonitor(
        content, 'on', onScrolledDown, null, onScrolling
      );

      // Waterfall-collapse
    } else if (mode === 'waterfall-collapse') {
      /*
       * Expands the Header (if configured) and hides the Shadow when the
       * Content is fully scrolled down.
       */
      const onScrolledDown = () => {
        if (!headerPanel.hasAttribute('data-expand-on-scroll')) {
          // Expand the header.
          expandHeader(header);

          // Show the Middle, and Bottom bars.
          showMiddleAndBottomBars(header);
        }

        // Ensure that the Shadow is hidden.
        hideDropShadow(headerShadow);
      };

      // Shows the Shadow when the Content is scrolling.
      const onScrolling = (direction) => {
        const headerHasTabs = !!eqS(header, '[data-tabs]');

        // Show the Drop Shadow.
        showDropShadow(headerShadow);

        if (direction === 'up') {
          if (headerHasTabs) {
            // Collapse the Header to the Top toolbar and Tab bar.
            collapseHeader(header);

            // Hide the Middle bar only.
            hideMiddleBar(header);
          } else {
            // Collapse the Header to the Top toolbar.
            collapseHeader(header);

            // Hide the Middle, and Bottom bars.
            hideMiddleBar(header);
            hideBottomBar(header);
          }
        }

        if (direction === 'down') {
          if (headerPanel.hasAttribute('data-expand-on-scroll')) {
            /*
             * Expand the Header, if it's configured to expand-on-scroll rather
             * than the implicit default of expand-on-fully-scrolled-down.
             */
            expandHeader(header);

            // Show the Middle, and Bottom bars.
            showMiddleAndBottomBars(header);
          }
        }
      };

      // Turn ON a Scroll Monitor for the Content.
      scrollMonitor(
        content, 'on', onScrolledDown, null, onScrolling
      );

      // Cover
    } else if (mode === 'cover') {
      /*
       * Ensure that the 'cover' mode is set on the relevant elements:
       * the Content, ...
       */
      content.setAttribute('data-mode', 'cover');

      // ... and the Covering Content.
      if (coveringContent) {
        coveringContent.setAttribute('data-mode', 'cover');
      }
    } else {
      // We did not find a supported mode. Throw an error.
      throw new Meteor.Error('Unrecognized Header Panel mode.');
    }
  }
};
