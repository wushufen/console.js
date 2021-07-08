var soursemap = {
  mappings: ``
}

mappings =
`
outputLine:(
  pos:(
    outputColumn sources[i] sourceLine sourceColumn names[i]?
  ),
  pos:(
    outputColumn:(
      100000 100000 000000 ...
    )
    outputColumn:(
      base64Char base64Char base64Char ...
    )
  )
);
`
posItem =
`
100000 100000 000000
`
n = 1
posItem[(1 * n) - 1] = '是否连续下6位'
posItem[(2 * n) - 1] = '数值的一部分'
posItem[(5 * n) - 1] = '数值的一部分'
posItem[(6 * n) - 1] = '数值的一部分'
posItem[(6 * 1) - 1] = '正负' // 第一组6位的最后一位表示正负

posPartBase64Char =
`
A
`

// A => 0
// a => 26
// 0 => 52
function base64CharToNumber(c) {
  if (c >= 'A' && c <= 'Z') {
    return c.charCodeAt() - 'A'.charCodeAt()
  }
  if (c >= 'a' && c <= 'z') {
    return c.charCodeAt() - 'a'.charCodeAt() + 26
  }
  if (c >= '0' && c <= '9') {
    return c.charCodeAt() - '0'.charCodeAt() + 52
  }
  return {
    '+': 62,
    '/': 63,
  }[c]
}

function numberTo6Bit(n) {
  return n.toString(2).padStart(6, '0')
}

console.log(com(numberTo6Bit, base64CharToNumber)('A'))



var number = 64
var bi = 1000000
var vlq = '00010 00000'