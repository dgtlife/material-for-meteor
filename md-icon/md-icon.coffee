###
  @file Defines the API for MD Icon
  @author Derek Gransaull <derek@dgtlife.com>
  @copyright DGTLife, LLC 2015

  Created on 11/12/2015
###

#//////////////////////    EXTEND MD API FOR MD ICON    ////////////////////////
_.extend Material.prototype,

  ###*
  # Select icons from the (Polymer-derived) included sets to be used in the app.
  #
  # @param {[Object]} iconConfigs - an array of objects, each of which defines
  #                                 an iconset, and the icons from the set that
  #                                 are to be used in the app
  ###
  selectIcons: (iconConfigs) ->
    "use strict"

    if Meteor.isServer
      check iconConfigs, [Object]

      # Process the configs.
      _.each iconConfigs, (config) ->
        # Compute the file spec.
        if config.set is 'base'
          fileSpec = Assets.getText 'md-icon/md-icon-base.svg'
        else if config.set is 'av'
          fileSpec = Assets.getText 'md-icon/md-icon-av.svg'
        else if config.set is 'communication'
          fileSpec = Assets.getText 'md-icon/md-icon-communication.svg'
        else if config.set is 'device'
          fileSpec = Assets.getText 'md-icon/md-icon-device.svg'
        else if config.set is 'editor'
          fileSpec = Assets.getText 'md-icon/md-icon-editor.svg'
        else if config.set is 'hardware'
          fileSpec = Assets.getText 'md-icon/md-icon-hardware.svg'
        else if config.set is 'image'
          fileSpec = Assets.getText 'md-icon/md-icon-image.svg'
        else if config.set is 'maps'
          fileSpec = Assets.getText 'md-icon/md-icon-maps.svg'
        else if config.set is 'notification'
          fileSpec = Assets.getText 'md-icon/md-icon-notification.svg'
        else if config.set is 'social'
          fileSpec = Assets.getText 'md-icon/md-icon-social.svg'
        else if config.set is 'extras'
          fileSpec = Assets.getText 'md-icon/md-icon-extras.svg'
        else
          throw new Meteor.Error 'The iconset specified is not included in this package.'
        # Compose the asset config
        assetConfig =
          iconsDefinedByG: [
            file: fileSpec
            include: config.include
            hyphensOnly: true
          ]
        # Add the asset config to the set.
        MD.defineIconAssets assetConfig

  ###*
  # Adds the configuration for an icon asset file to the overall set of configs.
  #
  # @param {object} assetConfig - an object that defines an asset file and the
  #                               icons to be extracted from it.
  ###
  defineIconAssets: (assetConfig) ->
    "use strict"

    check assetConfig,
      iconsDefinedBySvg: Match.Optional [Object]
      iconsDefinedByG: Match.Optional [Object]

    if Meteor.isServer
      if assetConfig.iconsDefinedBySvg and (assetConfig.iconsDefinedBySvg.length > 0)
        # A config was specified for icons from <svg> elements. Process it.
        _.each assetConfig.iconsDefinedBySvg, (config) ->
          MD.config.iconsDefinedBySvg.push config

      if assetConfig.iconsDefinedByG and (assetConfig.iconsDefinedByG.length > 0)
        # A config was specified for icons from <g> elements. Process it.
        _.each assetConfig.iconsDefinedByG, (config) ->
          MD.config.iconsDefinedByG.push config

  ###*
  # Reads and parses the icon asset files, extracts the icon metadata for the
  # specified icons from the SVG source and pushes a metadata object per icon
  # it into the server side icon metadata array.
  ###
  parseIconAssets: ->
    "use strict"

    if Meteor.isServer
      iconsDefinedBySvg = MD.config.iconsDefinedBySvg
      iconsDefinedByG = MD.config.iconsDefinedByG
      # Initialize the database that will hold all the extracted icon metadata.
      MD.icons.remove({})

      # Process the icons defined by <g> tags in each specified file.
      _.each iconsDefinedByG, (config) ->
        # Check the input before proceeding.
        check config.file, String
        check config.include, Match.Optional(Match.OneOf(String, [String]))
        check config.stripPrefix, Match.Optional(String)
        check config.stripSuffix, Match.Optional(String)
        check config.addPrefix, Match.Optional(String)
        check config.addSuffix, Match.Optional(String)
        check config.hyphensOnly, Match.Optional(Boolean)

        # Read the lines of the file into an array.
        lines = config.file.split '\n'
        # Extract only the id and raw content of each <g> element (one per line).
        _.each lines, (line) ->
          if line and line.match(/<\/g>/)
            # It's a line with an icon definition on it. Parse it.
            _id = line.match(/<g [^>]*id="(.+?)"[^<]*>(.+?)<\/g>/)[1]
            content = line.match(/<g [^>]*id="(.+?)"[^<]*>(.+?)<\/g>/)[2]
            # Customize the id, if configured.
            id = MD._customizeId _id, config
            # Apply icon selection.
            if config.include is 'all'
              # Use every <g> element.
              # Insert a metadata document into the database.
              MD.icons.insert
                id: id
                content: content
            else
              # Use only the <g> elements for which the _id is in the 'include'
              # list.
              if _.contains config.include, _id
                # Insert a metadata document into the database.
                MD.icons.insert
                  id: id
                  content: content

      # Process the icons defined by <svg> tags in each specified file.
      _.each iconsDefinedBySvg, (config) ->
        # Check the input before proceeding.
        check config.file, String
        check config.include, Match.Optional(Match.OneOf(String, [String]))
        check config.stripPrefix, Match.Optional(String)
        check config.stripSuffix, Match.Optional(String)
        check config.addPrefix, Match.Optional(String)
        check config.addSuffix, Match.Optional(String)
        check config.hyphensOnly, Match.Optional(Boolean)

        # Read the lines of the file into an array.
        lines = config.file.split '\n'
        # Extract only the id and content of each <svg> element (one per line).
        _.each lines, (line) ->
          if line and line.match(/<\/svg>/)
            # It's a line with an icon definition on it. Parse it.
            _id = line.match(/<svg [^>]*id="(.+?)"[^<]*>(.+?)<\/svg>/)[1]
            content = line.match(/<svg [^>]*id="(.+?)"[^<]*>(.+?)<\/svg>/)[2]
            # Customize the id, if configured.
            id = MD._customizeId _id, config
            # Apply icon selection.
            if config.include is 'all'
              # Use every <svg> element. Push a metadata object into the array.
              # Insert a metadata document into the database.
              MD.icons.insert
                id: id
                content: content
            else
              # Use only the <svg> elements for which the _id is in the 'include'
              # list.
              if _.contains config.include, _id
                # Push a metadata object into the array.
                # Insert a metadata document into the database.
                MD.icons.insert
                  id: id
                  content: content
      # Log the completion of parsing and storage.
      console.log 'MD Icon: metadata for ' + MD.icons.find().count() +
          ' icons is ready.'

      # Publish this 'md_icons' collection.
      Meteor.publish('icons', ->
        MD.icons.find()
      );

  ###*
  # A helper to enable convenient icon insertion. The helper passes an
  # arbitrary number of arguments. The first argument is expected to be the
  # id of the icon, and the others are ignored.
  ###
  registerIconHelper: ->
    "use strict"

    # This helper enables direct insertion of an MD icon using an <svg> element.
    Template.registerHelper 'md_icon__svg', ->
      # Check whether we have a null input, i.e no icon is supposed to appear,
      # and return early.
      if (arguments[0] is null) or (arguments[0] is '')
        return null

      # Otherwise, the icon id is the first argument; ignore all others.
      id = arguments[0]
      # Once icon metadata is ready on the client,
      # if MD.reactive.get 'iconMetadataReady'
      if MD.iconSub.ready()
        # Find the icon metadata object corresponding to this id,
        icon = MD.icons.findOne { id: id }
        if _.isUndefined icon
          throw new Meteor.Error 'The icon metadata for "' + id +
                                 '" was not found.'

        # then build the HTML for this MD icon using an <svg> element wrapping a
        # <g> element. This enables support for composite SVGs.
        if id is 'super-g'
          svgIconHTML = '<svg id="' + id + '" ' +
            'class="md-icon__svg" viewBox="-3 -3 24 24" ' +
            'preserveAspectRatio="xMidYMid meet">' +
            '<g>' + icon.content + '</g>' +
            '</svg>'
        else
          svgIconHTML = '<svg id="' + id + '" ' +
                        'class="md-icon__svg" viewBox="0 0 24 24" ' +
                        'preserveAspectRatio="xMidYMid meet">' +
                        '<g>' + icon.content + '</g>' +
                        '</svg>'

        Spacebars.SafeString svgIconHTML

  ###*
  # Strip a prefix from a string.
  #
  # @param {string} string - the string
  # @param {string} prefix - the prefix to be stripped off
  # @returns {string}
  ###
  __stripPrefix: (string, prefix) ->
    "use strict"

    check string, String
    check prefix, String

    if string.indexOf(prefix) is 0
      string.slice prefix.length
    else
      throw new Meteor.Error 400, 'The prefix "' + prefix +
                                  '" was not found in "' + string +
                                  '", or did not start at the beginning.'

  ###*
  # Add a prefix to a string.
  #
  # @param {string} string - the string
  # @param {string} prefix - the prefix to be added
  # @returns {string}
  ###
  __addPrefix: (string, prefix) ->
    "use strict"

    check string, String
    check prefix, String

    prefix + string

  ###*
  # Strip a suffix from a string.
  #
  # @param {string} string - the string
  # @param {string} suffix - the suffix to be stripped
  # @returns {string}
  ###
  __stripSuffix: (string, suffix) ->
    "use strict"

    check string, String
    check suffix, String

    if string.lastIndexOf(suffix) is (string.length - suffix.length)
      string.slice 0, (string.length - suffix.length)
    else
      throw new Meteor.Error 400, 'The suffix "' + suffix +
                                  '" was not found in "' + string +
                                  '", or did not end at the end.'

  ###*
  # Add a suffix to a string.
  #
  # @param {string} string - the string
  # @param {string} suffix - the suffix to be added
  # @returns {string}
  ###
  __addSuffix: (string, suffix) ->
    "use strict"

    check string, String
    check suffix, String

    string + suffix

  ###*
  # Replace each underscore in a string with a hyphen.
  #
  # @param {string} string - the string
  # @returns {string}
  ###
  __underscoreToHyphen: (string) ->
    "use strict"

    check string, String

    string.replace /_/g, '-'

  ###*
  # Customize the target symbol id based on properties in the config. The
  # config is derived from the file config when defining icon asset files.
  #
  # @param {string} id
  # @param {object} config
  # @returns {string} - the customized id
  ###
  _customizeId: (id, config) ->
    "use strict"

    check id, String
    check config, Object

    # Strip a prefix if required.
    if config.stripPrefix
      id = @__stripPrefix id, config.stripPrefix

    # Strip a suffix if required.
    if config.stripSuffix
      id = @__stripSuffix id, config.stripSuffix

    # Convert underscores to hyphens if required.
    if config.hyphensOnly
      id = @__underscoreToHyphen id

    # Add a prefix if required.
    if config.addPrefix
      id = @__addPrefix id, config.addPrefix

    # Add a suffix if required.
    if config.addSuffix
      id = @__addSuffix id, config.addSuffix

    id
