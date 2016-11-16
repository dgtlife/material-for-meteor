/**
 * @file Defines the Material package
 * @author Derek Gransaull <derek@dgtlife.com>
 * @copyright DGTLife, LLC 2015
 *
 * Created on 9/29/2015
 */

// JSHint directives
/*jshint -W117 */     // app- and package-scoped variables not detectable by JSHint

Package.describe({
  summary: 'A Blaze implementation of Material Design components for Meteor',
  version: '0.6.9',
  name: 'dgtlife:material',
  git: ''
});

// Run environment
Package.onUse(function (api) {
  "use strict";
  api.use('templating', 'client');
  api.use('dalgard:jade', 'client');
  api.use('stylus', 'client');
  api.use('hammer:hammer@=2.0.4_1', 'client');
  api.use('reactive-dict', 'client');
  api.use('tracker', 'client');
  api.use('coffeescript', ['client', 'server']);
  api.use('underscore', ['client', 'server']);
  api.use('check', ['client', 'server']);
  api.use('random', ['client', 'server']);
  api.use('ecmascript', ['client', 'server']);

  api.addFiles('md.js', ['client', 'server']);
  api.addFiles('md-utils.coffee', 'client');
  api.addFiles('md-utils.js', 'client');
  api.addFiles('md-common.styl', 'client');

  api.addFiles('md-button/md-button.styl', 'client');
  api.addFiles('md-button/md-button.jade', 'client');
  api.addFiles('md-button/md-button.js', 'client');

  api.addFiles('md-card/md-card.styl', 'client');
  api.addFiles('md-card/md-card.jade', 'client');
  api.addFiles('md-card/md-card.js', 'client');

  api.addFiles('md-checkbox/md-checkbox.styl', 'client');
  api.addFiles('md-checkbox/md-checkbox.jade', 'client');
  api.addFiles('md-checkbox/md-checkbox.js', 'client');

  api.addFiles('md-chip/md-chip.styl', 'client');
  api.addFiles('md-chip/md-chip.jade', 'client');
  api.addFiles('md-chip/md-chip.js', 'client');

  api.addFiles('md-collapse/md-collapse.styl', 'client');
  api.addFiles('md-collapse/md-collapse.jade', 'client');
  api.addFiles('md-collapse/md-collapse.coffee', 'client');

  api.addFiles('md-dialog/md-dialog.styl', 'client');
  api.addFiles('md-dialog/md-dialog.jade', 'client');
  api.addFiles('md-dialog/md-dialog.coffee', 'client');

  api.addFiles('md-drawer/md-drawer.styl', 'client');
  api.addFiles('md-drawer/md-drawer.jade', 'client');
  api.addFiles('md-drawer/md-drawer.coffee', 'client');

  api.addFiles('md-dropdown-menu/md-dropdown-menu.styl', 'client');
  api.addFiles('md-dropdown-menu/md-dropdown-menu.jade', 'client');
  api.addFiles('md-dropdown-menu/md-dropdown-menu.coffee', 'client');

  api.addFiles('md-header-panel/md-header-panel.styl', 'client');
  api.addFiles('md-header-panel/md-header-panel.jade', 'client');
  api.addFiles('md-header-panel/md-header-panel.js', 'client');

  api.addFiles('md-icon/md-icon.styl', 'client');
  api.addFiles('md-icon/md-icon.jade', 'client');
  api.addFiles('md-icon/md-icon.coffee', ['client', 'server']);
  api.addAssets('md-icon/md-icon-av.svg', 'server');
  api.addAssets('md-icon/md-icon-base.svg', 'server');
  api.addAssets('md-icon/md-icon-communication.svg', 'server');
  api.addAssets('md-icon/md-icon-device.svg', 'server');
  api.addAssets('md-icon/md-icon-editor.svg', 'server');
  api.addAssets('md-icon/md-icon-hardware.svg', 'server');
  api.addAssets('md-icon/md-icon-image.svg', 'server');
  api.addAssets('md-icon/md-icon-maps.svg', 'server');
  api.addAssets('md-icon/md-icon-notification.svg', 'server');
  api.addAssets('md-icon/md-icon-social.svg', 'server');
  api.addAssets('md-icon/md-icon-extras.svg', 'server');

  api.addFiles('md-image/md-image.styl', 'client');
  api.addFiles('md-image/md-image.jade', 'client');
  api.addFiles('md-image/md-image.coffee', 'client');

  api.addFiles('md-item/md-item.styl', 'client');
  api.addFiles('md-item/md-item.jade', 'client');

  api.addFiles('md-label/md-label.styl', 'client');
  api.addFiles('md-label/md-label.jade', 'client');
  api.addFiles('md-label/md-label.coffee', 'client');

  api.addFiles('md-menu/md-menu.styl', 'client');
  api.addFiles('md-menu/md-menu.jade', 'client');
  //api.addFiles('md-menu/md-menu.html', 'client');
  api.addFiles('md-menu/md-menu.js', 'client');

  api.addFiles('md-popup-menu/md-popup-menu.styl', 'client');
  api.addFiles('md-popup-menu/md-popup-menu.jade', 'client');
  api.addFiles('md-popup-menu/md-popup-menu.coffee', 'client');

  api.addFiles('md-radio/md-radio.styl', 'client');
  api.addFiles('md-radio/md-radio.jade', 'client');
  api.addFiles('md-radio/md-radio.js', 'client');

  api.addFiles('md-ripple/md-ripple.styl', 'client');
  api.addFiles('md-ripple/md-ripple.jade', 'client');
  api.addFiles('md-ripple/md-ripple.coffee', 'client');

  api.addFiles('md-shadow/md-shadow.styl', 'client');

  api.addFiles('md-snackbar/md-snackbar.styl', 'client');
  api.addFiles('md-snackbar/md-snackbar.jade', 'client');
  api.addFiles('md-snackbar/md-snackbar.coffee', 'client');

  api.addFiles('md-spinner/md-spinner-keyframes.css', 'client');
  api.addFiles('md-spinner/md-spinner.styl', 'client');
  api.addFiles('md-spinner/md-spinner.jade', 'client');
  api.addFiles('md-spinner/md-spinner.coffee', 'client');

  api.addFiles('md-tabs/md-tabs.styl', 'client');
  api.addFiles('md-tabs/md-tabs.jade', 'client');
  api.addFiles('md-tabs/md-tabs.js', 'client');

  api.addFiles('md-text-input/md-text-input.styl', 'client');
  api.addFiles('md-text-input/md-text-input.jade', 'client');
  api.addFiles('md-text-input/md-text-input.coffee', 'client');

  api.addFiles('md-toolbar/md-toolbar.styl', 'client');
  api.addFiles('md-toolbar/md-toolbar.jade', 'client');
  api.addFiles('md-toolbar/md-toolbar.js', 'client');

  api.addFiles('md-tooltip/md-tooltip.styl', 'client');
  api.addFiles('md-tooltip/md-tooltip.jade', 'client');
  api.addFiles('md-tooltip/md-tooltip.js', 'client');

  api.addFiles('md-underline/md-underline.styl', 'client');
  api.addFiles('md-underline/md-underline.jade', 'client');
  api.addFiles('md-underline/md-underline.coffee', 'client');

  api.export('MD', ['client', 'server']);
});

// Test environment
Package.onTest(function (api) {
  "use strict";

  api.use([
    'dgtlife:material',
    'tinytest',
    'test-helpers'
  ]);

  api.addFiles('md-tests.js', 'client');
});
