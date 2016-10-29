/**
 * @file Defines the API, event handler(s) and on-render callback for MD Tooltip.
 * @author Derek Gransaull <derek@dgtlife.com>
 * @copyright DGTLife, LLC 2015
 *
 * Created on 10/13/2015
 */

/*jshint -W106 */     // we are not using camelCase for every identifier

//////////////////////    EXTEND MD API FOR MD RADIO    ////////////////////////
_.extend(Material.prototype, {

  /**
   * Register a tooltip with its target element.
   * @param {object} tooltip - the tooltip element
   * @param {string} targetId - the id of the target element of the tooltip
   */
  registerTooltip(tooltip, targetId) {
    "use strict";
    const target = this.dgEBI(targetId);

    function _registerWithTarget(__target) {
      __target.setAttribute('data-has-tooltip', 'true');
    }

    if (target) {
      _registerWithTarget(target);
    } else {
      const selector = '#' + targetId;
      this.waitForElement(document.body, selector, _registerWithTarget, 0);
    }
  },

  /**
   * Position a tooltip for subsequent display.
   *
   * @param {object} tooltip - the tooltip element
   * @param {string} id - the id of the tooltip target
   */
  positionTooltip(tooltip, id) {
    "use strict";
    const target = this.dgEBI(id);
    const targetX = target.getBoundingClientRect().left;
    const targetY = target.getBoundingClientRect().top;
    const targetHeight = target.getBoundingClientRect().height;
    const targetWidth = target.getBoundingClientRect().width;
    const tooltipHeight = tooltip.getBoundingClientRect().height;
    const tooltipWidth = tooltip.getBoundingClientRect().width;
    const tooltipPosition = tooltip.getAttribute('data-position');

    /*
     * Compute the top and left values of the tooltip for fixed positioning,
     * i.e. relative to the viewport origin.
     */
    let tooltipLeft, tooltipTop;

    // Computes the left value for top and bottom positions.
    function _getTooltipLeftForVerticalAlignment() {
      if (tooltipWidth >= targetWidth) {
        tooltipLeft = targetX - ((tooltipWidth - targetWidth) / 2);
      } else {
        tooltipLeft = targetX + ((targetWidth - tooltipWidth) / 2);
      }
      return tooltipLeft;
    }

    // Computes the top value for left and right positions.
    function _getTooltipTopForHorizontalAlignment() {
      if (tooltipHeight <= targetHeight) {
        tooltipTop = targetY + ((targetHeight - tooltipHeight) / 2);
      } else {
        tooltipTop = targetY - ((tooltipHeight - targetHeight) / 2);
      }
      return tooltipTop;
    }

    if ((!tooltipPosition) || (tooltipPosition === 'bottom')) {
      tooltipTop = targetY + targetHeight + 14;
      tooltipLeft = _getTooltipLeftForVerticalAlignment();
    } else if (tooltipPosition === 'top') {
      tooltipTop = targetY - 14 - tooltipHeight;
      tooltipLeft = _getTooltipLeftForVerticalAlignment();
    } else if (tooltipPosition === 'left') {
      tooltipTop = _getTooltipTopForHorizontalAlignment();
      tooltipLeft = targetX - 14 - tooltipWidth;
    } else if (tooltipPosition === 'right') {
      tooltipTop = _getTooltipTopForHorizontalAlignment();
      tooltipLeft = targetX + targetWidth + 14;
    } else {
      return false;
    }

    // Compose the style attribute.
    const tooltipStyle =
      'top: ' + tooltipTop + 'px; ' +
      'left: ' + tooltipLeft + 'px; ' +
      'position: fixed;';

    // Apply the style attribute to position the tooltip.
    tooltip.setAttribute('style', tooltipStyle);
  },

  /**
   * Show a tooltip.
   *
   * @param {string} id - the id of the tooltip target.
   */
  showTooltip(id) {
    "use strict";

    // Get the tooltip.
    const tooltip = this.dqS('[data-target=' + id + ']');

    // Position the tooltip.
    this.positionTooltip(tooltip, id);

    // Reveal the tooltip.
    tooltip.classList.add('show-tooltip');
  },

  /**
   * Hide a tooltip.
   *
   * @param {string} id - the id of the tooltip target.
   */
  hideTooltip(id) {
    "use strict";

    // Get the tooltip.
    const tooltip = this.dqS('[data-target=' + id + ']');

    // Hide the tooltip.
    tooltip.classList.remove('show-tooltip');

    Meteor.setTimeout(function () {
      // Clear the style attribute, after transition delay has passed.
      tooltip.removeAttribute('style');
    }, 160);

  }
});

///////////////////////  EVENT HANDLERS FOR MD TOOLTIP  ////////////////////////
Template.body.events({
  'mouseenter [data-has-tooltip]'() {
    "use strict";
    MD.showTooltip(this.id);
  },

  'mouseleave [data-has-tooltip]'() {
    "use strict";

    // Hide the tooltip after 1.5 seconds.
    Meteor.setTimeout(() => {
      MD.hideTooltip(this.id);
    }, 1500);

  }
});

//////////////////    ON-RENDER CALLBACK FOR MD TOOLTIP    /////////////////////
Template.md_tooltip.onRendered(function () {
  "use strict";

  // Register the tooltip with the target element.
  MD.registerTooltip(this.firstNode, this.data.target);
});
