module.exports = class Response {
  constructor(message) {
    this.message = message
    this.destination = message.channel
    // use this to store user defined locals
    this.locals = new Map()
  }

  end() {
    this.destination.sendMessage(...arguments)
  }
}
