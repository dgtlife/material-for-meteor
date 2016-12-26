/**
 * @file Defines MD utility functions for the server.
 * @author Derek Gransaull <derek@dgtlife.com>
 * @copyright DGTLife, LLC 2015
 *
 * Created on 11/22/16
 */
import { check } from 'meteor/check';
import {
  stripPrefix,
  stripSuffix,
  underscoreToHyphen,
  addPrefix,
  addSuffix
} from '../../../imports/api/md-utils.js';


/**
 * Customize the target symbol id based on properties in the config. The
 * config is derived from the file config when defining icon asset files.
 * @param {string} id - the symbol id
 * @param {object} config - the parsing config
 */
const customizeId = (id, config) => {
  check(id, String);
  check(config, Object);
  let _id;

  // Strip a prefix if required.
  if (config.stripPrefix) {
    _id = stripPrefix(id, config.stripPrefix);
  }

  // Strip a suffix if required.
  if (config.stripSuffix) {
    _id = stripSuffix(id, config.stripSuffix);
  }

  // Convert underscores to hyphens if required.
  if (config.hyphensOnly) {
    _id = underscoreToHyphen(id);
  }

  // Add a prefix if required.
  if (config.addPrefix) {
    _id = addPrefix(id, config.addPrefix);
  }

  // Add a suffix if required.
  if (config.addSuffix) {
    _id = addSuffix(id, config.addSuffix);
  }

  return _id;
};

export default customizeId;
