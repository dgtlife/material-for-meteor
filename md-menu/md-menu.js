/**
 * @file Defines the API and event handler(s) for MD Menu.
 * @author Derek Gransaull <derek@dgtlife.com>
 * @copyright DGTLife, LLC 2015
 *
 * Created on 10/13/2015
 */

/*jshint -W106 */     // we are not using camelCase for every identifier

///////////////////////    EXTEND MD API FOR MD MENU    ////////////////////////
_.extend(Material.prototype, {

  /**
   * Import the menu items for the identified menu.
   *
   * @param {string} id - the id of the menu
   */
  importMenuItems: function (id) {
    "use strict";

    const menu = this.dgEBI(id);

    // Look for any node containing menu items for this menu.
    const tempMenuItemContainer = this.dqS('[data-items-for="' + id + '"]');
    if (tempMenuItemContainer) {
      const itemNodes = this.nodeListToArray(tempMenuItemContainer.childNodes);
      _.each(itemNodes, function (itemNode) {
        /*
         * Move each menu item node from its temporary container parent, into
         * the new menu parent.
         */
        menu.appendChild(itemNode);
      });

      // Remove the temporary container.
      tempMenuItemContainer.parentElement.removeChild(tempMenuItemContainer);
    } else
      return false;
  },

  /**
   * Process the selection of a menu item in a menu, i.e. when a user clicks on
   * an item
   *
   * @param {Object} item - the menu item that was clicked or touched
   */
  handleClickOnMenuItem: function (item) {
    "use strict";
    var self = this;

    // Assign the value of the item to its menu.
    self._assignItemValueToMenu(item);

    // ToDo: [keyboard navigation]
    // // Give focus to the selected element, if specified.
    // if (item.getAttribute('data-keyboard-nav'))
    //   item.focus();
  },

  // ToDo: [keyboard navigation] ... if necessary, probably with aria?
  //
  // _handleKeyboardNavigationOfMenu: function (event, menu_item) {
  //   "use strict";
  //   var self = this;
  //   // ToDo: clean up this method.
  //   var menu, menu_items, index, next, previous, nextValue, previousValue;
  //
  //   menu = self.dgEBI(menu_item.menu);
  //   menu_items = self.nodeListToArray(self.eqSA(menu, '[data-menu-item]'));
  //   index = menu_items.indexOf(event.currentTarget);
  //   if (event.which === 40) {
  //     // DOWN key was pressed.
  //     if (index === (menu_items.length - 1)) {
  //       next = 0;
  //     } else {
  //       next = index + 1;
  //     }
  //     nextValue = menu_items[next].getAttribute('data-value');
  //     // Clear the previously selected item.
  //     _.each(menu_items, function (item) {
  //       item.classList.remove('selected');
  //     });
  //     // Attach the '.selected' class to the selected item.
  //     menu_items[next].classList.add('selected');
  //     // Set the "data-selected" value in the corresponding menu element.
  //     menu.setAttribute('data-selected', nextValue);
  //     // Give focus to the selected element.
  //     menu_items[next].focus();
  //   } else if (event.which === 38) {
  //     // UP key was pressed.
  //     if (index === 0) {
  //       previous = menu_items.length - 1;
  //     } else {
  //       previous = index - 1;
  //     }
  //     previousValue = menu_items[previous].getAttribute('data-value');
  //     // Clear the previously selected item.
  //     _.each(menu_items, function (item) {
  //       item.classList.remove('selected');
  //     });
  //     // Attach the '.selected' class to the selected item.
  //     menu_items[previous].classList.add('selected');
  //     // Set the "data-selected" value in the corresponding menu element.
  //     menu.setAttribute('data-selected', previousValue);
  //     // Give focus to the selected element.
  //     menu_items[previous].focus();
  //   } else if (event.which === 27) {
  //     // ESC key was pressed.
  //     event.currentTarget.classList.remove('selected');
  //     event.currentTarget.blur();
  //   } else {
  //     return false;
  //   }
  // },

  /**
   * Assign the value of a selected menu item to its menu, i.e. after the user
   * has clicked on the item.
   *
   * @param {Object} item - the selected menu item
   * @private
   */
  _assignItemValueToMenu: function (item) {
    "use strict";
    var self = this;

    var menu, value;

    menu = self.dgEBI(item.getAttribute('data-menu'));
    value = item.getAttribute('data-value');
    self.setValueOfMenu(menu, value);
  },

  /**
   * Get the menu element from a menuSpec value.
   *
   * @param {string|Object} menuSpec - a selector for the menu element or the
   *                                   menu element itself
   * @private
   */
  _getMenu: function (menuSpec) {
    "use strict";
    var self = this;

    if (_.isString(menuSpec)) {
      return self.dqS(menuSpec);
    } else if (_.isObject(menuSpec)) {
      return menuSpec;
    } else {
      throw new Meteor.Error(
        'menuSpec must be a menu selector (string) or a menu element (Object).'
      );
    }
  },

  /**
   * Set the value of a menu to the supplied value.
   *
   * @param {string|Object} menuSpec - a selector for the menu element or the
   *                                   menu element itself
   * @param {string} value - the value to be assigned to the menu
   */
  setValueOfMenu: function (menuSpec, value) {
    "use strict";
    var self = this;

    var menu, menuItems;

    // Ensure that a non-null value is supplied.
    if (! value)
      throw new Meteor.Error(
        'A value must be supplied; use \'clearValueOfMenu()\' to clear a ' +
        'menu, if desired.'
      );

    // Get the menu.
    menu = self._getMenu(menuSpec);

    // Add the 'selected' class to the selected item and remove the 'selected'
    // class from all other items.
    menuItems = self.eqSA(menu, '[data-menu-item]');
    _.each(menuItems, function (menuItem) {
      if (menuItem.getAttribute('data-value') === value) {
        if (! menuItem.classList.contains('selected'))
          menuItem.classList.add('selected');
      } else {
        if (menuItem.classList.contains('selected'))
          menuItem.classList.remove('selected');
      }
    });

    // Assign the value to the "data-selected" attribute of the menu element.
    menu.setAttribute('data-selected', value);

    // If this menu is embedded in a popup menu, assign the same value to the
    // popup menu element, then close the menu.
    if (menu.hasAttribute('data-popup-menu')) {
      self._assignValueOfPopupMenu(menu, value);
    }

    // If this menu is embedded in a dropdown menu, assign the same value to
    // the input element and the dropdown menu element, then close the menu.
    if (menu.hasAttribute('data-dropdown-menu')) {
      self._assignValueOfDropdownMenu(menu, value);
    }
  },

  /**
   * Get the value of a menu.
   *
   * @param {string} selector - a selector for the menu
   */
  getValueOfMenu: function (selector) {
    "use strict";
    var self = this;

    return self.dqS(selector).getAttribute('data-selected');
  },

  /**
   * Clear a menu, i.e. de-select all items.
   *
   * @param {string|Object} menuSpec - a selector for the menu element or the
   *                                   menu element itself
   */
  clearValueOfMenu: function (menuSpec) {
    "use strict";
    var self = this;

    var menu, menuItems;

    // Get the menu.
    menu = self._getMenu(menuSpec);
    // Remove the 'selected' class from all items in this menu.
    menuItems = self.eqSA(menu, '[data-menu-item]');
    _.each(menuItems, function (item) {
      if (item.classList.contains('selected'))
        item.classList.remove('selected');
    });
    // Remove the "data-selected" attribute from the menu element.
    menu.removeAttribute('data-selected');
  }
});

