# onwheel-fix

```shell
npm install onwheel-fix
```
[Documentation](https://pixelass.github.io/onwheel-fix/)

[![npm](https://img.shields.io/npm/v/onwheel-fix.svg)](https://www.npmjs.com/package/onwheel-fix)
[![GitHub license](https://img.shields.io/github/license/pixelass/onwheel-fix.svg)](https://github.com/pixelass/onwheel-fix/blob/master/LICENSE)
[![Travis](https://img.shields.io/travis/pixelass/onwheel-fix.svg)](https://travis-ci.org/pixelass/onwheel-fix)
[![David](https://img.shields.io/david/pixelass/onwheel-fix.svg)](https://david-dm.org/pixelass/onwheel-fix)
[![David](https://img.shields.io/david/dev/pixelass/onwheel-fix.svg)](https://david-dm.org/pixelass/onwheel-fix#info=devDependencies&view=table)
[![GitHub issues](https://img.shields.io/github/issues/pixelass/onwheel-fix.svg)](https://github.com/pixelass/onwheel-fix/issues)
[![GitHub forks](https://img.shields.io/github/forks/pixelass/onwheel-fix.svg)](https://github.com/pixelass/onwheel-fix/network)
[![GitHub stars](https://img.shields.io/github/stars/pixelass/onwheel-fix.svg)](https://github.com/pixelass/onwheel-fix/stargazers)
[![Coveralls branch](https://img.shields.io/coveralls/pixelass/onwheel-fix.svg)](https://coveralls.io/github/pixelass/onwheel-fix)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
[![Standard Version](https://img.shields.io/badge/release-standard%20version-brightgreen.svg)](https://github.com/conventional-changelog/standard-version)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)



Mousewheel fix for certain browsers that just don't get it right
Includes:

- fix for Safari 9:
  in Safari 9 the default event is debounced, therefore broken.
  The issue seems to occur due to the eleastic scroll and appeared with Safari 9
  which allows eleasic scroll in nested containers.
  to fix this issue the `html` and/or `body` element usually has to be set to `overflow: hidden;`.
  In many cases this comes with drawbacks or breaks other things.
  Preventing the default event and then applying the `deltaY` to the `scrollTop`
  of the rootNode fixes the issue without other hacks.
  - Attemt: prevent the mousewheel event and move the rootNode manually.
  - Concern: impact on performance?

[Safari bugreport](https://bugs.webkit.org/show_bug.cgi?id=149526)

```js
import FixWheel from 'onwheel-fix'

const mousewheel = new FixWheel()

mousewheel.init(document.body)
mousewheel.destroy()
```

## Methods

### `init(rootNode) -> Boolean`
initializes the fix
* rootNode: a DOM node, usually `document.body` but can be any other root element.

### `destroy() -> Boolean`
removes the fix
