const SECCORE = require('@sec-block/secjs-core')
const SECRPC = require('@sec-block/secjs-rpc')

const secCore = new SECCORE()
const secRpc = new SECRPC(secCore)

exports.run = function () {
  secCore.run()
  secRpc.runRPCServer()
}
