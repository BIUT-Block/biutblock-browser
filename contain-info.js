#!/usr/bin/node

const request = require('request')
const chalk = require('chalk')

const Domains = [
  { Node: 'frankfurt', URL: 'http://sec-frankfurt-bootstrap:3001/tokenblockhashlist', Data: [] },
  { Node: 'seoul', URL: 'http://sec-seoul-bootstrap:3001/tokenblockhashlist', Data: [] },
  { Node: 'tokyo', URL: 'http://sec-tokyo-bootstrap:3001/tokenblockhashlist', Data: [] },
  { Node: 'paris', URL: 'http://sec-paris-bootstrap:3001/tokenblockhashlist', Data: [] },
  { Node: 'shenzhen', URL: 'http://sec-shenzhen:3001/tokenblockhashlist', Data: [] }
]

const report = {
  frankfurt: {},
  seoul: {},
  tokyo: {},
  paris: {},
  shenzhen: {}
}

requestLoop(0)

function requestLoop (index) {
  let domain = Domains[index]
  request.get(domain.URL, (err, res, body) => {
    if (err) return console.error(err)
    domain.Data = JSON.parse(body)
    console.log(`Receive data from ${domain.URL}`)
    if (index < Domains.length - 1) {
      requestLoop(index + 1)
    } else {
      console.log('All Data received, now analysis...')
      parseData()
    }
  })
}

function parseData () {
  Domains.forEach(domain => {
    console.log(`\nContinuity check of Node ${domain.Node}`)
    domain.Data.forEach((data, index) => {
      if (index !== 0) {
        if (data.ParentHash !== domain.Data[index - 1].Hash) {
          console.log(chalk.red(`Continuity check error of Node ${domain.Node} for Block ${index - 1} and Block ${index}`))
          console.log(data)
          console.log(domain.Data[index - 1])
          report[domain.Node].continuity = report[domain.Node].continuity ? parseInt(report[domain.Node].continuity) + 1 : 1
        }
      }
    })
  })
  Domains.forEach(domain => {
    Domains.forEach(_domain => {
      if (domain.Node !== _domain.Node) {
        console.log(`\nConsistency check between Nodes ${domain.Node} and ${_domain.Node}`)
        for (let i = 0; i < domain.Data.length; i++) {
          if (i < _domain.Data.length) {
            if (JSON.stringify(domain.Data[i]) !== JSON.stringify(_domain.Data[i])) {
              console.log(`Consistency check error between Nodes ${domain.Node} and ${_domain.Node}`)
              console.log(`Data on ${domain.Node}: `)
              console.log(domain.Data[i])
              console.log(`Data on ${_domain.Node}: `)
              console.log(_domain.Data[i])
              report[domain.Node][`consistency_${domain.Node}_${_domain.Node}`] = report[domain.Node][`consistency_${domain.Node}_${_domain.Node}`] ? parseInt(report[domain.Node][`consistency_${domain.Node}_${_domain.Node}`]) + 1 : 1
            }
          }
        }
      }
    })
  })
  console.log(report)
}
