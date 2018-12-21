const SECNODE = require('@sec-block/secjs-node')

exports.secCore = new SECNODE.Core()
const secRpc = new SECNODE.Rpc(exports.secCore)

exports.run = function () {
  exports.secCore.run()
  secRpc.runRPCServer()
}