///////////////////////    EVENT HANDLERS FOR MD MENU    ///////////////////////
Template.md_menu.events({
  // Selection of a menu item with a click.
  'click [data-menu-item]': function (event) {
    "use strict";

    const hasRipple = MD.eqS(event.currentTarget, '[data-ripple]');
    if (hasRipple) {
      // Wait 75ms so that ripple animation is partially visible.
      Meteor.setTimeout(function () {
        MD.handleClickOnMenuItem(event.currentTarget);
      }, 75);
    } else {
      MD.handleClickOnMenuItem(event.currentTarget);
    }
  },

  // Click an list item in List-selector mode.
  'click [data-list-item]'(event) {
    "use strict";
    const listItem = event.currentTarget;
    const indicator = MD.eqS(listItem, '[data-selection-indicator]');
    const menu = listItem.parentElement.parentElement;
    if (listItem.classList.contains('selected')) {
      // Un-select this item.
      listItem.classList.remove('selected');
      indicator.classList.add('unselected');
      menu.removeAttribute('data-selected');
    } else {
      // Clear all items.
      const listItems =
              MD.eqSA(listItem.parentElement, '[data-list-item]');
      _.each(listItems, function (_listItem) {
        const _indicator = MD.eqS(_listItem, '[data-selection-indicator]');
        if (_listItem.classList.contains('selected')) {
          _listItem.classList.remove('selected');
          _indicator.classList.add('unselected');
        }
      });

      // Select the clicked item.
      listItem.classList.add('selected');
      indicator.classList.remove('unselected');
      menu.setAttribute('data-selected', listItem.getAttribute('data-index'));
    }
  }

  // ToDo: [keyboard navigation]
  // // Navigation through the menu items using the keyboard
  // 'keydown [data-menu-item]': function (event) {
  //   "use strict";
  //   var self=this;
  //   event.preventDefault();
  //
  //   MD._handleKeyboardNavigationOfMenu(event, self);
  // }
});

//////////////////////  ON-RENDER CALLBACK FOR MD MENU  ////////////////////////
Template.md_menu.onRendered(function () {
  "use strict";

  // Import any menu items for this menu.
  MD.importMenuItems(this.data.id);

  // Initialize any scrollable container.
  const scrollableContainer = MD.eqS(this.firstNode, '[data-scrollable]');
  if (scrollableContainer) {
    MD.runScroller(scrollableContainer);
  }

  // Initialize any pre-selected list item.
  if (this.firstNode.hasAttribute('data-list-selector')) {
    const selectedIndex = this.firstNode.getAttribute('data-selected');
    if (selectedIndex) {
      // Set the item as selected. ToDo: Add a method for this to the API.
      const selectedItem = MD.eqS(this.firstNode,
        '[data-index="' + selectedIndex + '"]');
      const indicator = MD.eqS(selectedItem, '[data-selection-indicator]');
      selectedItem.classList.add('selected');
      indicator.classList.remove('unselected');
    }
  }
});

