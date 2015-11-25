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
  # top and bottom of the scroll range.
  #
  # @param {Object} scroller - the scrollable content div
  # @param {string} state - the state (on|off) of the scroller monitor
  ###
  scrollMonitor: (scroller, state) ->
    "use strict"

    scrollHandler = (event) ->
      "use strict"
      event.preventDefault()

      # Scrolled fully down.
      if scroller.scrollTop is 0
        scroller.classList.add 'scrolled-down'
      else
        scroller.classList.remove 'scrolled-down'
      # Scrolled fully up.
      if scroller.scrollHeight - scroller.scrollTop is scroller.clientHeight
        scroller.classList.add 'scrolled-up'
      else
        scroller.classList.remove 'scrolled-up'

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
