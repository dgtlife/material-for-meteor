/**
 * @file Defines the Material package
 * @author Derek Gransaull <derek@dgtlife.com>
 * @copyright DGTLife, LLC 2015
 *
 * Created on 9/29/2015
 */
Package.describe({
  summary: 'A Blaze implementation of Material Design components for Meteor',
  version: '0.7.1',
  name: 'dgtlife:material',
  git: 'https://github.com/dgtlife/material-for-meteor.git'
});

Package.onUse((api) => {
  api.use('ecmascript', ['client', 'server']);
  api.use('templating', 'client');
  api.use('dalgard:jade', 'client');
  api.use('stylus', 'client');
  api.use('hammer:hammer@=2.0.4_1', 'client');
  api.use('reactive-dict', ['client', 'server']);
  api.use('reactive-var', 'client');
  api.use('tracker', 'client');
  api.use('coffeescript', ['client', 'server']);
  api.use('underscore', ['client', 'server']);
  api.use('check', ['client', 'server']);
  api.use('random', ['client', 'server']);

  api.mainModule('server/md.js', 'server');

  api.addAssets('server/imports/assets/md-icon-av.svg', 'server');
  api.addAssets('server/imports/assets/md-icon-base.svg', 'server');
  api.addAssets('server/imports/assets/md-icon-communication.svg', 'server');
  api.addAssets('server/imports/assets/md-icon-device.svg', 'server');
  api.addAssets('server/imports/assets/md-icon-editor.svg', 'server');
  api.addAssets('server/imports/assets/md-icon-hardware.svg', 'server');
  api.addAssets('server/imports/assets/md-icon-image.svg', 'server');
  api.addAssets('server/imports/assets/md-icon-maps.svg', 'server');
  api.addAssets('server/imports/assets/md-icon-notification.svg', 'server');
  api.addAssets('server/imports/assets/md-icon-social.svg', 'server');
  api.addAssets('server/imports/assets/md-icon-extras.svg', 'server');

  api.mainModule('client/md.js', 'client');
});

Package.onTest((api) => {
  api.use([
    'dgtlife:material',
    'tinytest',
    'test-helpers'
  ]);

  api.addFiles('md-tests.js', 'client');
});
