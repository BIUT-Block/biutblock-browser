const SECCORE = require('@sec-block/secjs-core')
const SECRPC = require('@sec-block/secjs-rpc')

let secCore = SECCORE.core
let secRpc = new SECRPC(secCore)

exports.run = function () {
  SECCORE.coreRun()
  secRpc.runRPCServer()
}
