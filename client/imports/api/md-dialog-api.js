/**
 * @file Defines the API for MD Dialog
 * @author Derek Gransaull <derek@dgtlife.com>
 * @copyright DGTLife, LLC 2016
 *
 * Created on 11/23/16
 */
import { _ } from 'meteor/underscore';
import {
  dgEBI,
  dqS,
  eqS,
  getElement,
  scrollMonitor,
  runScroller,
  insertBackdrop,
  removeBackdrop
} from './md-utils.js';

/**
 * Import the content for the identified dialog.
 * @param {string} id - the id of the dialog
 */
export const importDialogContent = (id) => {
  const dialogContainer = eqS(dgEBI(id), '[data-dialog-container]');

  // Look for any node containing content for this dialog.
  const tempContentContainer = dqS(`[data-content-for="${id}"]`);
  if (tempContentContainer) {
    const contentNodes = Array.from(tempContentContainer.childNodes);
    _.each(contentNodes, (contentNode) => {
      /*
       * Move each content node from its temporary container parent, into the
       * new dialog parent.
       */
      dialogContainer.appendChild(contentNode);
    });

    // Remove the temporary container.
    tempContentContainer.parentElement.removeChild(tempContentContainer);
  }
};

/**
 * Compute and set the size and position of the dialog via its style attribute.
 * @param {Element} dialog - the dialog element
 */
const setDialogSizeAndPosition = (dialog) => {
  // Assign the dialog width. Use the specified width, if provided.
  let dialogWidth;
  if (dialog.hasAttribute('data-width')) {
    dialogWidth = dialog.getAttribute('data-width');

    // Do not exceed maximum width.
    if (dialogWidth > (window.innerWidth - 80)) {
      dialogWidth = window.innerWidth - 80;
    }
  } else {
    // Default width.
    dialogWidth = window.innerWidth - 80;
  }

  // Assign the horizontal position.
  const left = (window.innerWidth - dialogWidth) / 2;

  // Get/assign the dialog height.
  let dialogHeight;
  let dialogStyle;
  if (dialog.hasAttribute('data-height')) {
    dialogHeight = dialog.getAttribute('data-height');
  } else {
    dialogStyle = `opacity: 0;
                   display: block;
                   height: auto;
                   width: ${dialogWidth}px;`;

    // Style the dialog so that it's 'natural' height can be obtained.
    dialog.setAttribute('style', dialogStyle);
    dialogHeight = dialog.getBoundingClientRect().height;
  }

  // Do not exceed maximum height.
  if (dialogHeight > (window.innerHeight - 48)) {
    dialogHeight = window.innerHeight - 48;
  }

  // Assign the vertical position.
  const top = (window.innerHeight - dialogHeight) / 2;

  // Set the final position of the dialog.
  dialogStyle = `height: auto;
                 width: ${dialogWidth}px;
                 top: ${top}px;
                 left: ${left}px;`;
  dialog.setAttribute('style', dialogStyle);
};

/**
 * Maintain the relative size and positioning of the dialog as the screen is
 * resized.
 * @param {Element} dialog - the dialog element
 * @param {string} state - the state (on|off) of the resize monitor
 */
const sizeAndPositionMonitor = (dialog, state) => {
  const resizeHandler = () => {
    if (dialog.hasAttribute('data-dialog-open')) {
      setDialogSizeAndPosition(dialog);
    }
  };

  if (state === 'on') {
    window.addEventListener('resize', resizeHandler);
  } else {
    // [Currently, this technique does not remove the listener]
    // ToDo: try some other method of listener removal.
    window.removeEventListener('resize', resizeHandler);
  }
};

/**
 * Close any open dialog, regardless of how it may have remained open.
 */
export const closeAnyOpenDialog = () => {
  const openDialog = dqS('[data-dialog-open]');
  if (openDialog) {
    openDialog.removeAttribute('data-dialog-open');
    openDialog.removeAttribute('style');
    removeBackdrop();
    sizeAndPositionMonitor(openDialog, 'off');
  }
};

/**
 * Close a dialog.
 * @param {(string|Element)} dialogSpec - a selector for the dialog element or
 *                                        the dialog element itself
 */
export const closeDialog = (dialogSpec) => {
  const dialog = getElement(dialogSpec);
  if (dialog.hasAttribute('data-dialog-open')) {
    /*
     * It's open; so we can actually close it. Put all animation-independent
     * closing tasks in a function, so that they can be executed in either case.
     */
    const closeThisDialog = () => {
      // Remove the backdrop.
      removeBackdrop();

      // Remove the 'open' attribute.
      dialog.removeAttribute('data-dialog-open');

      // Remove the size and position styles.
      dialog.removeAttribute('style');

      // Turn OFF the size and position monitor. [currently ignore by ]
      sizeAndPositionMonitor(dialog, 'off');

      // If it's a scrollable dialog turn OFF the scroll monitor.
      const scrollableElement = eqS(dialog, '.md-dialog__content-to-scroll');
      if (scrollableElement) {
        scrollMonitor(scrollableElement, 'off');
      }
    };

    // Account for any animation.
    if (dialog.hasAttribute('data-closing-animation')) {
      // We are closing with animation.
      dialog.setAttribute('data-closing', 'true');

      // The array of names for the animation-end event in browsers .
      const eventNames = [
        'animationend',
        'webkitAnimationEnd',
        'mozAnimationEnd'
      ];

      // Continues the closing process after the animation has ended.
      const onAnimationEnd = () => {
        // Turn OFF the closing animation.
        dialog.removeAttribute('data-closing');

        // Execute the closing tasks.
        closeThisDialog();

        // Remove the event listener.
        _.each(eventNames, eventName =>
          dialog.removeEventListener(eventName, onAnimationEnd));
      };

      // Set up event listeners for the end of the closing animation.
      _.each(eventNames, eventName =>
        dialog.addEventListener(eventName, onAnimationEnd));
    } else {
      // There will be no animation. Just close.
      closeThisDialog();
    }
  }
};

