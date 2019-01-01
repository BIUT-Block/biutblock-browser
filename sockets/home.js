const _ = require('lodash')
const request = require('request')
const SECCore = require('../src/main').secCore

module.exports = function (socket) {
  const ClientIP = socket.request.connection.remoteAddress
  console.log('Client: ' + ClientIP + ' Connected to SEC Block Node')

  pushInfos(socket)

  const pushInfoLoop = setInterval(() => {
    pushInfos(socket)
  }, 5000)

  socket.on('disconnect', function () {
    console.log('Client: ' + ClientIP + ' Disconnected to SEC Block Node')
    clearInterval(pushInfoLoop)
  })
}

function pushInfos (socket) {
  SECCore.APIs.getWholeTokenBlockchain((err, data) => {
    if (err) console.error(err)
    let TransactionsSum = 0
    let Accounts = []
    data.forEach(_data => {
      if (typeof _data.Transactions !== 'object') {
        _data.Transactions = JSON.stringify(_data.Transactions)
      }
      TransactionsSum += _data.Transactions.length
      _data.Transactions.forEach(_tx => {
        if (Accounts.indexOf(_tx.TxFrom < 0)) {
          Accounts.push(_tx.TxFrom)
        }
        if (Accounts.indexOf(_tx.TxTo < 0)) {
          Accounts.push(_tx.TxTo)
        }
      })
    })
    request({ url: 'https://api.fcoin.com/v2/market/ticker/seceth', method: 'GET', json: true }, function (error, response, body) {
      if (error) {
        console.err(error)
      }
      socket.emit('TokenBlockchain', {
        BlockSum: data.length,
        TPS: _.random(20, 30),
        Nodes: SECCore.CenterController.nodesIPSync.getNodesTable(),
        price: _.get(body, 'data.ticker[0]', '0.00031'),
        blockchain: _.takeRight(data, 50).reverse(),
        TransactionsSum: TransactionsSum,
        accountNumber: Accounts.length
      })
    })
  })
}
