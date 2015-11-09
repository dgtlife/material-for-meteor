/**
 * @file Defines the event handler(s) and on-render callback for MD Popup Menu.
 * @author Derek Gransaull <derek@dgtlife.com>
 * @copyright DGTLife, LLC 2015
 *
 * Created on 10/13/2015
 */

/*jshint -W106 */     // we are not using camelCase for every identifier

////////////////////    EXTEND MD API FOR MD POPUP MENU    /////////////////////
_.extend(Material.prototype, {
  /**
   * Handle the click on a menu-trigger element.
   *
   * @param {Object} trigger - the trigger element
   * @private
   */
  _handleClickOnMenuTrigger: function (trigger) {
    "use strict";
    var self =this;

    // Get the target popup menu element.
    var menu = self.dqS('#' + trigger.getAttribute('data-trigger-target'));
    if (menu.hasAttribute('data-popup-menu')) {
      // It's a standalone popup menu.
      self._openPopupMenu(menu);
    } else if (menu.hasAttribute('data-dropdown-menu')) {
      // It's a popup menu embedded in a dropdown menu.
      self.toggleDropdownMenu(menu);
    } else
      return false;
  },

  /**
   * Open a popup menu.
   *
   * @param {Object} menu - the menu element
   * @private
   */
  _openPopupMenu: function (menu) {
    "use strict";
    var self = this;

    var position, style, closeThisMenu;

    // Close any open menus.
    self._closeOpenMenus();
    // Get the specified position for the menu from the parent element.
    position = menu.parentElement.getAttribute('data-position');
    // Compose the style that positions the menu.
    switch (position) {
      case 'top-left':
        style = 'bottom: 0; right: 0; display: block;';
        break;
      case 'top-right':
        style = 'bottom: 0; left: 0; display: block;';
        break;
      case 'bottom-left':
        style = 'top: 0; right: 0; display: block;';
        break;
      case 'bottom-right':
        style = 'top: 0; left: 0; display: block;';
        break;
      default:
        style = 'top: 0; right: 0; display: block;';
    }

    // Wait for 100ms before opening the menu; this allows the ripple animation
    // to be partially seen.
    Meteor.setTimeout(function () {
      // Set the style on the menu; it will display automatically.
      menu.setAttribute('style', style);
      // Set an attribute to indicate that the menu is open.
      menu.setAttribute('data-menu-open', 'true');
    }, 100);

    // In the desktop case, this menu automatically closes on 'mouseleave'. For
    // the non-desktop cases, we will attach an event listener for closing the
    // menu with a touch. The following code is inspired by Material Design Lite,
    // menu.js, lines 406 - 417, however, we just wait a tad before attaching
    // the event listener.
    //
    // Define an event handler for the 'click' event listener.
    closeThisMenu = function (event) {
      "use strict";
      event.preventDefault();

      // Close this menu.
      MD._closeMenu(menu);
      // Detach the listener.
      document.removeEventListener('click', closeThisMenu);
    };

    // Attach the event listener.
    Meteor.setTimeout(function () {
      document.addEventListener('click', closeThisMenu);
    }, 0);
  },

  /**
   * Close a popup menu.
   *
   * @param {Object} menu - the menu element
   * @private
   */
  _closeMenu: function (menu) {
    "use strict";

    menu.removeAttribute('style');
    menu.removeAttribute('data-menu-open');
  },

  /**
   * Close any open popup or dropdown menu.
   *
   * @private
   */
  _closeOpenMenus: function () {
    "use strict";
    var self = this;

    var openMenu;

    openMenu = self.dqS('[data-menu-open]');
    if (openMenu) {
      openMenu.removeAttribute('style');
      openMenu.removeAttribute('data-menu-open');
    }
  }
});

////////////////////    EVENT HANDLERS FOR MD POPUP MENU    ////////////////////
Template.md_popup_menu.events({
  // Click a button that triggers a popup/dropdown menu.
  'click [data-popup-trigger], click [data-dropdown-trigger]': function (event) {
    "use strict";
    event.preventDefault();

    var hasRipple = !! MD.eqS(event.currentTarget, '#ripple');
    if (hasRipple) {
      // Wait 50ms so that the ripple animation is partially visible.
      Meteor.setTimeout(function () {
        MD._handleClickOnMenuTrigger(event.currentTarget);
      }, 50);
    } else {
      MD._handleClickOnMenuTrigger(event.currentTarget);
    }
  }
});

///////  EVENT HANDLERS FOR BODY-WIDE ACTIONS RELATED TO MD POPUP MENU  ////////
Template.body.events({
   // Close the popup menu if the mouse moves away without a click.
  'mouseleave [data-popup-menu]': function (event) {
    "use strict";
    event.preventDefault();

    MD._closeMenu(event.currentTarget);
  }
});

////////////////////  ON-RENDER CALLBACK FOR MD POPUP MENU  ////////////////////
Template.md_popup_menu.onRendered(function () {
  "use strict";
  var self = this;

  // Import any menu items for this menu.
  MD._importMenuItems(self.data.menu__id);
});
