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
   *
   * @param {string} id - the id of the target element of the tooltip
   */
  registerTooltip: function (id) {
    "use strict";
    var self = this;

    if (self.dgEBI(id)) {
      self.dgEBI(id).setAttribute('data-has-tooltip', 'true');
    } else return false;
  },

  /**
   * Pre-position a tooltip, so that its first display is right where it should
   * be.
   *
   * @param {Object} tooltip - the tooltip element
   * @param {string} id - the id of the tooltip target
   */
  positionTooltip: function (tooltip, id) {
    "use strict";
    var self = this;

    var target, targetHeight, targetWidth, targetX, targetY, tooltipPosition,
        tooltipHeight, tooltipWidth, tooltipX, tooltipY, tooltipMarginTop,
        tooltipMarginLeft, tooltipStyle;

    target = self.dgEBI(id);
    targetHeight = target.getBoundingClientRect().height;
    targetWidth = target.getBoundingClientRect().width;
    targetX = target.getBoundingClientRect().left;
    targetY = target.getBoundingClientRect().top;
    tooltipHeight = tooltip.getBoundingClientRect().height;
    tooltipWidth = tooltip.getBoundingClientRect().width;
    tooltipX = tooltip.getBoundingClientRect().left;
    tooltipY = tooltip.getBoundingClientRect().top;
    tooltipPosition = tooltip.getAttribute('data-position');

    // Compute and compose the style that positions the tooltip.
    switch (tooltipPosition) {
      case 'top':
        tooltipMarginTop = - (targetHeight + tooltipHeight + 16);
        if (tooltipWidth >= targetWidth) {
          tooltipMarginLeft =
            targetX - tooltipX - ((tooltipWidth - targetWidth) / 2);
        } else {
          tooltipMarginLeft =
            targetX - tooltipX + ((targetWidth - tooltipWidth) / 2);
        }
        tooltipStyle = 'margin-top: ' + tooltipMarginTop + 'px; ' +
          'margin-left: ' + tooltipMarginLeft + 'px;';
        break;
      case 'bottom':
        tooltipMarginTop = 16;
        if (tooltipWidth >= targetWidth) {
          tooltipMarginLeft =
            targetX - tooltipX - ((tooltipWidth - targetWidth) / 2);
        } else {
          tooltipMarginLeft =
            targetX - tooltipX + ((targetWidth - tooltipWidth) / 2);
        }
        tooltipStyle = 'margin-top: ' + tooltipMarginTop + 'px; ' +
          'margin-left: ' + tooltipMarginLeft + 'px;';
        break;
      case 'left':
        tooltipMarginTop =
          - (tooltipY - (targetY + (targetHeight - tooltipHeight) / 2));
        tooltipMarginLeft = (targetX - tooltipX - tooltipWidth - 16);
        tooltipStyle = 'margin-top: ' + tooltipMarginTop + 'px; ' +
          'margin-left: ' + tooltipMarginLeft + 'px;';
        break;
      case 'right':
        tooltipMarginTop =
          - (tooltipY - (targetY + (targetHeight - tooltipHeight) / 2));
        tooltipMarginLeft = (targetX - tooltipX + targetWidth + 16);
        tooltipStyle = 'margin-top: ' + tooltipMarginTop + 'px; ' +
          'margin-left: ' + tooltipMarginLeft + 'px;';
        break;
    }
    // Apply the style attribute to position the tooltip.
    tooltip.setAttribute('style', tooltipStyle);
  },

  /**
   * Show a tooltip.
   *
   * @param {string} id - the id of the tooltip target.
   */
  showTooltip: function (id) {
    "use strict";
    var self = this;

    // Get the tooltip.
    var tooltip = self.dqS('[data-target=' + id + ']');
    // Reveal the tooltip.
    tooltip.classList.add('show-tooltip');
  },

  /**
   * Hide a tooltip.
   *
   * @param {string} id - the id of the tooltip target.
   */
  hideTooltip: function (id) {
    "use strict";
    var self = this;

    // Get the tooltip.
    var tooltip = self.dqS('[data-target=' + id + ']');
    // Hide the tooltip;
    tooltip.classList.remove('show-tooltip');
  }
});

///////////////////////  EVENT HANDLERS FOR MD TOOLTIP  ////////////////////////
Template.body.events({
  'mouseenter [data-has-tooltip]': function () {
    "use strict";
    var self = this;

    MD.showTooltip(self.id);
  },

  'mouseleave [data-has-tooltip]': function () {
    "use strict";
    var self = this;

    MD.hideTooltip(self.id);
  }
});

//////////////////    ON-RENDER CALLBACK FOR MD TOOLTIP    /////////////////////
Template.mdTooltip.onRendered(function () {
  "use strict";
  var self = this;

  // Register with target element.
  MD.registerTooltip(self.data.target);
  // Pre-position the tooltip.
  MD.positionTooltip(self.firstNode, self.data.target);
  // Add a listener to keep the tooltip positioned when the screen is resized.
  window.onresize = function () {
    "use strict";

    MD.positionTooltip(self.firstNode, self.data.target);
  };
});
