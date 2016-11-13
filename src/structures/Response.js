module.exports = class Response {
  constructor(message) {
    this.message = message
    this.destination = message.channel
    this.params = {}
  }

  end() {
    this.destination.sendMessage(...arguments)
  }
}
