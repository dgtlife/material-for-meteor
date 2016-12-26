###
  @file API and on-render callback for MD Image.
  @author Derek Gransaull <derek@dgtlife.com>
  @copyright DGTLife, LLC 2015

  Created on 11/4/2015
###
{ Template } = require 'meteor/templating'
{ _ } = require 'meteor/underscore'
eqS = require('../../api/md-utils.js').eqS
reserveImageSpace = require('../../api/md-image-api.js').reserveImageSpace
setPlaceholderBgColor = require('../../api/md-image-api.js').setPlaceholderBgColor
setPlaceholderImage = require('../../api/md-image-api.js').setPlaceholderImage
setImageAsBackground = require('../../api/md-image-api.js').setImageAsBackground
setImgSize = require('../../api/md-image-api.js').setImgSize
require './md-image.jade'

# On-render callback for MD Image.
Template.md_image.onRendered ->
  instance = @

  image = instance.firstNode
  placeholder = eqS image, '[data-image-placeholder]'
  reserveImageSpace image
  setPlaceholderBgColor image, placeholder
  setPlaceholderImage image, placeholder
  if instance.data.sizing
    # The image will be a background to the .md-image div.
    #
    # A function to render the image as specified in the 'data-bg-url' attribute
    # into the background with appropriate sizing.
    renderImage = (mdImage, templateData) ->
      setImageAsBackground(mdImage, templateData)
      mdImagePlaceholder = eqS mdImage, '[data-image-placeholder]'
      if mdImage.hasAttribute 'data-fade'
        mdImagePlaceholder.classList.add 'faded-out'
      else
        mdImagePlaceholder.setAttribute 'style', 'opacity: 0;'
    # The initial render.
    renderImage image, instance.data

    # Make the image reactive to a change in the values of template data. First,
    # define a function that detects the relevant changes and calls
    # renderImage.
    detectRelevantAttributeChanges = (mutations) ->
      _.each mutations, (mutation) ->
        if (mutation.attributeName is 'data-bg-url') or
          (mutation.attributeName is 'data-height') or
          (mutation.attributeName is 'data-width') or
          (mutation.attributeName is 'data-sizing')
            renderImage(mutation.target)
    # Define a mutation observer for attribute changes on the image that calls
    # the detector function.
    if not onAttributeChange
      onAttributeChange = new MutationObserver detectRelevantAttributeChanges
      onAttributeChange.observe image,
        attributes: true
  else
    # The image will be rendered normally.
    eqS(image, '[data-image-img]').onload = ->
      setImgSize image, @
      if image.hasAttribute 'data-fade'
        placeholder.classList.add 'faded-out'
      else
        placeholder.setAttribute 'style', 'opacity: 0;'
