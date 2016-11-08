export default class Response {
  constructor(message, sendSymbol = 'send') {
    this.staged = ''
    this.destination = message.channel
    // define send function under symbol so it isn't accessible in middleware
    this[sendSymbol] = function send() {
      if (this.staged === '') return console.error('Cannot send an empty message')
      this.destination.sendMessage(this.staged)
    }
  }
}
