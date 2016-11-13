const compileMatcher = require('path-to-matcher')
const stripDelimiter = require('../stripDelimiter')

const defaultOptions = { pathHead: '', delimiter: ' ' }

module.exports = class Router {
  constructor(options = {}) {
    this.middleware = []
    // merge passed options into defaults
    this.options = Object.assign({}, defaultOptions, options)
    // this.pathHead is defined by a getter below
  }

  use(path, handle) {
    if (path instanceof Function || path instanceof Router) {
      handle = path
      path = ''
    }

    if (handle instanceof Router) {
      handle.pathHead = path
    }

    let match
    if (path === '') {
      match = function matchAll() {
        return {
          match: true,
          vars: {}
        }
      }
      match.pathParts = []
    } else {
      match = compileMatcher(path, { end: false })
    }
    this.middleware.push({ match, handle })
  }

  hit(path, handle) {
    if (path instanceof Function || path instanceof Router) {
      throw new Error('hit cannot be used without a path')
    }
    if (handle instanceof Router) {
      throw new Error('hit cannot be used with a router')
    }
    if (this.pathHead !== '') {
      path = `${ this.options.pathHead }${ this.options.delimiter }${ path }`
    }
    const match = compileMatcher(path, { end: true })
    this.middleware.push({ match, handle })
  }

  handle(req, res, endOfRouter) {
    // ensure pass-by-value with Array.from
    const chain = Array.from(this.middleware)

    function next(route) {
      if (typeof route === 'string') req.route = route

      let current = chain.shift()
      if (!current) {
        // chain is empty
        try {
          endOfRouter()
        } catch (e) {}
        return

      }
      // loop to next machting middleware
      while (!current.match(req.route).match) {
        current = chain.shift()
        if (!current) {
          try {
            endOfRouter()
          } catch (e) {}
          return
        }
      }
      // apply req.params from match
      const result = current.match(req.route)
      for (const param in result.vars) { /* eslint guard-for-in: off */
        req.params.set(param, result.vars[param])
      }

      if (current.handle instanceof Router) {
        req.route = req.route.slice(current.handle.pathHead.length)
        current.handle.handle(req, res, next)
        req.route = `${ current.handle.pathHead }${ req.route }`
      } else {
        current.handle(req, res, next)
      }
    }
    next()
  }

  get pathHead() {
    return this.options.pathHead
  }

  set pathHead(value) {
    this.options.pathHead = stripDelimiter(value, this.options.delimiter)
  }
}
