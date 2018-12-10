const SECCORE = require('@sec-block/secjs-core')
const SECRPC = require('@sec-block/secjs-rpc')

exports.secCore = SECCORE.core
exports.secRpc = new SECRPC(exports.secCore)

exports.run = function () {
  SECCORE.run()
  exports.secRpc.runRPCServer()
}
