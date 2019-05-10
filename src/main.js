const Node = require('@biut-block/biutjs-node')

exports.Core = new Node.Core()
const RPC = new Node.RPC(exports.Core)

exports.run = function () {
  exports.Core.run()
  RPC.runRPCServer()
}
