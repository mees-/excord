import pathToRegex from 'path-to-regexp'

const debug = require('debug')('zelon:Router')

export default class Router {
  constructor(pathHead = '') {
    debug('new')
    this.middleware = []
    this.pathHead = pathHead
    if (!this.pathHead.endsWith(' ') && this.pathHead !== '') this.pathHead += ' '
  }

  use(path, handler = path instanceof Function ? path : undefined) {
    debug(`new middleware at ${ typeof path === 'string' ? path : 'top' }`)
    let regex
    const keys = []
    if (typeof path === 'string') {
      regex = pathToRegex(path, keys, { delimiter: ' ', end: false })
    } else {
      regex = /[\w\W]*/
    }

    if (handler instanceof Router) {
      this.middleware.push({ regex, keys, handler: handler.handle })
    } else {
      this.middleware.push({ regex, keys, handler })
    }
  }

  hit(path, handler = path instanceof Function ? path : undefined) {
    let regex
    const keys = []
    if (path) {
      regex = pathToRegex(path, keys, { delimiter: ' ', end: true })
    } else {
      throw new Error('hit requires a path to be specified')
    }

    if (handler instanceof Router) {
      throw new Error('hit cannot be used with a Router')
    }
    this.middleware.push({ regex, keys, handler })
  }

  handle(req, res) {
    debug('handling')
    if (!req.route.startsWith(this.pathHead)) {
      throw new Error('This request shouldn\'t be handled by this router')
    }
    const oldRoute = req.route
    req.route = req.route.slice(this.pathHead.length)
    const chain = []
    for (const middleware of this.middleware) {
      const result = middleware.regex.exec(req.route)
      if (result !== null) {
        chain.push({ result, ...middleware })
        Object.assign(req.params, collectParams(middleware.keys, result))
      }
    }
    chain.push({
      handler: () => {
        // at the end of this router restore the original path in the request
        req.route = oldRoute
      }
    })

    let index = 0
    function next() {
      const last = index++
      chain[last].handler(req, res, next)
    }
    next()
  }
}

function collectParams(keys, result) {
  const values = result.slice(1)
  const collection = {}
  for (let i = 0; i < keys.length; i++) {
    collection[keys[i].name] = values[i]
  }

  return collection
}
