/**
 * @file Defines the API and the on-render callback for MD Toolbar
 * @author Derek Gransaull <derek@dgtlife.com>
 * @copyright DGTLife, LLC 2015
 *
 * Created on 12/1/2015
 */

/////////////////////    EXTEND MD API FOR MD TOOLBAR    ///////////////////////
_.extend(Material.prototype, {
  /**
   * Import the content for the identified toolbar.
   * @param {string} id - the id of the toolbar
   */
  importToolbarContent(id) {
    "use strict";
    const toolbar = this.dgEBI(id);

    // Look for any DIV nodes containing content for this toolbar.
    const numberOfContentDivs =
            this.dqSA('[data-content-for-toolbar="' + id + '"]').length;
    if (numberOfContentDivs === 0) {
      throw new Meteor.Error('Content for toolbar "' + id + '" not found.');
    } else if (numberOfContentDivs === 1) {
      // The content goes in the Top bar.
      const topBarContentDiv =
              this.dqS('[data-content-for-toolbar="' + id + '"]');
      const contentNodes = this.nodeListToArray(topBarContentDiv.childNodes);
      _.each(contentNodes, (contentNode) => {
        /*
         * Move each content node from its temporary parent DIV, into the new
         * toolbar Top bar parent.
         */
        this.eqS(toolbar, '[data-top-bar]').appendChild(contentNode);
      });

      // Remove the temporary Top bar content div.
      topBarContentDiv.parentElement.removeChild(topBarContentDiv);
    } else {
      // Each content div's content goes in the specified bar.
      const contentDivs = this.dqSA('[data-content-for-toolbar="' + id + '"]');
      _.each(contentDivs, (contentDiv) => {
        const position = contentDiv.getAttribute('data-bar');
        const toolbarBar = this.eqS(toolbar, '[data-' + position + '-bar]');
        const contentNodes = this.nodeListToArray(contentDiv.childNodes);
        _.each(contentNodes, function (contentNode) {
          /*
           * Move each content node from its temporary parent DIV, into the new
           * toolbar bar parent.
           */
          toolbarBar.appendChild(contentNode);
        });

        // Remove the temporary bar content div.
        contentDiv.parentElement.removeChild(contentDiv);

        // Set any justification styles.
        if (toolbar.hasAttribute('data-' + position + '-justify')) {
          const justification =
                  toolbar.getAttribute('data-' + position + '-justify');
          toolbarBar.classList.add(justification + '-justified');
        }
      });
    }
  },

  /**
   * Check whether the Toolbar contains Tabs (in the Bottom bar), and
   * add/remove the relevant classes.
   * @param {string|Object} toolbarSpec - a selector for the toolbar or the
   *                                      toolbar element itself
   */
  detectTabs(toolbarSpec) {
    "use strict";
    const toolbar = this._getElement(toolbarSpec);
    const bottomBar = this.eqS(toolbar, '[data-bottom-bar]');
    const hasTabs = this.eqS(bottomBar, '[data-tabs]');
    if (hasTabs) {
      // Add the has-tabs class to the Toolbar, if necessary.
      if (! toolbar.classList.contains('has-tabs')) {
        toolbar.classList.add('has-tabs');
      }

      // Add the has-tabs class to the Bottom bar, if necessary.
      if (! bottomBar.classList.contains('has-tabs')) {
        bottomBar.classList.add('has-tabs');
      }

      // Remove the collapsed class from the Bottom bar, if necessary.
      if (bottomBar.classList.contains('collapsed')) {
        bottomBar.classList.remove('collapsed');
      }
    } else {
      // Remove the has-tabs class from the Toolbar, if necessary.
      if (toolbar.classList.contains('has-tabs')) {
        toolbar.classList.remove('has-tabs');
      }

      // Remove the has-tabs class to the Bottom bar, if necessary.
      if (bottomBar.classList.contains('has-tabs')) {
        bottomBar.classList.remove('has-tabs');
      }
    }
  }
});

///////////////////    ON-RENDER CALLBACK FOR MD TOOLBAR    ////////////////////
Template.md_toolbar.onRendered(function () {
  "use strict";
  if ((! this.data.use_bar_templates) && (! this.data.content)) {
    // Import the content for this toolbar
    MD.importToolbarContent(this.data.id);
  }
});

