var rs = require('child_process').
  execSync('npx eslint ./src --cache=true --fix=false --quiet=false -f=codeframe')
console.log(rs.toString())

// debugger


