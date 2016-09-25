/**
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

import browser from 'detect-browser'

/**
 * major browser version parsed from `detect-browser.js`'s result
 * @type {Number}
 */
const majorVersion = parseInt(browser.version.split('.')[0], 10)

/**
 * flag to find Safari 9 & 10 since it is known to have a bug
 * @see  https://bugs.webkit.org/show_bug.cgi?id=149526
 * @type {Boolean}
 */
const isSafari = (browser.name === 'safari')
const isSafari9 = (isSafari && majorVersion === 9)
const isSafari10 = (isSafari && majorVersion === 10)

/**
 * flag to determine if we need to modify the `mousewheel` event
 * currently only Safari 9 & 10 gets this wrong.
 * @type {Boolean}
 */
const mouseNeedsHelp = isSafari9 || isSafari10

/**
 * allows to create an instance that can be initialised and destroyed when needed
 * usually initialized on `document.ready` or when mounting a root component
 * and destroyed when a root component is unmounted
 */
class FixWheel {
  constructor (eventName) {
    this.eventName = eventName
    this.fixWheel = this.fixWheel.bind(this)
    this.checkOverflow = this.checkOverflow.bind(this)
  }

  /**
   * this method applys the fix for wheel events in browsers with faulty implementation
   * @param  {HTMLElement} rootNode a DOM node, usually `document.body` but can be any other root element.
   * @return {Boolean} returns `true` when applied, otherwise `false`.
   *                   Mainly used for debugging but can be used as a flag.
    */
  init (rootNode, force = false) {
    if (mouseNeedsHelp || force) {
      this.rootNode = rootNode
      this.rootNode.addEventListener(this.eventName, this.fixWheel, false)
      this.isFixed = true
    }
    return this.isFixed
  }

  /**
   * destroys the helper. removes the fix if it has been applied
   * @return {Boolean} should always return `false`.
   *                   Mainly used for debugging but can be used as a flag.
   */
  destroy () {
    if (this.isFixed) {
      this.rootNode.removeEventListener(this.eventName, this.fixWheel)
      this.isFixed = false
    }
    return this.isFixed
  }

  /**
   * prevent the default event
   * @param  {Object} e mousewheel event
   */
  preventDefault (e) {
    e.preventDefault()
  }

  /**
   * check the overflow. If it is `scroll` or `auto`, check the scrollOffset.
   * If the element is scrollable, apply scrollTop, otherwise check the `parentNode`
   * @param  {HTMLElement} el the starts a the `event.target` then any ancestor of that element
   * @return {HTMLElement}            Returns the original element or the next scrollable ancestor.
   *                                  Returns `null` if no element matched the criteria.
   */
  checkOverflow (el, deltaY) {
    const {clientHeight, scrollHeight, scrollTop} = el
    // get compouted CSS so we can check if the element is scrollable
    const css = window.getComputedStyle(el)
    const scrollable = css.overflowY === 'scroll' || css.overflowY === 'auto'
    if (scrollable) {
      // check if the content is higher than the element
      const overflows = clientHeight < scrollHeight
      if (overflows) {
        // check if the element is fully scrolled top or bottom
        const atEnd = clientHeight + scrollTop >= scrollHeight
        const atStart = scrollTop === 0
        if ((deltaY > 0 && !atEnd) || (deltaY < 0 && !atStart)) {
          return el
        } else if (deltaY === 0) {
          return null
        }
      }
    }
    // check for `parentNode` otherwise proceed and return `null`
    if (el.parentNode) {
      if (el.parentNode === this.rootNode) {
        return this.rootNode
      }
      return this.checkOverflow(el.parentNode, deltaY)
    }
    return null
  }

  /**
   * the actual fix for the issue.
   * @param  {Object} e mousewheel event
   * @param  {Number} e.deltaY wheel delta on the y-axis (if undefined simply does nothing)
   */
  fixWheel (e) {
    this.preventDefault(e)
    const node = this.checkOverflow(e.target, e.deltaY)
    if (node) {
      node.scrollTop += e.deltaY
    }
  }
}

export default FixWheel
