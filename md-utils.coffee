###
  @file Defines some MD utility function that support the MD API.
  @author Derek Gransaull <derek@dgtlife.com>
  @copyright DGTLife, LLC 2015

  Created on 10/15/2015
###

_.extend Material.prototype,

  ###*
  # An alias for the lengthy document.getElementById().
  #
  # @param {string} id - the id of the target element
  # @returns {Object}
  ###
  dgEBI: (id) ->
    "use strict"

    document.getElementById id

  ###*
  # An alias for the lengthy document.querySelector().
  #
  # @param {string} selector - the selector for the target element
  # @returns {Object}
  ###
  dqS: (selector) ->
    "use strict"

    document.querySelector(selector)

  ###*
  # An alias for the lengthy document.querySelectorAll().
  #
  # @param {string} selector - the selector for the target elements
  # @returns {NodeList}
  ###
  dqSA: (selector) ->
    "use strict"

    document.querySelectorAll(selector)

  ###*
  # An alias for the lengthy element.querySelector().
  #
  # @param {Object} element - the element on which the query operates
  # @param {string} selector - the selector for the target element
  # @returns {Object}
  ###
  eqS: (element, selector) ->
    "use strict"

    element.querySelector(selector)

  ###*
  # An alias for the lengthy element.querySelectorAll().
  #
  # @param {Object} element - the element on which the query operates
  # @param {string} selector - the selector for the target element
  # @returns {NodeList}
  ###
  eqSA: (element, selector) ->
    "use strict"

    element.querySelectorAll(selector)

  ###*
  # Monitor a scrollable content div (scroller) to determine when it is at the
  # top and bottom of the scroll range, or somewhere in between.
  #
  # @param {Object} scroller - the scrollable content div
  # @param {string} state - the state (on|off) of the scroller monitor
  # @param {Function} [downCallback] - the function to call when the scroller is
  #                                    fully scrolled down
  # @param {Function} [upCallback] - the function to call when the scroller is
  #                                  fully scrolled up
  # @param {Function} [scrolledCallback] - the function to call when the
  #                                        scroller is scrolled somewhere in
  #                                        between
  ###
  scrollMonitor: (scroller, state, downCallback, upCallback, scrolledCallback) ->
    "use strict"

    scrollHandler = (event) ->
      event.preventDefault()

      if scroller.scrollTop is 0
        # Scrolled fully down. Reflect the status on the scroller.
        scroller.setAttribute 'data-scroll-status', 'scrolled-down'
        # Call the related callback, if one was supplied.
        if downCallback
          downCallback()
      else if scroller.scrollHeight - scroller.scrollTop is scroller.clientHeight
        # Scrolled fully up. Reflect the status on the scroller.
        scroller.setAttribute 'data-scroll-status', 'scrolled-up'
        # Call the related callback, if one was supplied.
        if upCallback
          upCallback()
      else
        # Detect scroll direction.
        @currentY = scroller.scrollTop
        if @previousY
          @currentDistance = @currentY - @previousY
          if @previousDistance
            if @distanceValues
              if @distanceValues.length <= 2
                @distanceValues.push @currentDistance
              else
                if @distanceValues[@distanceValues.length - 1] > @distanceValues[0]
                  scrollDirection = 'up'
                  scroller.setAttribute 'data-scroll-status', 'scrolling-up'
                else if @distanceValues[@distanceValues.length - 1] < @distanceValues[0]
                  scrollDirection = 'down'
                  scroller.setAttribute 'data-scroll-status', 'scrolling-down'
                else
                  scrollDirection = 'unknown'
                  scroller.setAttribute 'data-scroll-status', 'unknown'
                # Re-initialize the distanceValues array.
                @distanceValues = []
            else
              # Initialize the record of Y distances.
              @distanceValues = []
          else
            # Set the initial Y distance.
            @previousDistance = @currentDistance
        else
          # Set the initial Y coordinate.
          @previousY = @currentY

        # Call the related callback, if one was supplied.
        if scrolledCallback
          scrolledCallback scrollDirection

    # Turn the handler ON or OFF.
    if state is 'on'
      scroller.onscroll = scrollHandler
    else
      scroller.onscroll = null

  ###*
  # Insert the backdrop.
  #
  # @param {string} type - (default|drawer|modal dialog) the type of the backdrop
  # @param {number} [opacity] - the optional opacity of the backdrop
  ###
  _insertBackdrop: (type, opacity) ->
    "use strict"

    if @dqS '[data-backdrop]'
      # The backdrop element already exists.
      backdrop = @dqS '[data-backdrop]'
    else
      # The backdrop does not already exist, so create it.
      backdrop = document.createElement 'div'
      backdrop.setAttribute 'data-backdrop', 'true'
      backdrop.classList.add 'md-backdrop'
      # Insert the backdrop into the DOM.
      document.body.appendChild backdrop

    if type is 'drawer'
      # It's for a drawer. Ensure the 'md-backdrop--drawer' class is present.
      if not backdrop.classList.contains 'md-backdrop--drawer'
        backdrop.className = ''
        backdrop.classList.add 'md-backdrop', 'md-backdrop--drawer'
      opacity = opacity or 0.3
    else if type is 'modal dialog'
      # It's for a modal dialog. Ensure the 'md-backdrop--modal' class is
      # present.
      if not backdrop.classList.contains 'md-backdrop--modal'
        backdrop.className = ''
        backdrop.classList.add 'md-backdrop', 'md-backdrop--modal'
      # If an opacity was provided along with 'modal dialog' type, then this
      # opacity should override the default modal opacity of 0.75.
      opacity = opacity or 0.75
    else
      # It's for a regular dialog. Ensure the 'md-backdrop--dialog' class, is
      # present.
      if not backdrop.classList.contains 'md-backdrop--dialog'
        backdrop.className = ''
        backdrop.classList.add 'md-backdrop', 'md-backdrop--dialog'
      # If an opacity was provided, then this opacity should override the
      # default of 0.
      opacity = opacity or 0
    # Set final opacity.
    backdrop.style.opacity = opacity
    # Display the backdrop, if necessary.
    if not backdrop.hasAttribute 'data-backdrop-open'
      backdrop.setAttribute 'data-backdrop-open', 'true'

  ###*
  # Remove the backdrop.
  ###
  _removeBackdrop: ->
    "use strict"

    backdrop = @dqS '[data-backdrop]'
    if backdrop
      # Define a callback to remove the backdrop.
      __removeBackdrop = ->
        if backdrop and backdrop.parentElement
          # It was not removed by a preceding event, so remove it.
          backdrop.parentElement.removeChild(backdrop)

      if backdrop.style.opacity is '0'
        # There will be no transition and therefore no transitionend event, so
        # we can just remove it immediately.
        __removeBackdrop()
      else
        # Trigger opacity transition.
        backdrop.style.opacity = '0'
        # Wait for transition to be completed to effect a smooth removal.
        # Set up an event listener for the end of the transition.
        eventNames = ['transitionend', 'webkitTransitionEnd', 'mozTransitionEnd']
        _.each eventNames, (eventName) ->
          backdrop.addEventListener eventName, __removeBackdrop

  ###*
  # Convert a NodeList to an Array.
  #
  # @param {NodeList} nodeList - the result of a document.querySelectorAll() call
  # @returns {Array} - a proper array of elements
  ###
  nodeListToArray: (nodeList) ->
    "use strict"

    elementArray = []
    elementArray.push node for node in nodeList
    elementArray

  ###*
  # A platform detection utility.
  ###
  runPlatformDetection: () ->
    "user strict"

    userAgentString = (window.navigator and window.navigator.userAgent) or ''
    # Define a parsing function that detects the desired cases.
    parseAgentString = (uaString) ->
      contains = (string) ->
        (string).test uaString

      return {
        # Chrome on a Desktop.
        isChromeOnDesktop: contains(/(?!Android)Macintosh.*AppleWebKit.*(Chrome\/[.0-9]* (?!Mobile))/)

        # Chrome on an Android device.
        isChromeOnAndroid: contains(/Linux.*Android.*WebKit.*(Chrome\/[.0-9]*)/)

        # Chrome on an Android Phone.
        isChromeOnAndroidPhone: contains(/Linux.*Android.*WebKit.*(Chrome\/[.0-9]* Mobile)/)

        # Chrome on an Android Tablet.
        isChromeOnAndroidTablet: contains(/Linux.*Android.*WebKit.*(Chrome\/[.0-9]* (?!Mobile))/)

        # Chrome on an iPhone.
        isChromeOnIphone: contains(/iPhone.*WebKit.*(CriOS\/[.0-9]* Mobile)/)

        # Safari on a Desktop
        isSafariOnDesktop: contains(/Macintosh.*AppleWebKit.*(Version\/[.0-9]*)(?!.*Chrome)(?!Mobile)/)

        # Safari on an iPhone
        isSafariOnIphone: contains(/iPhone.*WebKit\/[.0-9](?!.*Chrome).* Mobile/)

        # Safari on an iPad
        isSafariOnIpad: contains(/iPad.*WebKit\/[.0-9](?!.*Chrome).* Mobile/)

        # Safari on iOS
        isSafariOnIos: contains(/iPhone.*WebKit\/[.0-9](?!.*Chrome).* Mobile/) or
                       contains(/iPad.*WebKit\/[.0-9](?!.*Chrome).* Mobile/)

        # Firefox on a Desktop
        isFirefoxOnDesktop: contains(/(Gecko\/[.0-9]*).*(Firefox\/[.0-9]*)/)

        # Opera on a Desktop
        isOperaOnDesktop: contains(/(Opera\/[.0-9]*).*(Presto\/[.0-9]*)/)
      }

    # Assign the value of the platform object.
    @platform = parseAgentString userAgentString

    # /////  Reference user agent strings:
    # Chrome on Desktop:   "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.30 Safari/537.36"
    # Chrome on Android:   "Mozilla/5.0 (Linux; Android 5.1.1; Nexus 5 Build/LMY48B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.93 Mobile Safari/537.36"
    # Safari on Desktop:   "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_3) AppleWebKit/600.6.3 (KHTML, like Gecko) Version/8.0.6 Safari/600.6.3"
    # Safari on iPhone:    "Mozilla/5.0 (iPhone; CPU iPhone OS 8_3 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) Mobile/12F70"
    # Safari on iPad:      "Mozilla/5.0 (iPad; CPU OS 8_3 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) Version/8.0 Mobile/12F69 Safari/600.1.4"
    # Firefox on Desktop:  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.10; rv:29.0) Gecko/20100101 Firefox/29.0"
    # Opera on Desktop:    "Opera/9.80 (Macintosh; Intel Mac OS X 10.10.2) Presto/2.12.388 Version/12.16"
