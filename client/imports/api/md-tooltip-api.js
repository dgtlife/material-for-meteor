/**
 * @file Defines the API for MD Tooltip
 * @author Derek Gransaull <derek@dgtlife.com>
 * @copyright DGTLife, LLC 2016
 */
import { Meteor } from 'meteor/meteor';
import { dgEBI, dqS, waitForElement } from './md-utils.js';

const tooltipState = new ReactiveDict;

/**
 * Register a tooltip with its target element.
 * @param {string} targetId - the id of the tooltip target.
 */
export const registerTooltip = (targetId) => {
  const target = dgEBI(targetId);
  const registerWithTarget = (_target) => {
    _target.setAttribute('data-has-tooltip', 'true');
  };

  if (target) {
    registerWithTarget(target);
  } else {
    waitForElement(
      document.body,
      true,
      `#${targetId}`,
      (mutation) => {
        const nodes = mutation.addedNodes;
        return (
          (nodes.length > 0) &&
          (nodes[0].nodeName !== '#text') &&
          (nodes[0].nodeName !== 'svg') &&
          (targetId === nodes[0].id)
        );
      },
      registerWithTarget,
      0
    );
  }
};

/**
 * Position a tooltip for subsequent display.
 * @param {Element} tooltip - the tooltip element
 * @param {string} id - the id of the tooltip target
 */
const positionTooltip = (tooltip, id) => {
  const target = dgEBI(id);
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
  let tooltipLeft;
  let tooltipTop;

  // Computes the left value for top and bottom positions.
  const getTooltipLeftForVerticalAlignment = () => {
    if (tooltipWidth >= targetWidth) {
      tooltipLeft = targetX - ((tooltipWidth - targetWidth) / 2);
    } else {
      tooltipLeft = targetX + ((targetWidth - tooltipWidth) / 2);
    }
    return tooltipLeft;
  };

  // Computes the top value for left and right positions.
  const getTooltipTopForHorizontalAlignment = () => {
    if (tooltipHeight <= targetHeight) {
      tooltipTop = targetY + ((targetHeight - tooltipHeight) / 2);
    } else {
      tooltipTop = targetY - ((tooltipHeight - targetHeight) / 2);
    }
    return tooltipTop;
  };

  if ((!tooltipPosition) || (tooltipPosition === 'bottom')) {
    tooltipTop = targetY + targetHeight + 14;
    tooltipLeft = getTooltipLeftForVerticalAlignment();
  } else if (tooltipPosition === 'top') {
    tooltipTop = targetY - 14 - tooltipHeight;
    tooltipLeft = getTooltipLeftForVerticalAlignment();
  } else if (tooltipPosition === 'left') {
    tooltipTop = getTooltipTopForHorizontalAlignment();
    tooltipLeft = targetX - 14 - tooltipWidth;
  } else if (tooltipPosition === 'right') {
    tooltipTop = getTooltipTopForHorizontalAlignment();
    tooltipLeft = targetX + targetWidth + 14;
  } else {
    throw new Meteor.Error('Invalid or no position provided for tooltip');
  }

  // Compose the style attribute.
  const tooltipStyle =
          `top: ${tooltipTop}px; 
           left: ${tooltipLeft}px; 
           position: fixed;`;

  // Apply the style attribute to position the tooltip.
  tooltip.setAttribute('style', tooltipStyle);
};

/**
 * Show a tooltip.
 * @param {string} id - the id of the tooltip target.
 */
export const showTooltip = (id) => {
  // Get the tooltip.
  const tooltip = dqS(`[data-target=${id}]`);
  // Position the tooltip.
  positionTooltip(tooltip, id);

  // Engage a 'hover-intent' mechanism
  tooltipState.set(id, 'pending');
  Meteor.setTimeout(() => {
    if (tooltipState.get(id) === 'pending') {
      // Reveal the tooltip.
      tooltip.classList.add('show-tooltip');

      // Update the state.
      tooltipState.set(id, 'displayed');
    }
  }, 300);
};

/**
 * Hide a tooltip, if it has been displayed.
 * @param {string} id - the id of the tooltip target.
 */
export const hideTooltip = (id) => {
  const state = tooltipState.get(id);
  const tooltip = dqS(`[data-target=${id}]`);
  if (state === 'pending') {
    // Don't let it display.
    tooltipState.set(id, 'cancelled');
    tooltip.removeAttribute('style');
    delete tooltipState.keys[id];
  }

  if (state === 'displayed') {
    // Hide after 1.5 seconds.
    Meteor.setTimeout(() => {
      // Clear tooltip state.
      delete tooltipState.keys[id];

      // Hide the tooltip, if it has not been destroyed by a screen transition.
      if (tooltip) {
        tooltip.classList.remove('show-tooltip');

        // Clear the style attribute, after transition delay has passed.
        Meteor.setTimeout(() => tooltip.removeAttribute('style'), 160);
      }
    }, 1500);
  }
};

/**
 * Dismiss (hide immediately) a tooltip.
 * @param {String} id - the id of the tooltip target.
 */
export const dismissTooltip = (id) => {
  const tooltip = dqS(`[data-target=${id}]`);
  if (tooltip) {
    tooltip.classList.remove('show-tooltip');
  }
};
