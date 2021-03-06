(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _src = require('./src');

var _src2 = _interopRequireDefault(_src);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

window.FixWheel = _src2.default; // global window

},{"./src":5}],2:[function(require,module,exports){
var detectBrowser = require('./lib/detectBrowser');

module.exports = detectBrowser(navigator.userAgent);

},{"./lib/detectBrowser":3}],3:[function(require,module,exports){
module.exports = function detectBrowser(userAgentString) {
  var browsers = [
    [ 'edge', /Edge\/([0-9\._]+)/ ],
    [ 'chrome', /(?!Chrom.*OPR)Chrom(?:e|ium)\/([0-9\.]+)(:?\s|$)/ ],
    [ 'crios', /CriOS\/([0-9\.]+)(:?\s|$)/ ],
    [ 'firefox', /Firefox\/([0-9\.]+)(?:\s|$)/ ],
    [ 'opera', /Opera\/([0-9\.]+)(?:\s|$)/ ],
    [ 'opera', /OPR\/([0-9\.]+)(:?\s|$)$/ ],
    [ 'ie', /Trident\/7\.0.*rv\:([0-9\.]+)\).*Gecko$/ ],
    [ 'ie', /MSIE\s([0-9\.]+);.*Trident\/[4-7].0/ ],
    [ 'ie', /MSIE\s(7\.0)/ ],
    [ 'bb10', /BB10;\sTouch.*Version\/([0-9\.]+)/ ],
    [ 'android', /Android\s([0-9\.]+)/ ],
    [ 'ios', /iPad.*Version\/([0-9\._]+)/ ],
    [ 'ios',  /iPhone.*Version\/([0-9\._]+)/ ],
    [ 'safari', /Version\/([0-9\._]+).*Safari/ ]
  ];

  var i = 0, mapped =[];
  for (i = 0; i < browsers.length; i++) {
    browsers[i] = createMatch(browsers[i]);
    if (isMatch(browsers[i])) {
      mapped.push(browsers[i]);
    }
  }

  var match = mapped[0];
  var parts = match && match[3].split(/[._]/).slice(0,3);

  while (parts && parts.length < 3) {
    parts.push('0');
  }

  function createMatch(pair) {
    return pair.concat(pair[1].exec(userAgentString));
  }

  function isMatch(pair) {
    return !!pair[2];
  }

  // return the name and version
  return {
    name: match && match[0],
    version: parts && parts.join('.'),
  };
};

},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
}(); /**
      * Mousewheel fix for certain browsers that just don't get it right
      * Includes:
      *
      * - fix for Safari 9 & 10:
      *   in Safari 9 & 10 the default event is debounced, therefore broken.
      *   The issue seems to occur due to the eleastic scroll and appeared with Safari 9
      *   which allows eleasic scroll in nested containers.
      *   to fix this issue the `html` and/or `body` element usually has to be set to `overflow: hidden;`.
      *   In many cases this comes with drawbacks or breaks other things.
      *   Preventing the default event and then applying the `deltaY` to the `scrollTop`
      *   of the rootNode fixes the issue without other hacks.
      *   - Attemt: prevent the mousewheel event and move the rootNode manually.
      *   - Concern: impact on performance?
      * @see  https://bugs.webkit.org/show_bug.cgi?id=149526
      * @author  Gregor Adams <greg@pixelass.com>
      * @license  MIT
      */

var _detectBrowser = require('detect-browser');

var _detectBrowser2 = _interopRequireDefault(_detectBrowser);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

/**
 * major browser version parsed from `detect-browser.js`'s result
 * @type {Number}
 */
var majorVersion = parseInt(_detectBrowser2.default.version.split('.')[0], 10);

/**
 * flag to find Safari 9 & 10 since it is known to have a bug
 * @see  https://bugs.webkit.org/show_bug.cgi?id=149526
 * @type {Boolean}
 */
var isSafari = _detectBrowser2.default.name === 'safari';
var isSafari9 = isSafari && majorVersion === 9;
var isSafari10 = isSafari && majorVersion === 10;

/**
 * flag to determine if we need to modify the `mousewheel` event
 * currently only Safari 9 & 10 gets this wrong.
 * @type {Boolean}
 */
