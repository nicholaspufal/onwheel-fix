# onwheel-fix

```shell
npm install onwheel-fix
```


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
