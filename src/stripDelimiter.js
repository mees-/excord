module.exports = function stripDelimiter(str, delimiter) {
  let newStr = str
  if (newStr.startsWith(delimiter)) newStr = newStr.slice(delimiter.length)
  if (newStr.endsWith(delimiter)) newStr = newStr.slice(0, -1 * delimiter.length)
  return newStr
}
