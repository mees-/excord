module.exports = class Request {
  constructor(message) {
    Object.assign(this, message)
    this.route = this.content

    // use this to store locals for requests
    // this will be populated by the variables in the path
    this.params = new Map()
  }
}
