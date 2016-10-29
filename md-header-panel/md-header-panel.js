/**
 * @file Defines the API and the on-render callback for MD Toolbar
 * @author Derek Gransaull <derek@dgtlife.com>
 * @copyright DGTLife, LLC 2015
 *
 * Created on 12/1/2015
 */

//////////////////////    EXTEND MD API FOR MD HEADER    ////////////////////////
_.extend(Material.prototype, {

  /**
   * Reset the Header Panel, i.e clear the state from the last instantiation.
   */
  resetHeaderPanelSystem() {
    "use strict";
    const headerPanel = this.dqS('[data-header-panel]');
    if (headerPanel) {
      const header = this.eqS(headerPanel, '[data-header]');
      const headerShadow = this.eqS(headerPanel, '[data-header-shadow]');
      const content = this.eqS(headerPanel, '[data-content]');
      const coveringContent = this.eqS(content, '[data-covering-content]');

      if (content) {
        // Clear the 'cover' mode (if it was present) from Content.
        if (content.hasAttribute('data-mode')) {
          content.removeAttribute('data-mode');
        }

        // Reset the scroll status and position of the Content.
        if (content.hasAttribute('data-scroll-status')) {
          content.removeAttribute('data-scroll-status');
        }

        content.scrollTop = 0;
      }

      if (coveringContent) {
        // Clear the 'cover' mode (if it was present) from Covering Content.
        if (coveringContent.hasAttribute('data-mode')) {
          coveringContent.removeAttribute('data-mode');
        }

        // Reset the scroll status and position of the Covering Content.
        if (coveringContent.hasAttribute('data-scroll-status')) {
          coveringContent.removeAttribute('data-scroll-status');
        }

        coveringContent.scrollTop = 0;
      }

      // Expand the Header, if it is collapsed.
      this._expandHeader(header);

      // Show the Middle and Bottom bars, if they are in collapsed mode.
      this._showMiddleAndBottomBars(header);

      // Ensure that the Shadow is hidden.
      this._hideDropShadow(headerShadow);
    }
  },

  /**
   * Initialize the Header Panel based on various configuration settings.
   */
  initializeHeaderPanelSystem() {
    "use strict";
    const headerPanel = this.dqS('[data-header-panel]');
    if (headerPanel) {
      const header = this.eqS(headerPanel, '[data-header]');
      const headerShadow = this.eqS(header, '[data-header-shadow]');
      const content = this.eqS(headerPanel, '[data-content]');
      const coveringContent = this.eqS(content, '[data-covering-content]');
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
        this._showDropShadow(headerShadow);

      // Seamed
      } else if (mode === 'seamed') {
        // Ensure that the Shadow is hidden.
        this._hideDropShadow(headerShadow);

      // Scroll
      } else if (mode === 'scroll')  {
        // Ensure that the Shadow is hidden.
        this._hideDropShadow(headerShadow);

        // Ensure that the 'scroll' mode is set on the Content.
        content.setAttribute('data-mode', 'scroll');

      // Waterfall
      } else if (mode === 'waterfall') {
        // Ensure that the Shadow is initially hidden.
        this._hideDropShadow(headerShadow);

        // A callback to hide the Shadow when the Content is fully scrolled down
        let __onScrolledDown = () => {
          // Ensure that the Shadow is hidden.
          this._hideDropShadow(headerShadow);
        };

        // A callback to show the Shadow when the Content is scrolling.
        let __onScrolling = () => {
          this._showDropShadow(headerShadow);
        };

        // Turn ON a Scroll Monitor for the Content.
        this.scrollMonitor(
          content, 'on', __onScrolledDown, null, __onScrolling
        );

      // Waterfall-collapse
      } else if (mode === 'waterfall-collapse') {
        /*
         * A callback to expand the Header (if configured) and to hide the
         * Shadow when the Content is fully scrolled down.
         */
        let __onScrolledDown = () => {
          if (!headerPanel.hasAttribute('data-expand-on-scroll')) {
            // Expand the header.
            this._expandHeader(header);

            // Show the Middle, and Bottom bars.
            this._showMiddleAndBottomBars(header);
          }

          // Ensure that the Shadow is hidden.
          this._hideDropShadow(headerShadow);
        };

        // A callback to show the Shadow when the Content is scrolling
        let __onScrolling = (direction) => {
          const _headerHasTabs = !!this.eqS(header, '[data-tabs]');

          // Show the Drop Shadow.
          this._showDropShadow(headerShadow);

          if (direction === 'up') {
            if (_headerHasTabs) {
              // Collapse the Header to the Top toolbar and Tab bar.
              this._collapseHeader(header);

              // Hide the Middle bar only.
              this._hideMiddleBar(header);
            } else {
              // Collapse the Header to the Top toolbar.
              this._collapseHeader(header);

              // Hide the Middle, and Bottom bars.
              this._hideMiddleBar(header);
              this._hideBottomBar(header);
            }
          }

          if (direction === 'down') {
            if (headerPanel.hasAttribute('data-expand-on-scroll')) {
              /*
               * Expand the Header, if it's configured to expand-on-scroll
               * rather than the implicit default of
               * expand-on-fully-scrolled-down.
               */
              this._expandHeader(header);

              // Show the Middle, and Bottom bars.
              this._showMiddleAndBottomBars(header);
            }
          }
        };

        // Turn ON a Scroll Monitor for the Content.
        this.scrollMonitor(
          content, 'on', __onScrolledDown, null, __onScrolling
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
    } else {
      return false;
    }
  },

  /**
   * Hide the Header Drop Shadow.
   * @param {Object} shadow - the Shadow element
   */
  _hideDropShadow(shadow) {
    "use strict";
    if (shadow.classList.contains('show-shadow')) {
      shadow.classList.remove('show-shadow');
    }
  },

  /**
   * Show the Header Drop Shadow.
   * @param {Object} shadow - the Shadow element
   */
  _showDropShadow(shadow) {
    "use strict";
    if (!shadow.classList.contains('show-shadow')) {
      shadow.classList.add('show-shadow');
    }
  },

  /**
   * Collapse the Header.
   * @param {Object} header - the Header element
   */
  _collapseHeader(header) {
    "use strict";
    if (!header.classList.contains('collapsed')) {
      header.classList.add('collapsed');
    }
  },

  /**
   * Expand the Header.
   * @param {Object} header - the Header element
   */
  _expandHeader(header) {
    "use strict";
    if (header.classList.contains('collapsed')) {
      header.classList.remove('collapsed');
    }
  },

  /**
   * Hide the Middle bar.
   * @param {Object} header - the Header element
   */
  _hideMiddleBar(header) {
    "use strict";
    const middleBar = this.eqS(header, '[data-middle-bar]');
    if (middleBar) {
      if (!middleBar.classList.contains('collapsed')) {
        middleBar.classList.add('collapsed');
      }
    }
  },

  /**
   * Hide the Bottom bar.
   * @param {Object} header - the Header element
   */
  _hideBottomBar(header) {
    "use strict";
    const bottomBar = this.eqS(header, '[data-bottom-bar]');
    if (bottomBar) {
      if (!bottomBar.classList.contains('collapsed')) {
        bottomBar.classList.add('collapsed');
      }
    }
  },

  /**
   * Show the Middle and Bottom bars.
   * @param {Object} header - the Header element
   */
  _showMiddleAndBottomBars(header) {
    "use strict";
    const middleBar = this.eqS(header, '[data-middle-bar]');
    const bottomBar = this.eqS(header, '[data-bottom-bar]');

    // Show the Middle bar.
    if (middleBar) {
      if (middleBar.classList.contains('collapsed')) {
        middleBar.classList.remove('collapsed');
      }
    }

    // Show the Bottom bar.
    if (bottomBar) {
      if (bottomBar.classList.contains('collapsed')) {
        bottomBar.classList.remove('collapsed');
      }
    }
  }
});

////////////////////    ON-RENDER CALLBACK FOR MD HEADER    /////////////////////
Template.body.onRendered(function () {
  "use strict";
  MD.initializeHeaderPanelSystem();
});


