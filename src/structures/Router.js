const compileMatcher = require('path-to-matcher')
const stripDelimiter = require('../stripDelimiter')

const defaultOptions = { pathHead: '', delimiter: ' ' }

module.exports = class Router {
  constructor(options = {}) {
    this.middleware = []
    this.options = Object.assign({}, defaultOptions, options)
  }

  use(path, handle, useDelimiter = true) {
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
    this.middleware.push({ match, handle, useDelimiter })
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
      for (const param in result.vars) {
        if (!result.vars.hasOwnProperty(param)) continue
        req.params.set(param, result.vars[param])
      }

      if (current.handle instanceof Router) {
        req.route = req.route.slice(current.handle.pathHead.length)
        console.log('current.pathHead', current.handle.pathHead)
        console.log('req.route:', req.route)
        current.handle.handle(req, res, next)
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
