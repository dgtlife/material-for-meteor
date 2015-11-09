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
   * @param {string} id - the HTML id of the target element
   */
  registerTooltip: function (id) {
    "use strict";
    var self = this;

    if (self.dqS('#' + id)) {
      self.dqS('#' + id).setAttribute('data-has-tooltip', 'true');
    } else return false;
  },

  /**
   * Show a tooltip.
   *
   * @param {Object} target - the target element of the tooltip
   */
  showTooltip: function (target) {
    "use strict";
    var self = this;

    var targetHeight, targetWidth, targetX, targetY, tooltip, tooltipPosition,
        tooltipHeight, tooltipWidth, tooltipX, tooltipY, tooltipMarginTop,
        tooltipMarginLeft, tooltipStyle;

    targetHeight = target.getBoundingClientRect().height;
    targetWidth = target.getBoundingClientRect().width;
    targetX = target.getBoundingClientRect().left;
    targetY = target.getBoundingClientRect().top;
    tooltip = self.dqS('[data-target=' + target.id + ']');
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
    // Reveal the tooltip.
    tooltip.classList.add('show-tooltip');
  },

  /**
   * Hide a tooltip.
   *
   * @param {string} id - the HTML id of the tooltip.
   */
  hideTooltip: function (id) {
    "use strict";
    var self = this;

    var tooltip;

    tooltip = self.dqS('[data-target=' + id + ']');
    // Hide the tooltip;
    tooltip.classList.remove('show-tooltip');
    // Remove the 'style' attribute that positioned the tooltip.
    tooltip.removeAttribute('style');
  }
});

///////////////////////  EVENT HANDLERS FOR MD TOOLTIP  ////////////////////////
Template.body.events({
  'mouseenter [data-has-tooltip=true]': function (event) {
    "use strict";
    event.preventDefault();

    MD.showTooltip(event.currentTarget);
  },

  'mouseleave [data-has-tooltip=true]': function (event) {
    "use strict";
    event.preventDefault();
    var self = this;

    MD.hideTooltip(self.id);
  }
});

//////////////////    ON-RENDER CALLBACK FOR MD TOOLTIP    /////////////////////
Template.md_tooltip.onRendered(function () {
  "use strict";
  var self = this;

  // Register with target element.
  MD.registerTooltip(self.data.target);
});
