const fs = require('fs')

const filePath = '.git/hooks/pre-commit'

if (!(fs.existsSync(filePath) && /pre-commit/.test(fs.readFileSync(filePath)))) {

  fs.appendFileSync(filePath, `\
#!/usr/bin/env bash
if [ -f "pre-commit" ];then . "pre-commit";fi
`)

}
