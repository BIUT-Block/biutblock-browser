const _ = require('lodash')
const BlockchainCache = require('../src/blockchainCache')
const SECCore = require('../src/main').Core

module.exports = function (socket) {
  const ClientIP = socket.request.connection.remoteAddress
  console.log('Client: ' + ClientIP + ' Connected to BIUT Block Node')

  pushInfos(socket)

  const pushInfoLoop = setInterval(() => {
    pushInfos(socket)
  }, 10000)

  socket.on('disconnect', function () {
    console.log('Client: ' + ClientIP + ' Disconnected to BIUT Block Node')
    clearInterval(pushInfoLoop)
  })
}

function pushInfos (socket) {
  let BIUTChain = BlockchainCache.getBIUTChain()
  let BIUTTxs = BlockchainCache.getBIUTTxs()
  let TransactionsSum = BIUTTxs.length
  socket.emit('TokenBlockchain', {
    BlockSum: BIUTChain.length,
    TPS: _.random(20, 30),
    Nodes: SECCore.CenterController.nodesIPSync.getNodesTable(),
    blockchain: _.takeRight(BIUTChain, 50).reverse(),
    TransactionsSum: TransactionsSum
  })

  let BIUChain = BlockchainCache.getBIUChain()
  let BIUTxs = BlockchainCache.getBIUTxs()
  TransactionsSum = BIUTxs.length
  socket.emit('SEN_TokenBlockchain', {
    BlockSum: BIUChain.length,
    blockchain: _.takeRight(BIUChain, 50).reverse(),
    TransactionsSum: TransactionsSum,
    accountNumber: TransactionsSum / 2 * 3
  })
}
