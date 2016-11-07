require('source-map-support').install()
import { Client } from 'discord.js'
import Router from './Router'
import Request from './Request'
import Response from './Response'

const debug = require('debug')('excord:index')

const defaultOptions = { ignoreSelf: true }

module.exports = class Excord extends Client {
  constructor(options = defaultOptions) {
    debug('created new excord')
    // init discord client
    super(options)

    // use this to not allow middleware to access the send method on responses
    const sendSymbol = Symbol()

    // create router
    this.router = new Router()
    this.router.use((req, res, next) => {
      if (req.author.equals(this.user) && options.ignoreSelf) return
      next()
      if (typeof res.staged === 'string' && res.staged !== '') res[sendSymbol]()
    })

    // turn message into req/res pair and pass them to the router
    this.on('message', (message) => {
      debug('message')
      const req = new Request(message)
      const res = new Response(message, sendSymbol)

      this.router.handle(req, res)
    })
  }

  use() {
    debug('new use middleware')
    this.router.use(...arguments)
  }

  hit() {
    debug('new hit middleware')
    this.router.hit(...arguments)
  }
}

exports.Router = Router
