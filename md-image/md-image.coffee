###
  @file API and on-render callback for MD Image.
  @author Derek Gransaull <derek@dgtlife.com>
  @copyright DGTLife, LLC 2015

  Created on 11/4/2015
###

#/////////////////////    EXTEND MD API FOR MD LABEL    ////////////////////////
_.extend Material.prototype,

  ###*
  # Reserve space for the MD Image.
  #
  # @param {Object} image - the MD Image element
  # @private
  ###
  _reserveImageSpace: (image) ->
    "use strict"

    if image.hasAttribute('data-height') and image.hasAttribute('data-width')
      height = image.getAttribute 'data-height'
      width = image.getAttribute 'data-width'
      imageStyle = 'height: ' + height + 'px; width: ' + width + 'px;'
      image.setAttribute 'style', imageStyle
    #else
    # throw new Meteor.Error 'The height and width of an MD Image are required.'

  ###*
  # Set the background color of the placeholder.
  #
  # @param {Object} image - the MD Image element
  # @param {Object} placeholder - the embedded placeholder element
  # @private
  ###
  _setPlaceholderBgColor: (image, placeholder) ->
    "use strict"

    if image.hasAttribute 'data-placeholder-bg'
      bgStyle = 'background-color: ' + image.getAttribute 'data-placeholder-bg'
      placeholder.setAttribute 'style', bgStyle

  ###*
  # Set the background image of the placeholder.
  #
  # @param {Object} image - the MD Image element
  # @param {Object} placeholder - the embedded placeholder element
  # @private
  ###
  _setPlaceholderImage: (image, placeholder) ->
    "use strict"

    if image.hasAttribute 'data-placeholder-img'
      imageSrc = image.getAttribute 'data-placeholder-img'
      placeholder.setAttribute 'style', 'background-image: ' + imageSrc + ';'

  ###*
  # Set the size of the embedded img element.
  #
  # @param {Object} image - the MD Image element
  # @param {Object} img - the embedded img element
  # @private
  ###
  _setImgSize: (image, img) ->
    "use strict"

    if image.hasAttribute('data-height') and image.hasAttribute('data-width')
      height = image.getAttribute 'data-height'
      width = image.getAttribute 'data-width'
      img.height = height
      img.width = width

  ###*
  # Set the image as a background image for the .md-image, and apply the sizing.
  #
  # @param {Object} image - the MD Image element
  # @param {string} [data] - data from the md_image template
  # @private
  ###
  _setImageAsBackground: (image, data) ->
    "use strict"

    if not data
      # The image is being re-rendered after a change in data-bg-url. Compose
      # the data object from the values in the changed element.
      data = {}
      data.height = image.getAttribute 'data-height'
      data.width = image.getAttribute 'data-width'
      data.bg_url = image.getAttribute 'data-bg-url'
      data.sizing = image.getAttribute 'data-sizing'
    # Compose a style string.
    imageStyle = 'height: ' + data.height + 'px; ' +
                 'width: ' + data.width + 'px; ' +
                 'background-image: url(' + data.bg_url + '); ' +
                 'background-position: 50% 50%; ' +
                 'background-repeat: no-repeat; ' +
                 'background-size: ' + data.sizing + ';'
    # Set the style attribute.
    image.setAttribute 'style', imageStyle

#/////////////////////  ON-RENDER CALLBACK FOR MD IMAGE  ///////////////////////
Template.md_image.onRendered ->
  "use strict"
  instance = @

  image = @firstNode
  placeholder = MD.eqS image, '[data-image-placeholder]'
  MD._reserveImageSpace image
  MD._setPlaceholderBgColor image, placeholder
  MD._setPlaceholderImage image, placeholder
  if @data.sizing
    # The image will be a background to the .md-image div.
    #
    # A function to render the image as specified in the 'data-bg-url' attribute
    # into the background with appropriate sizing.
    __renderImage = (mdImage, templateData) ->
      MD._setImageAsBackground(mdImage, templateData)
      mdImagePlaceholder = MD.eqS mdImage, '[data-image-placeholder]'
      if mdImage.hasAttribute 'data-fade'
        mdImagePlaceholder.classList.add 'faded-out'
      else
        mdImagePlaceholder.setAttribute 'style', 'opacity: 0;'
    # The initial render.
    __renderImage image, instance.data

    # Make the image reactive to a change in the values of template data. First,
    # define a function that detects the relevant changes and calls
    # __renderImage.
    __detectRelevantAttributeChanges = (mutations) ->
      _.each mutations, (mutation) ->
        if (mutation.attributeName is 'data-bg-url') or
          (mutation.attributeName is 'data-height') or
          (mutation.attributeName is 'data-width') or
          (mutation.attributeName is 'data-sizing')
            __renderImage(mutation.target)
    # Define a mutation observer for attribute changes on the image that calls
    # the detector function.
    if not onAttributeChange
      onAttributeChange = new MutationObserver __detectRelevantAttributeChanges
      onAttributeChange.observe image,
        attributes: true
  else
    # The image will be rendered normally.
    MD.eqS(image, '[data-image-img]').onload = ->
      self = this

      MD._setImgSize image, self
      if image.hasAttribute 'data-fade'
        placeholder.classList.add 'faded-out'
      else
        placeholder.setAttribute 'style', 'opacity: 0;'
