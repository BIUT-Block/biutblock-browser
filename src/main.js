const SECNODE = require('@sec-block/secjs-node')

exports.secCore = new SECNODE.Core()
const secRpc = new SECNODE.RPC(exports.secCore)

exports.run = function () {
  exports.secCore.run()
  secRpc.runRPCServer()
}
