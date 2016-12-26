/**
 * @file Defines the API for MD Icon on the server
 * @author Derek Gransaull <derek@dgtlife.com>
 * @copyright DGTLife, LLC 2016
 *
 * Created on 11/22/16
 */
import { Mongo } from 'meteor/mongo';
import { check, Match } from 'meteor/check';
import { _ } from 'meteor/underscore';
import { Meteor } from 'meteor/meteor';
import customizeId from './md-utils.js';

// A collection that holds the icon metadata.
export const Icons = new Mongo.Collection('icons');

/**
 * Parses an icon asset file, extracts the icon metadata for the specified icons
 * from the SVG source, and inserts a metadata document per icon into the Icons
 * collection.
 * @param {object} assetConfig - an object that defines an asset file and the
 *                               icons to be extracted from it.
 */
export const parseIconAssets = (assetConfig) => {
  const iconsDefinedByG = assetConfig.iconsDefinedByG;
  const iconsDefinedBySvg = assetConfig.iconsDefinedBySvg;

  if (iconsDefinedByG && (iconsDefinedByG.length > 0)) {
    // Process the icons defined by <g> tags in each specified file.
    _.each(iconsDefinedByG, (config) => {
      // Check the input before proceeding.
      check(config.file, String);
      check(config.include, Match.Optional(Match.OneOf(String, [String])));
      check(config.stripPrefix, Match.Optional(String));
      check(config.stripSuffix, Match.Optional(String));
      check(config.addPrefix, Match.Optional(String));
      check(config.addSuffix, Match.Optional(String));
      check(config.hyphensOnly, Match.Optional(Boolean));

      // Read the lines of the file into an array.
      const lines = config.file.split('\n');

      // Extract only the id and raw content of each <g> element (one per line).
      _.each(lines, (line) => {
        if (line && line.match(/<\/g>/)) {
          // It's a line with an icon definition on it. Parse it.
          const _id = line.match(/<g [^>]*id="(.+?)"[^<]*>(.+?)<\/g>/)[1];
          const content = line.match(/<g [^>]*id="(.+?)"[^<]*>(.+?)<\/g>/)[2];

          // Customize the id, if configured.
          const id = customizeId(_id, config);

          // Apply icon selection.
          if (config.include === 'all') {
            // Insert a metadata document for this (and every) <g> element.
            if (!Icons.findOne({ id: id })) {
              Icons.insert({
                id: id,
                content: content
              });
            }

            return;
          }

          /*
           * Insert a metadata document for this <g> element if the '_id' is
           * in the 'include' list.
           */
          if (_.contains(config.include, _id)) {
            if (!Icons.findOne({ id: id })) {
              Icons.insert({
                id: id,
                content: content
              });
            }
          }
        }
      });
    });
  }

  if (iconsDefinedBySvg && (iconsDefinedBySvg.length > 0)) {
    // Process the icons defined by <svg> tags in each specified file.
    _.each(iconsDefinedBySvg, (config) => {
      // Check the input before proceeding.
      check(config.file, String);
      check(config.include, Match.Optional(Match.OneOf(String, [String])));
      check(config.stripPrefix, Match.Optional(String));
      check(config.stripSuffix, Match.Optional(String));
      check(config.addPrefix, Match.Optional(String));
      check(config.addSuffix, Match.Optional(String));
      check(config.hyphensOnly, Match.Optional(Boolean));

      // Read the lines of the file into an array.
      const lines = config.file.split('\n');

      // Extract only the id and content of each <svg> element (one per line).
      _.each(lines, (line) => {
        if (line && line.match(/<\/svg>/)) {
          // It's a line with an icon definition on it. Parse it.
          const _id = line.match(/<svg [^>]*id="(.+?)"[^<]*>(.+?)<\/svg>/)[1];
          const content = line.match(/<svg [^>]*id="(.+?)"[^<]*>(.+?)<\/svg>/)[2];

          // Customize the id, if configured.
          const id = customizeId(_id, config);

          // Apply icon selection.
          if (config.include === 'all') {
            // Insert a metadata document for this (and every) <svg> element.
            if (!Icons.findOne({ id: id })) {
              Icons.insert({
                id: id,
                content: content
              });
            }

            return;
          }

          /*
           * Insert a metadata document for this <svg> element if the '_id' is
           * in the 'include' list.
           */
          if (_.contains(config.include, _id)) {
            if (!Icons.findOne({ id: id })) {
              Icons.insert({
                id: id,
                content: content
              });
            }
          }
        }
      });
    });
  }
};

/**
 * Select icons from the (Polymer-derived) included sets to be used in the app.
 * @param {[object]} iconConfigs - an array of objects, each of which defines
 *                                 an iconset, and the icons from the set that
 *                                 are to be used in the app.
 */
export const selectIcons = (iconConfigs) => {
  check(iconConfigs, [Object]);

  // Process the configs.
  _.each(iconConfigs, (config) => {
    let fileSpec;

    // Compute the file spec.
    if (config.set === 'base') {
      fileSpec = Assets.getText('server/imports/assets/md-icon-base.svg');
    } else if (config.set === 'av') {
      fileSpec = Assets.getText('server/imports/assets/md-icon-av.svg');
    } else if (config.set === 'communication') {
      fileSpec = Assets.getText('server/imports/assets/md-icon-communication.svg');
    } else if (config.set === 'device') {
      fileSpec = Assets.getText('server/imports/assets/md-icon-device.svg');
    } else if (config.set === 'editor') {
      fileSpec = Assets.getText('server/imports/assets/md-icon-editor.svg');
    } else if (config.set === 'hardware') {
      fileSpec = Assets.getText('server/imports/assets/md-icon-hardware.svg');
    } else if (config.set === 'image') {
      fileSpec = Assets.getText('server/imports/assets/md-icon-image.svg');
    } else if (config.set === 'maps') {
      fileSpec = Assets.getText('server/imports/assets/md-icon-maps.svg');
    } else if (config.set === 'notification') {
      fileSpec = Assets.getText('server/imports/assets/md-icon-notification.svg');
    } else if (config.set === 'social') {
      fileSpec = Assets.getText('server/imports/assets/md-icon-social.svg');
    } else if (config.set === 'extras') {
      fileSpec = Assets.getText('server/imports/assets/md-icon-extras.svg');
    } else {
      throw new Meteor.Error(
        'The iconset specified is not included in this package.'
      );
    }

    // Compose an asset config.
    const assetConfig = {
      iconsDefinedByG: [
        {
          file: fileSpec,
          include: config.include,
          hyphensOnly: true
        }
      ]
    };

    // Parse.
    parseIconAssets(assetConfig);
  });
};

/**
 * Checks a custom icon asset config, then calls the parser.
 * @param {object} assetConfig - an object that defines an asset file and the
 *                               icons to be extracted from it.
 */
export const defineIconAssets = (assetConfig) => {
  check(assetConfig, {
    iconsDefinedBySvg: Match.Optional([Object]),
    iconsDefinedByG: Match.Optional([Object])
  });

  // Parse.
  parseIconAssets(assetConfig);
};
