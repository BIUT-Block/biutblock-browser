const fs = require('fs')
const path = require('path')
let chargerPrivateKey = fs.readFileSync(path.join(process.cwd(), '/privateKey'), 'utf-8')
console.log(chargerPrivateKey)
