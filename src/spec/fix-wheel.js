
/* global describe, it, window, document */
global.window = global.window || {
  addEventListener: (event, handler, useCapture) => {},
  removeEventListener: (event, handler, useCapture) => {}
}
global.document = global.document || {
  body: {
    addEventListener: (event, handler, useCapture) => {},
    removeEventListener: (event, handler, useCapture) => {},
    scrollTop: 0
  }
}

import {expect} from 'chai'
import FixWheel from '..'

describe('FixWheel', () => {
  describe('Constructor', () => {
    it('is a constructor', () => {
      const fn = () => {
        const wheel = new FixWheel('wheel')
        wheel.init(document.body)
      }
      expect(fn).to.not.throw()
    })

    it('can have multiple instances', () => {
      const wheel = new FixWheel('wheel')
      const wheel2 = new FixWheel('wheel')
      expect(wheel).to.be.instanceof(FixWheel)
      expect(wheel2).to.be.instanceof(FixWheel)
    })

    it('can be called with different events', () => {
      const fn1 = () => {
        const wheel = new FixWheel('wheel')
        wheel.init(document.body)
      }
      const fn2 = () => {
        const wheel = new FixWheel('mousewheel')
        wheel.init(document.body)
      }
      expect(fn1).to.not.throw()
      expect(fn2).to.not.throw()
    })
  })

  describe('Instances', () => {
    it('returns an object', () => {
      const wheel = new FixWheel('wheel')
      expect(wheel).to.be.a('object')
    })

    it('returns methods', () => {
      const wheel = new FixWheel('wheel')
      expect(wheel).itself.to.respondTo('init')
      expect(wheel).itself.to.respondTo('destroy')
      expect(wheel).itself.to.respondTo('preventDefault')
      expect(wheel).itself.to.respondTo('fixWheel')
      wheel.init(document.body, true)
      wheel.preventDefault({preventDefault () {}})
      wheel.fixWheel({deltaY: 0, preventDefault () {}})
    })

    it('has an init method', () => {
      const wheel = new FixWheel('wheel')
      expect(wheel).itself.to.respondTo('init')
      expect(wheel.init).to.be.a('function')
    })

    it('has an destroy method', () => {
      const wheel = new FixWheel('wheel')
      expect(wheel).itself.to.respondTo('destroy')
      expect(wheel.destroy).to.be.a('function')
    })

    describe('Methods', () => {
      it('can be initialized', () => {
        const wheel = new FixWheel('wheel')
        expect(wheel.init(document.body, true)).to.be.true
      })

      it('can remain unapplied', () => {
        const wheel = new FixWheel('wheel')
        expect(wheel.init(document.body)).to.be.falsy
      })

      it('can be destroyed', () => {
        const wheel = new FixWheel('wheel')
        expect(wheel.init(document.body, true)).to.be.true
        expect(wheel.destroy()).to.be.false
        expect(wheel.init(document.body)).to.be.falsy
        expect(wheel.destroy()).to.be.false
      })
    })
  })
})
