Number.prototype.toTruncFixed = function (dig = 2) {
  const [int, dec] = (this + '.').toString().split('.')
  return int + '.' + (dec + '0'.repeat(dig)).substring(0, dig)
}
