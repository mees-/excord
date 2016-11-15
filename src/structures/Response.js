const debug = require('debug')('excord:Response')

module.exports = class Response {
  constructor(message) {
    this.message = message
    this.destination = message.channel
    // use this to store user defined locals
    this.locals = new Map()
  }

  send() {
    this.destination.sendMessage(...arguments)
  }

  // forward end to send for backwards compatibility
  end() {
    debug('response.end is DEPRECATED, use response.send instead')
    this.send(...arguments)
  }
}
