module.exports = function Request(message) {
  message.route = message.content

  // use this to store locals for requests
  // this will be populated by the variables in the path
  message.params = new Map()
  // use this to store user defined locals, like database objects
  message.locals = new Map()

  return message
}