/**
 * Attach a listener to the backdrop to close the dialog when the former is
 * clicked.
 * @param {Element} dialog - the dialog element
 */
const attachAutoCloseListener = (dialog) => {
  // Define an event handler to close the dialog in the non-modal cases.
  const closeThisDialog = () => closeDialog(dialog);

  // Unless it's a modal, attach the 'click' listener.
  if (!dialog.hasAttribute('data-modal')) {
    dqS('[data-backdrop]').onclick = closeThisDialog;
  }
};

/**
 * Open a dialog.
 * @param {(string|Element)} dialogSpec - a selector for the dialog element or
 *                                        the dialog element itself
 */
export const openDialog = (dialogSpec) => {
  // Get the dialog element.
  const dialog = getElement(dialogSpec);

  if (dialog.hasAttribute('data-dialog-open')) {
    // It's already open; do nothing.
  } else {
    // Close any open dialog(s).
    closeAnyOpenDialog();

    // Set the size and position of the dialog.
    setDialogSizeAndPosition(dialog);

    // Insert the backdrop.
    let backdropType = 'default';
    if (dialog.hasAttribute('data-modal')) {
      backdropType = 'modal dialog';
    }

    let backdropOpacity = 0;
    if (dialog.hasAttribute('data-backdrop-opacity')) {
      backdropOpacity = dialog.getAttribute('data-backdrop-opacity');
    }

    insertBackdrop(backdropType, backdropOpacity);

    // Add animation attribute and post-animation handler, if necessary.
    if (dialog.hasAttribute('data-opening-animation')) {
      // We are closing with animation.
      dialog.setAttribute('data-opening', 'true');

      // The array of names for the animation-end event in browsers.
      const eventNames = [
        'animationend',
        'webkitAnimationEnd',
        'mozAnimationEnd'
      ];

      /*
       * Removes the 'data-opening' attribute after the opening animation has
       * ended.
       * @param {object} event - the animation-end event
       */
      const onAnimationEnd = () => {
        // Turn OFF the opening animation.
        dialog.removeAttribute('data-opening');

        // Remove the event listeners.
        _.each(eventNames, eventName =>
          dialog.removeEventListener(eventName, onAnimationEnd));
      };

      // Set up event listeners for the end of the opening animation.
      _.each(eventNames, eventName =>
        dialog.addEventListener(eventName, onAnimationEnd));
    } else {
      // There will be no animation.
      dialog.setAttribute('data-no-opening-animation', 'true');
    }

    /*
     * Show the dialog by setting the 'data-dialog-open' attribute (this is the
     * master switch that makes everything happen).
     */
    dialog.setAttribute('data-dialog-open', 'true');

    /*
     * If it's a scrollable dialog, initialize the scroller, then turn ON the
     * scroll monitor.
     */
    const scrollableElement = eqS(dialog, '.md-dialog__content-to-scroll');
    if (scrollableElement) {
      runScroller(scrollableElement);
    }

    // Turn ON the size and position monitor.
    sizeAndPositionMonitor(dialog, 'on');

    // Attach the auto-close listener.
    attachAutoCloseListener(dialog);
  }
};

/**
 * Reposition/refit a dialog (on demand) after its width and or height have
 * been altered.
 * @param {(string|Element)} dialogSpec - a selector for the dialog element or
 *                                        the dialog element itself
 */
export const refitDialog = dialogSpec =>
  setDialogSizeAndPosition(getElement(dialogSpec));

/**
 * Check whether a dialog is open.
 * @param {(string|Element)} dialogSpec - a selector for the dialog element or
 *                                        the dialog element itself
 */
export const isDialogOpen = dialogSpec =>
  getElement(dialogSpec).hasAttribute('data-dialog-open');

/**
 * Check whether a dialog is closed.
 * @param {(string|Element)} dialogSpec - a selector for the dialog element or
 *                                        the dialog element itself
 */
export const isDialogClosed = dialogSpec =>
  !getElement(dialogSpec).hasAttribute('data-dialog-open');

/**
 * Open the full-screen dialog (mobile only).
 */
export const openDialogFs = () =>
  dqS('[data-dialog-fs]').setAttribute('data-dialog-open', 'true');

/**
 * Close the full-screen dialog (mobile only).
 */
export const closeDialogFs = () =>
  dqS('[data-dialog-fs]').removeAttribute('data-dialog-open');

/**
 * Open the full-screen dialog (mobile only).
 */
export const isDialogFsOpen = () =>
  dqS('[data-dialog-fs]').hasAttribute('data-dialog-open');
