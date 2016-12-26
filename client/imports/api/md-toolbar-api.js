/**
 * @file Defines the API for MD Toolbar
 * @author Derek Gransaull <derek@dgtlife.com>
 * @copyright DGTLife, LLC 2016
 *
 * Created on 11/20/16
 */
import { _ } from 'meteor/underscore';
import { dgEBI, dqS, dqSA, eqS, getElement } from './md-utils.js';

/**
 * Import the content for the identified toolbar.
 * @param {string} id - the id of the toolbar
 */
export const importToolbarContent = (id) => {
  const toolbar = dgEBI(id);

  // Look for any DIV nodes containing content for this toolbar.
  const numberOfContentDivs = dqSA(`[data-content-for-toolbar="${id}"]`).length;
  if (numberOfContentDivs === 0) {
    throw new Meteor.Error(`Content for toolbar "${id}" not found.`);
  } else if (numberOfContentDivs === 1) {
    // The content goes in the Top bar.
    const topBarContentDiv = dqS(`[data-content-for-toolbar="${id}"]`);
    const contentNodes = Array.from(topBarContentDiv.childNodes);
    _.each(contentNodes, (contentNode) => {
      /*
       * Move each content node from its temporary parent DIV, into the new
       * toolbar Top bar parent.
       */
      eqS(toolbar, '[data-top-bar]').appendChild(contentNode);
    });

    // Remove the temporary Top bar content div.
    topBarContentDiv.parentElement.removeChild(topBarContentDiv);
  } else {
    // Each content div's content goes in the specified bar.
    const contentDivs = dqSA(`[data-content-for-toolbar="${id}"]`);
    _.each(contentDivs, (contentDiv) => {
      const position = contentDiv.getAttribute('data-bar');
      const toolbarBar = eqS(toolbar, `[data-${position}-bar]`);
      const contentNodes = Array.from(contentDiv.childNodes);
      _.each(contentNodes, (contentNode) => {
        /*
         * Move each content node from its temporary parent DIV, into the new
         * toolbar bar parent.
         */
        toolbarBar.appendChild(contentNode);
      });

      // Remove the temporary bar content div.
      contentDiv.parentElement.removeChild(contentDiv);

      // Set any justification styles.
      if (toolbar.hasAttribute(`data-${position}-justify`)) {
        const justification =
                toolbar.getAttribute(`data-${position}-justify`);
        toolbarBar.classList.add(`${justification}-justified`);
      }
    });
  }
};

/**
 * Check whether the Toolbar contains Tabs (in the Bottom bar), and
 * add/remove the relevant classes.
 * @param {string|Element} toolbarSpec - a selector for the toolbar or the
 *                                       toolbar element itself
 */
export const detectTabs = (toolbarSpec) => {
  const toolbar = getElement(toolbarSpec);
  const bottomBar = eqS(toolbar, '[data-bottom-bar]');
  const hasTabs = eqS(bottomBar, '[data-tabs]');
  if (hasTabs) {
    // Add the has-tabs class to the Toolbar.
    toolbar.classList.add('has-tabs');

    // Add the has-tabs class to the Bottom bar.
    bottomBar.classList.add('has-tabs');

    // Remove the collapsed class from the Bottom bar.
    bottomBar.classList.remove('collapsed');
  } else {
    // Remove the has-tabs class from the Toolbar.
    toolbar.classList.remove('has-tabs');

    // Remove the has-tabs class to the Bottom bar.
    bottomBar.classList.remove('has-tabs');
  }
};
