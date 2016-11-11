const { Client } = require('discord.js')
const Router = require('./structures/Router')
const Request = require('./structures/Request')
const Response = require('./structures/Response')

module.exports = class Excord extends Client {
  constructor(options) {
    super(options)
    this.router = new Router(options)
    this.on('message', (message) => {
      const req = new Request(message)
      const res = new Response(message)
      this.router.handle(req, res)
    })
  }

  use() {
    this.router.use(...arguments)
  }

  hit() {
    this.router.hit(...arguments)
  }
}

module.exports.Router = Router
