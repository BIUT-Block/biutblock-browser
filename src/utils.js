const SECUtil = require('@biut-block/biutjs-util')
const fs = require('fs')
const path = require('path')
const chargerAddress = 'c4be3c8093fd7acdcdf415331040fc974f8b2ad5'

let Utils = {
  createTransaction: function _createTransaction (sendToAddress, amount, txFee, nonce) {
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
      nonce: nonce,
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
      Buffer.from(transferData[0].nonce),
      Buffer.from(transferData[0].inputData),
      Buffer.from('SEC')
    ]
    let txSigHash = Buffer.from(SECUtil.rlphash(tokenTxBuffer).toString('hex'), 'hex')
    let chargerPrivateKey = fs.readFileSync(path.join(process.cwd(), '/privateKey'), 'utf-8')
    console.log(chargerPrivateKey)
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
