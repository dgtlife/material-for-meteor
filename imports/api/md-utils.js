/**
 * @file Defines MD utility functions for client and server.
 * @author Derek Gransaull <derek@dgtlife.com>
 * @copyright DGTLife, LLC 2015
 *
 * Created on 6/29/2016
 */
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

/**
 * Strip a prefix from a string.
 * @param {string} string - the string
 * @param {string} prefix - the prefix to be stripped off
 * @private
 */
export const stripPrefix = (string, prefix) => {
  check(string, String);
  check(prefix, String);
  if (string.indexOf(prefix) === 0) {
    string.slice(prefix.length);
  } else {
    throw new Meteor.Error(
      `The prefix "${prefix}" was not found in "${string}",
       or did not start at the beginning.`
    );
  }
};

/**
 * Add a prefix to a string.
 * @param {string} string - the string
 * @param {string} prefix - the prefix to be added
 */
export const addPrefix = (string, prefix) => {
  check(string, String);
  check(prefix, String);
  return prefix + string;
};

/**
 * Strip a suffix from a string.
 * @param {string} string - the string
 * @param {string} suffix - the suffix to be stripped
 */
export const stripSuffix = (string, suffix) => {
  check(string, String);
  check(suffix, String);
  if (string.lastIndexOf(suffix) === (string.length - suffix.length)) {
    return string.slice(0, (string.length - suffix.length));
  }

  throw new Meteor.Error(
    `The suffix "${suffix}" was not found in "${string}",
     or did not end at the end.`
  );
};

/**
 * Add a suffix to a string.
 * @param {string} string - the string
 * @param {string} suffix - the suffix to be added
 */
export const addSuffix = (string, suffix) => {
  check(string, String);
  check(suffix, String);
  return string + suffix;
};

/**
 * Replace each underscore in a string with a hyphen.
 * @param {string} string - the string
 */
export const underscoreToHyphen = (string) => {
  check(string, String);
  return string.replace(/_/g, '-');
};
