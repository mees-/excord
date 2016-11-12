module.exports = function Request(message) {
  message.route = message.content

  // use this to store locals for requests
  // this will be populated by the variables in the path
  message.params = new Map()

  return message
}
