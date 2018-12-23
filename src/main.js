const SECNODE = require('@sec-block/secjs-node')

exports.secCore = new SECNODE.Core()
const secRPC = new SECNODE.RPC(exports.secCore)

exports.run = function () {
  exports.secCore.run()
  secRPC.runRPCServer()
}
