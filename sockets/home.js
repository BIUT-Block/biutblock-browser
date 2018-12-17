const _ = require('lodash')
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
    data.forEach(_data => {
      TransactionsSum += _data.Transactions.length
    })
    socket.emit('TokenBlockchain', {
      BlockSum: data.length,
      TPS: _.random(20, 30),
      blockchain: _.takeRight(data, 50).reverse(),
      TransactionsSum: TransactionsSum
    })
  })
}
