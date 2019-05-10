const SECCore = require('../src/main').Core

module.exports = socket => {
  const ClientIP = socket.request.connection.remoteAddress
  console.log('Client: ' + ClientIP + ' Connected to Transaction Pool')

  socket.on('Request', ID => {
    socket.emit('TransactionPool', {
      Transactions: SECCore.CenterController.BlockChain.TxPoolDict[ID].getAllTxFromPool().reverse(),
      HashArray: SECCore.CenterController.BlockChain.TxPoolDict[ID].getTxHashArrayFromPool().reverse()
    })
  })

  socket.on('disconnect', () => {
    console.log('Client: ' + ClientIP + ' Disconnected to Transaction Pool')
  })
}
