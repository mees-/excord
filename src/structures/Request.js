module.exports = class Request {
  constructor(message) {
    for (const prop in message) {
      this[prop] = message[prop]
    }
    this._message = message
    this.route = this.content

    // use this to store locals for requests
    // this will be populated by the variables in the path
    this.params = new Map()
  }
}
