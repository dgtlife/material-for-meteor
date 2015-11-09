/**
 * @file Defines the Material object, and instantiates it as MD.
 * @author Derek Gransaull <derek@dgtlife.com>
 * @copyright DGTLife, LLC 2015
 *
 * Created on 9/29/2015
 */
// JSHint directives
/*jshint -W117 */     // app- and package-scoped variables not detectable by JSHint
/*jshint -W106 */     // we are not using camelCase for every identifier

////////////////////////////////////////////////////////////////////////////////
//////                               MD                                   //////
////////////////////////////////////////////////////////////////////////////////

///////////////////////////////  CONSTRUCTOR  //////////////////////////////////
Material = function () {
  "use strict";
  var self = this;

  // Initialize the _config object.
  self.config = {
    // Hide/show the helper text when an error is set on a text input field.
    hideHelperTextOnError: true,

    // The maximum render delay (in ms) to be applied on load/reload.
    MAX_RENDER_DELAY: 0
  };

};

////////////////////////////////  PROTOTYPE  ///////////////////////////////////
_.extend(Material.prototype, {
  constructor: Material,

  // Manage some reactive variables.
  reactive: new ReactiveDict,

  /**
   * Configure options for the Material instance.
   *
   * @param {Object} _config - configuration options provided by the package user
   */
  configure: function (_config) {
    "use strict";
    var self = this;

    // Check the configuration options supplied by the package user.
    check(_config.hideHelperTextOnError, Match.Optional(Boolean));
    check(_config.MAX_RENDER_DELAY, Match.Optional(Match.Integer));

    // Update the configuration values.
    self.config = _.extend(self.config, _config);
    return self.config;
  }
});

///////////////////////////////  INSTANTIATE  //////////////////////////////////
MD = new Material();

if (Meteor.isClient) {
  Meteor.startup(function () {
    "use strict";

    if (MD.options)
      MD.configure(MD.options);
  });
}
