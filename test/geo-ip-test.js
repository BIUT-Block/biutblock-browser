const fs = require('fs')
const GEOIPReader = require('@maxmind/geoip2-node').Reader
const dbBuffer = fs.readFileSync(process.cwd() + '/src/GeoIP2-City.mmdb')

const geoIPReader = GEOIPReader.openBuffer(dbBuffer)
console.log(geoIPReader.city('128.101.101.101'))
