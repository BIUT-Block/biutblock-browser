const SECUtil = require('@biut-block/biutjs-util')
const chargerAddress = 'c4be3c8093fd7acdcdf415331040fc974f8b2ad5'
const chargerPrivateKey = 'f847ed41c167b3d89fd79b634a8049dd3a49ada638c494e170e02daf119b0187'

let Utils = {
  createTransaction: function _createTransaction (sendToAddress, amount, txFee) {
    let timeStamp = new Date().getTime()
    let transferData = [{
      timestamp: timeStamp,
      from: chargerAddress,
      to: sendToAddress,
      value: amount,
      txFee: txFee,
      gasLimit: '0',
      gas: '0',
      gasPrice: '0',
      data: '',
      inputData: ''
    }]
    const tokenTxBuffer = [
      SECUtil.bufferToInt(transferData[0].timestamp),
      Buffer.from(transferData[0].from, 'hex'),
      Buffer.from(transferData[0].to, 'hex'),
      Buffer.from(transferData[0].value),
      Buffer.from(transferData[0].gasLimit),
      Buffer.from(transferData[0].gas),
      Buffer.from(transferData[0].gasPrice),
      Buffer.from(transferData[0].inputData)
    ]
    let txSigHash = Buffer.from(SECUtil.rlphash(tokenTxBuffer).toString('hex'), 'hex')
    let signature = SECUtil.ecsign(txSigHash, Buffer.from(chargerPrivateKey, 'hex'))
    transferData[0].data = {
      v: signature.v,
      r: signature.r.toString('hex'),
      s: signature.s.toString('hex')
    }
    return transferData
  }
}

module.exports = Utils
