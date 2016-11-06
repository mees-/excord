import { Client } from 'discord.js'

const log = require('debug')('zelon:index')

module.exports = class Zelon extends Client {
  constructor() {
    log('create')
    super(...arguments)

    this.middleware = []

    this.on('message', (message) => {
      log(`Got message: '${ message.content }'`)
      const chain = this.middleware
        .map(current => Object.assign({}, current, { result: current.test.exec(message.content) }))
        .filter(value => value !== null)

      // push an empty function to end the chain
      chain.push({ handler: () => log('End of chain') })

      let index = 0
      log('chain', chain)
      function next() {
        const last = index++
        // attach regex result to message
        message.reg = chain[last].result
        chain[last].handler(message, next)
      }
      // start the chain
      next()
    })
  }

  use(path, handler = path instanceof Function ? path : undefined) {
    const middleware = { handler, index: this.middleware.length }
    if (typeof path === 'string') {
      middleware.test = new RegExp(`^${ path }`) // add the ^ character to match start of string
    } else if (path instanceof RegExp) {
      middleware.test = path
    } else { // invalid/no path given
      middleware.test = /[\s\S]*/ // match all strings
    }
    this.middleware.push(middleware)
  }
}
