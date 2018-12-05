const SECMain = require('../src/main')

module.exports = function (socket) {
  const ClientIP = socket.request.connection.remoteAddress
  console.log('Client: ' + ClientIP + ' Connected to Token Pool')

  pushInfos(socket)

  const pushInfoLoop = setInterval(() => {
    pushInfos(socket)
  }, 5000)

  socket.on('disconnect', function () {
    console.log('Client: ' + ClientIP + ' Disconnected to Token Pool')
    clearInterval(pushInfoLoop)
  })
}

function pushInfos (socket) {
  socket.emit('TokenPool', {
    Transactions: SECMain.CenterController.BlockChain.TokenPool.getAllTxFromPool().reverse(),
    HashArray: SECMain.CenterController.BlockChain.TokenPool.getTxHashArrayFromPool().reverse()
  })
}
