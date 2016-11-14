const strip = require('../src/stripDelimiter')
const { describe, it } = require('mocha')
const { expect } = require('chai')

describe('stripDelimiter', () => {
  it('should remove delimiters from the beginning', () => {
    const original = ' hello i am mees'
    const stripped = strip(original, ' ')
    expect(stripped).to.equal('hello i am mees')
  })

  it('should remove delimiters from the end', () => {
    const original = 'hello i am mees '
    const stripped = strip(original, ' ')
    expect(stripped).to.equal('hello i am mees')
  })

  it('should remove delimiters from the beginning and end in the same string', () => {
    const original = ' hello i am mees '
    const stripped = strip(original, ' ')
    expect(stripped).to.equal('hello i am mees')
  })
})
