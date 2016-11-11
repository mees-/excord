module.exports = class Response {
  constructor(message) {
    this.message = message
    this.destination = message.channel
    this.params = {}
  }

  end(str) {
    this.destination.sendMessage(str)
  }
}
