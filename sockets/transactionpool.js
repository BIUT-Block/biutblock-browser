const SECMain = require('../src/main')

module.exports = socket => {
  const ClientIP = socket.request.connection.remoteAddress
  console.log('Client: ' + ClientIP + ' Connected to Transaction Pool')

  socket.on('Request', ID => {
    socket.emit('TransactionPool', {
      Transactions: SECMain.CenterController.BlockChain.TxPoolDict[ID].getAllTxFromPool().reverse(),
      HashArray: SECMain.CenterController.BlockChain.TxPoolDict[ID].getTxHashArrayFromPool().reverse()
    })
  })

  socket.on('disconnect', () => {
    console.log('Client: ' + ClientIP + ' Disconnected to Transaction Pool')
  })
}
