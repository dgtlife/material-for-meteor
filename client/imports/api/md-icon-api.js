/**
 * @file Defines the API for MD Icon on the client
 * @author Derek Gransaull <derek@dgtlife.com>
 * @copyright DGTLife, LLC 2016
 * Created on 11/17/2016
 */
import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

const Icons = new Mongo.Collection('icons');

/**
 * A helper to enable convenient icon insertion. The helper passes an arbitrary
 * number of arguments. The first argument is expected to be the id of the icon,
 * and the others are ignored.
 */
const registerIconHelper = () => {
  const iconSub = Meteor.subscribe('icons');

  // This helper enables direct insertion of an MD icon using an <svg> element.
  Template.registerHelper('md_icon__svg', (...args) => {
    /*
     * Check whether we have a null input, i.e no icon is supposed to appear,
     * and return early.
     */
    if ((args[0] === null) || (args[0] === '')) {
      return null;
    }

    // Otherwise, the icon id is the first argument; ignore all others.
    const id = args[0];

    // Once icon metadata is ready on the client, ...
    if (iconSub.ready()) {
      // find the icon metadata object corresponding to this id, ...
      const icon = Icons.findOne({ id: id });
      if (!icon) {
        throw new Error(`The icon metadata for "${id}" was not found.`);
      }

      /*
       * then build the HTML for this MD Icon using an <svg> element wrapping
       * a <g> element. This structure enables support for composite SVGs.
       */
      let svgIconHTML;
      if (id === 'super-g') {
        // The Google G gets special handling.
        svgIconHTML =
          `<svg id="${id}" class="md-icon__svg" viewBox="-3 -3 24 24" 
           preserveAspectRatio="xMidYMid meet"><g>${icon.content}</g></svg>`;
      } else {
        svgIconHTML =
          `<svg id="${id}" class="md-icon__svg" viewBox="0 0 24 24" 
           preserveAspectRatio="xMidYMid meet"><g>${icon.content}</g></svg>`;
      }

      // eslint-disable-next-line new-cap
      return Spacebars.SafeString(svgIconHTML);
    }

    return null;
  });
};

export default registerIconHelper;
