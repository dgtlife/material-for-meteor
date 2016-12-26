/**
 * @file Defines the config object and related functions.
 * @author Derek Gransaull <derek@dgtlife.com>
 * @copyright DGTLife, LLC 2016
 *
 * Created on 12/26/2016
 */
import { _ } from 'meteor/underscore';
import { check, Match } from 'meteor/check';
import registerIconHelper from './md-icon-api.js';

const config = {
  // The elements to move with the snackbar as it is raised and lowered.
  elementsToMove: []
};

/**
 * Set the config based on the options supplied to runMD by the user.
 * @param {object} options - the options provided
 */
const setConfig = (options) => {
  // Update the config values.
  _.each(options, (value, key) => {
    config[key] = value;
  });
};

/**
 * Start an MD session.
 * @param options
 */
export const run = (options) => {
  // Configure MD, after checking the options supplied by the package user.
  if (options) {
    check(options.elementsToMove, Match.Optional([String]));
    setConfig(options);
  }

  // Register the icon helper.
  registerIconHelper();
};

/**
 * Retrieve the current config.
 */
export const getConfig = () => config;
