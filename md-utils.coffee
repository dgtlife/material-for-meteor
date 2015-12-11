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

    document.querySelector selector

  ###*
  # An alias for the lengthy document.querySelectorAll().
  #
  # @param {string} selector - the selector for the target elements
  # @returns {NodeList}
  ###
  dqSA: (selector) ->
    "use strict"

    document.querySelectorAll selector

  ###*
  # An alias for the lengthy element.querySelector().
  #
  # @param {Object} element - the element on which the query operates
  # @param {string} selector - the selector for the target element
  # @returns {Object}
  ###
  eqS: (element, selector) ->
    "use strict"

    element.querySelector selector

  ###*
  # An alias for the lengthy element.querySelectorAll().
  #
  # @param {Object} element - the element on which the query operates
  # @param {string} selector - the selector for the target element
  # @returns {NodeList}
  ###
  eqSA: (element, selector) ->
    "use strict"

    element.querySelectorAll selector

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
  #                                        in between
  ###
  scrollMonitor: (scroller, state, downCallback, upCallback, scrolledCallback) ->
    "use strict"

    scrollHandler = (event) ->
      "use strict"
      event.preventDefault()

      # Scrolled fully down.
      if scroller.scrollTop is 0
        # Reflect the status on the scroller.
        scroller.setAttribute 'data-scroll-status', 'scrolled-down'
        # Call the related callback, if one was supplied.
        if downCallback
          downCallback()
      # Scrolled fully up.
      else if scroller.scrollHeight - scroller.scrollTop is scroller.clientHeight
        # Reflect the status on the scroller.
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
                  #scroller.classList.add 'scrolling-up'
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
      "use strict"

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
