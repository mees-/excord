/* eslint no-unused-expressions: off */
const { Router } = require('../../')
const compileMatcher = require('path-to-matcher')
const { describe, it } = require('mocha')
const chai = require('chai')
const { spy } = require('sinon')
const sinonChai = require('sinon-chai')

chai.use(sinonChai)

const { expect } = chai

describe('router', () => {
  it('should return a new router', () => {
    const pathHead = 'pathHead'
    const router = new Router({ pathHead })
    expect(router).to.be.an.instanceof(Router)
    expect(router.pathHead).to.equal(pathHead)
  })

  describe('#use', () => {
    it('should add the middleware to the chain with path specified', () => {
      const router = new Router()
      const path = 'hi'
      const match = compileMatcher(path, { end: false })
      const middleware = (req, res, next) => {
        next()
      }
      router.use(path, middleware)
      expect(router.middleware[0].match.pathParts).to.eql(match.pathParts)
      expect(router.middleware[0].handle).to.equal(middleware)
    })

    it('should add the middleware to the chain without path', () => {
      const router = new Router()
      const middleware = (req, res, next) => {
        next()
      }
      router.use(middleware)
      expect(router.middleware[0].handle).to.equal(middleware)
    })

    it('should correctly add multiple middleware', () => {
      const router = new Router()
      const middleware = (req, res, next) => next()
      for (let i = 0; i < 5; i++) {
        router.use(i.toString(), middleware)
      }

      for (let i = 0; i < 5; i++) {
        expect(router.middleware[i].match.pathParts).to.eql([i.toString()])
        expect(router.middleware[i].handle).to.equal(middleware)
      }
    })
  })

  describe('#hit', () => {
    it('should add the middleware to the chain with path specified', () => {
      const router = new Router()
      const path = 'hi'
      const match = compileMatcher(path, { end: true })
      const middleware = (req, res, next) => {
        next()
      }
      router.hit(path, middleware)
      expect(router.middleware[0].match.pathParts).to.eql(match.pathParts)
      expect(router.middleware[0].handle).to.equal(middleware)
    })

    it('should throw if no path is specified', () => {
      const router = new Router()
      const middleware = (req, res, next) => {
        next()
      }

      const toTest = router.hit.bind(router, middleware)
      expect(toTest).to.throw(Error)
    })

    it('should correctly add multiple middleware', () => {
      const router = new Router()
      const middleware = (req, res, next) => next()
      for (let i = 0; i < 5; i++) {
        router.hit(i.toString(), middleware)
      }

      for (let i = 0; i < 5; i++) {
        expect(router.middleware[i].match.pathParts).to.eql([i.toString()])
        expect(router.middleware[i].handle).to.equal(middleware)
      }
    })
  })

  describe('#handle', () => {
    it('should 1 middleware once if path matches', () => {
      const router = new Router()

      const handler = (req, res, next) => next()
      const spied = spy(handler)

      const route = 'test path'

      router.use(route, spied)
      router.handle({ route }, {}, () => {})
      expect(spied).to.have.been.calledOnce
    })

    it('should call multiple middelware once if path matches', () => {
      const router = new Router()

      const handler = (req, res, next) => next()

      const spies = []
      const route = 'test path'

      for (let i = 0; i < 5; i++) {
        const spied = spy(handler)
        spies[i] = spied
        router.use(route, spied)
      }
      router.handle({ route }, {}, () => {})
      for (let i = 0; i < spies.length; i++) {
        expect(spies[i]).to.have.been.calledOnce
      }
    })

    it('should not call middleware if path doesn\'t match', () => {
      const router = new Router()

      const handler = (req, res, next) => next()
      const spied = spy(handler)

      const route1 = 'test path'
      const route2 = 'path test'

      router.use(route1, spied)
      router.handle({ route: route2 }, {}, () => {})
      expect(spied).to.not.have.been.called
    })
  })
})
