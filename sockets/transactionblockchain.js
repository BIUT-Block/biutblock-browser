const _ = require('lodash')
const SECMain = require('../src/main')

module.exports = function (socket) {
  const ClientIP = socket.request.connection.remoteAddress
  console.log('Client: ' + ClientIP + ' Connected to SEC Block Node')
  socket.on('Request', ID => {
    SECMain.APIs.getWholeTransactionBlockchain(ID, (err, data) => {
      if (err) console.error(err)
      let TransactionsSum = 0
      data.forEach(_data => {
        TransactionsSum += _data.Transactions.length
      })
      socket.emit('TransactionBlockchain', {
        BlockSum: data.length,
        blockchain: _.takeRight(data, 50).reverse(),
        TransactionsSum: TransactionsSum
      })
    })
  })

  socket.on('disconnect', function () {
    console.log('Client: ' + ClientIP + ' Disconnected to SEC Block Node')
  })
}
