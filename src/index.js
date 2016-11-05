import { Client } from 'discord.js'

const log = require('debug')('zelon:index')

export default class Zelon extends Client {
  constructor() {
    log('create')
    super(...arguments)

    this.middleware = []

    this.on('message', (message) => {
      const chain = this.middleware
        .map(current => Object.assign({}, current, { result: current.test.exec(message.content) }))
        .filter(value => value !== null)
        .sort((a, b) => {
          if (a.result[0].length !== b.result[0].length) {
            return a.result[0].length - b.result[0].length
          }
          if (a.index > b.index) {
            return 1
          }
          return -1
        })

      let index = 0
      function next() {
        index++
        chain[index].handler(message, next)
      }
      chain[0].handler(message, next)
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
