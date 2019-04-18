const Node = require('@sec-block/secjs-node')

exports.Core = new Node.Core()
const RPC = new Node.RPC(exports.Core)

exports.run = function () {
  exports.Core.run()
  RPC.runRPCServer()
}
