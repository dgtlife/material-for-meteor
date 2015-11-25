###
  @file Defines the API for MD Icon
  @author Derek Gransaull <derek@dgtlife.com>
  @copyright DGTLife, LLC 2015

  Created on 11/12/2015
###

#//////////////////////    EXTEND MD API FOR MD ICON    ////////////////////////
_.extend Material.prototype,

  ###*
  # Gets the SVG definitions (from the user's files outside the package) for
  # the icons to be used by the package.
  #
  # @param {object} assetConfig - an object that provides the icon assets from
  #                               outside of the package as a text stream.
  ###
  getIconAssets: (assetConfig) ->
    "use strict"

    check assetConfig,
      iconsBySymbols: [Object]
      iconsBySvgs: [Object]

    if Meteor.isServer
      @config.iconsBySymbols = assetConfig.iconsBySymbols
      @config.iconsBySvgs = assetConfig.iconsBySvgs

  ###*
  # Loads the SVG metadata for all icons from the server (where it is parsed)
  # to the client.
  #
  # @private
  ###
  loadSvgMetadata: ->
    "use strict"

    if Meteor.isClient
      # Initialize the svgMetadataReady reactive variable.
      @reactive.set 'svgMetadataReady', false

      # Get the array of SVG symbol metadata extracted from the SVG asset file.
      Meteor.call '_parseSvgMetadata', (error, metadata) ->
        if error
          throw new Meteor.Error 500, 'An error occurred; SVG metadata were not retrieved.'
        else
          # We now have SVG symbol metadata for all icons on the client.
          MD._svgMetadata = metadata

          # Set a reactive variable to indicate that metadata is ready.
          MD.reactive.set 'svgMetadataReady', true

  ###*
  # A helper to enable convenient icon insertion. The function takes an
  # arbitrary number of arguments. The first argument is expected to be the
  # icon id, and the others are interpreted as additional CSS classes.
  #
  # @private
  ###
  registerIconHelper: ->
    "use strict"

    # This helper enables direct insertion of an SVG icon using the <svg> element.
    Template.registerHelper 'mdIconSvg', ->
      "use strict"

      # Check whether we have a null input, i.e no icon is supposed to appear,
      # and return early.
      if (arguments[0] is null) or (arguments[0] is '')
        return null

      # Otherwise, the icon id is the first argument; ignore all others.
      iconId = arguments[0]
      if MD.reactive.get 'svgMetadataReady'
        # Once SVG metadata is ready, find the metadata object corresponding to
        # this id,
        svgIconMetadata = _.findWhere MD._svgMetadata, { id: iconId }
        if _.isUndefined svgIconMetadata
          throw new Meteor.Error 400, 'The SVG metadata for "' + iconId +
                                      '" was not found.'

        # then build the HTML for this SVG icon using the <svg> element.
        svgIconHTML = '<svg class="md-icon__svg" ' +
          'viewBox="' + svgIconMetadata.viewBox + '" ' +
          'preserveAspectRatio="xMidYMid meet">' +
          '<path d="' + svgIconMetadata.pathSpec + '"></path>' +
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

    string.replace '_', '-'

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

#//////  ON THE SERVER  //////
if Meteor.isServer

  #///  Define Meteor Methods  ///
  Meteor.methods(

    ###*
    # Reads and parses the SVG asset files, extracts the SVG metadata from the
    # SVG source and pushes it into an array.
    #
    # @returns {Array} - an array of objects each containing SVG metadata for
    #                    an icon
    # @private
    ###
    _parseSvgMetadata: ->
      "use strict"

      @unblock();

      # Load the xml2js library.
      xml2js = Npm.require 'xml2js'

      # Asset files containing the SVG icon source are the targets for the
      # parser.
      iconsBySymbols = MD.config.iconsBySymbols
      iconsBySvgs = MD.config.iconsBySvgs

      # Initialize the single array that will hold all the extracted SVG metadata.
      svgMetadata = []

      # Create a parser.
      parser = new xml2js.Parser()

      # Parse the icon assets, extract the metadata, and push a metadata object
      # for each icon into the svgMetadata array.

      # First the icons defined by <symbol> tags.
      _.each iconsBySymbols, (error, i) ->

        # Check the input before proceeding.
        check iconsBySymbols[i].file, String
        check iconsBySymbols[i].include, Match.Optional(Match.OneOf(String, [String]))
        check iconsBySymbols[i].stripPrefix, Match.Optional(String)
        check iconsBySymbols[i].stripSuffix, Match.Optional(String)
        check iconsBySymbols[i].addPrefix, Match.Optional(String)
        check iconsBySymbols[i].addSuffix, Match.Optional(String)
        check iconsBySymbols[i].hyphensOnly, Match.Optional(Boolean)

        # Let's parse ... each file
        parser.parseString iconsBySymbols[i].file, (error, svgObject) ->
          # ... each <symbol> element in the file
          _.each svgObject.svg.symbol, (symbol) ->
            # Get the id.
            _symbolId = symbol['$'].id
            if iconsBySymbols[i].include is 'all'
              # Use every <symbol> element. Just customize the id if configured.
              _symbolId = MD._customizeId _symbolId, iconsBySymbols[i]
              # Push (customized) metadata into the array.
              svgMetadata.push
                id: _symbolId
                viewBox: symbol['$'].viewBox
                pathSpec: symbol.path[0]['$'].d
            else
              # Use only the <symbol> elements for which the id is in the
              # include list.
              if _.contains iconsBySymbols[i].include, _symbolId
                # Customize the id if required.
                _symbolId = MD._customizeId _symbolId, iconsBySymbols[i]
                # Push (customized) metadata into the array.
                svgMetadata.push
                  id: _symbolId
                  viewBox: symbol['$'].viewBox
                  pathSpec: symbol.path[0]['$'].d

      # Next the icons defined by <svg> tags
      _.each iconsBySvgs, (error, j) ->

        # Check the input before proceeding.
        check iconsBySvgs[j].file, String
        check iconsBySvgs[j].include, Match.Optional(Match.OneOf(String, [String]))
        check iconsBySvgs[j].stripPrefix, Match.Optional(String)
        check iconsBySvgs[j].stripSuffix, Match.Optional(String)
        check iconsBySvgs[j].addPrefix, Match.Optional(String)
        check iconsBySvgs[j].addSuffix, Match.Optional(String)
        check iconsBySvgs[j].hyphensOnly, Match.Optional(Boolean)

        # Let's parse ... each file
        parser.parseString iconsBySvgs[j].file, (error, svgObject) ->
          # ... each <svg> element in the file
          _.each svgObject.svg.svg, (svg) ->
            # Get the id.
            _svgId = svg['$'].id
            if iconsBySvgs[j].include is 'all'
              # Use every <svg> element. Just customize the id if configured.
              _svgId = MD._customizeId _svgId, iconsBySvgs[j]
              # Push (customized) metadata into the array.
              svgMetadata.push
                id: _svgId
                viewBox: svg['$'].viewBox
                pathSpec: svg.path[0]['$'].d
            else
              # Use only the <svg> elements for which the id is in the include
              # list.
              if _.contains iconsBySvgs[j].include, _svgId
                # Customize the id if required.
                _svgId = MD._customizeId(_svgId, iconsBySvgs[j]);
                # Push (customized) metadata into the array.
                svgMetadata.push
                  id: _svgId
                  viewBox: svg['$'].viewBox
                  pathSpec: svg.path[0]['$'].d

      svgMetadata
  )
