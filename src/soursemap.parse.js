var soursemap = {
  mappings: '',
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
/*
https://www.ruanyifeng.com/blog/2013/01/javascript_source_map.html

　　第一步，将16改写成二进制形式10000。
　　第二步，在最右边补充符号位。因为16大于0，所以符号位为0，整个数变成100000。
　　第三步，从右边的最低位开始，将整个数每隔5位，进行分段，即变成1和00000两段。如果最高位所在的段不足5位，则前面补0，因此两段变成00001和00000。
　　第四步，将两段的顺序倒过来，即00000和00001。
　　第五步，在每一段的最前面添加一个"连续位"，除了最后一段为0，其他都为1，即变成100000和000001。
　　第六步，将每一段转成Base 64编码。

   16 => gB

   https://www.murzwin.com/base64vlq.html
   16907 => 2ghB
*/

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
function numberToBase64Char(number) {
  if (number-63>=0) return '/'
  if (number-62>=0) return '+'
  if (number-52>=0) return String.fromCharCode('0'.charCodeAt()+(number-52))
  if (number-26>=0) return String.fromCharCode('a'.charCodeAt()+(number-26))
  if (number-0>=0) return String.fromCharCode('A'.charCodeAt()+(number-0))
}

function numberToBiNumber(n) {
  return n.toString(2).padStart(6, '0')
}
function biNumberToNumber(biNumber) {
  return parseInt(biNumber, 2)
}


function base64CharsToBiNumberArray(chars) {
  return chars.split('').map(c => {
    return numberToBiNumber(base64CharToNumber(c))
  })
}

console.log(numberToBiNumber(16))
//       010000
//       0100000
//  00001  00000
//  00000  00001
// 100000 000001
console.log(numberToBase64Char(biNumberToNumber('100000')))
console.log(numberToBase64Char(biNumberToNumber('000001')))


console.log(base64CharsToBiNumberArray('AACA'))
console.log(base64CharsToBiNumberArray('AABA'))
console.log(base64CharsToBiNumberArray('CCDC'))
console.log(base64CharsToBiNumberArray('SAAU'))

console.log(numberToBiNumber(16907))
//             100001000001011
//             1000010000010110 // +0
//   00001  00001  00000  10110 // /5
//   10110  00000  00001  00001 // reverse
//  110110 100000 100001 000001 // 1+ ... 0+

console.log(numberToBase64Char(biNumberToNumber('110110')))
console.log(numberToBase64Char(biNumberToNumber('100000')))
console.log(numberToBase64Char(biNumberToNumber('100001')))
console.log(numberToBase64Char(biNumberToNumber('000001')))