var mouseNeedsHelp = isSafari9 || isSafari10;

/**
 * allows to create an instance that can be initialised and destroyed when needed
 * usually initialized on `document.ready` or when mounting a root component
 * and destroyed when a root component is unmounted
 */

var FixWheel = function () {
  function FixWheel(eventName) {
    _classCallCheck(this, FixWheel);

    this.eventName = eventName;
    this.fixWheel = this.fixWheel.bind(this);
    this.checkOverflow = this.checkOverflow.bind(this);
  }

  /**
   * this method applys the fix for wheel events in browsers with faulty implementation
   * @param  {HTMLElement} rootNode a DOM node, usually `document.body` but can be any other root element.
   * @return {Boolean} returns `true` when applied, otherwise `false`.
   *                   Mainly used for debugging but can be used as a flag.
    */

  _createClass(FixWheel, [{
    key: 'init',
    value: function init(rootNode) {
      var force = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

      if (mouseNeedsHelp || force) {
        this.rootNode = rootNode;
        this.rootNode.addEventListener(this.eventName, this.fixWheel, false);
        this.isFixed = true;
      }
      return this.isFixed;
    }

    /**
     * destroys the helper. removes the fix if it has been applied
     * @return {Boolean} should always return `false`.
     *                   Mainly used for debugging but can be used as a flag.
     */

  }, {
    key: 'destroy',
    value: function destroy() {
      if (this.isFixed) {
        this.rootNode.removeEventListener(this.eventName, this.fixWheel);
        this.isFixed = false;
      }
      return this.isFixed;
    }

    /**
     * prevent the default event
     * @param  {Object} e mousewheel event
     */

  }, {
    key: 'preventDefault',
    value: function preventDefault(e) {
      e.preventDefault();
    }

    /**
     * check the overflow. If it is `scroll` or `auto`, check the scrollOffset.
     * If the element is scrollable, apply scrollTop, otherwise check the `parentNode`
     * @param  {HTMLElement} el the starts a the `event.target` then any ancestor of that element
     * @return {HTMLElement}            Returns the original element or the next scrollable ancestor.
     *                                  Returns `null` if no element matched the criteria.
     */

  }, {
    key: 'checkOverflow',
    value: function checkOverflow(el, deltaY) {
      var clientHeight = el.clientHeight;
      var scrollHeight = el.scrollHeight;
      var scrollTop = el.scrollTop;
      // get compouted CSS so we can check if the element is scrollable

      var css = window.getComputedStyle(el);
      var scrollable = css.overflowY === 'scroll' || css.overflowY === 'auto';
      if (scrollable) {
        // check if the content is higher than the element
        var overflows = clientHeight < scrollHeight;
        if (overflows) {
          // check if the element is fully scrolled top or bottom
          var atEnd = clientHeight + scrollTop >= scrollHeight;
          var atStart = scrollTop === 0;
          if (deltaY > 0 && !atEnd || deltaY < 0 && !atStart) {
            return el;
          } else if (deltaY === 0) {
            return null;
          }
        }
      }
      // check for `parentNode` otherwise proceed and return `null`
      if (el.parentNode) {
        if (el.parentNode === this.rootNode) {
          return this.rootNode;
        }
        return this.checkOverflow(el.parentNode, deltaY);
      }
      return null;
    }

    /**
     * the actual fix for the issue.
     * @param  {Object} e mousewheel event
     * @param  {Number} e.deltaY wheel delta on the y-axis (if undefined simply does nothing)
     */

  }, {
    key: 'fixWheel',
    value: function fixWheel(e) {
      this.preventDefault(e);
      var node = this.checkOverflow(e.target, e.deltaY);
      if (node) {
        node.scrollTop += e.deltaY;
      }
    }
  }]);

  return FixWheel;
}();

exports.default = FixWheel;

},{"detect-browser":2}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fixWheel = require('./fix-wheel');

var _fixWheel2 = _interopRequireDefault(_fixWheel);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

exports.default = _fixWheel2.default;

},{"./fix-wheel":4}]},{},[1]);
