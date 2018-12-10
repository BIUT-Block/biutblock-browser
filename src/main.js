const SECCORE = require('@sec-block/secjs-core')
const SECRPC = require('@sec-block/secjs-rpc')

exports.secCore = new SECCORE()
const secRpc = new SECRPC(exports.secCore)

exports.run = function () {
  exports.secCore.run()
  secRpc.runRPCServer()
}
