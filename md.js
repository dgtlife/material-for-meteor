/**
 * @file Defines the Material object, and instantiates it as MD.
 * @author Derek Gransaull <derek@dgtlife.com>
 * @copyright DGTLife, LLC 2015
 *
 * Created on 9/29/2015
 */
import { Mongo } from 'meteor/mongo';

///////////////////////////////  CONSTRUCTOR  //////////////////////////////////
Material = function () {
  "use strict";
  var self = this;

  // Initialize the _config object.
  self.config = {

    // Indicates whether the user is using the header panel feature.
    usingHeaderPanel: false,

    // Setting to hide/show the helper text when an error is set on a text input
    // field.
    hideHelperTextOnError: true,

    // ToDo: Move asset file definitions out of config.
    // The asset file configuration for icons defined using <svg> tags.
    iconsDefinedBySvg: [],

    // The asset file configuration for icons defined using <g> tags.
    iconsDefinedByG: [],

    // The elements to move with the snackbar as it is raised and lowered.
    elementsToMove: []
  };

  // The server-side icon metadata. This is generated once at server startup and
  // served to each client upon request.
  self.__iconMetadata = [];

  // The client-side icon metadata retrieved from the server on client startup.
  self._iconMetadata = [];

  // The client-side snackbar queue.
  self._snackbars = [];

  // The platform detection utility.
  self.platform = {};

  // The temp storage location for selectable elements.
  self.selected = {};
};

////////////////////////////////  PROTOTYPE  ///////////////////////////////////
_.extend(Material.prototype, {
  constructor: Material,

  // Manage some reactive variables.
  reactive: Meteor.isClient && new ReactiveDict,

  // A database to hold icon metadata.
  icons: new Mongo.Collection('icons'),

  /**
   * Configure options for the Material instance.
   *
   * @param {Object} _config - configuration options provided by the package user
   */
  configure: function (_config) {
    "use strict";
    var self = this;

    // Check the configuration options supplied by the package user.
    check(_config.usingHeaderPanel, Match.Optional(Boolean));
    check(_config.hideHelperTextOnError, Match.Optional(Boolean));
    check(_config.elementsToMove, Match.Optional([String]));

    // Update the configuration values.
    self.config = _.extend(self.config, _config);
    return self.config;
  }
});

////////////////////////////  INSTANTIATE AS MD  ///////////////////////////////
MD = new Material();

if (Meteor.isServer) {
  Meteor.startup(function () {
    "use strict";

    //ToDo: Declare the icons needed by MD itself.

    // Parse the icon asset files and fill the server-side metadata array.
    MD.parseIconAssets();
  });
}

if (Meteor.isClient) {
  Meteor.startup(function () {
    "use strict";

    if (MD.options)
      MD.configure(MD.options);

    // Subscribe to the MD Icon metadata.
    MD.iconSub = Meteor.subscribe('icons');

    // Register the icon helper.
    MD.registerIconHelper();

    // Initialize the snackbarCount reactive variable
    MD.reactive.set('snackbarCount', 0);

    // Run the platform detection function.
    MD.runPlatformDetection();
  });
}
