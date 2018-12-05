const NodeData = require('../src/node/node-data')

module.exports = function (socket) {
  const ClientIP = socket.request.connection.remoteAddress
  console.log('Client: ' + ClientIP + ' Connected to Node Info')

  pushInfos(socket)

  const pushInfoLoop = setInterval(() => {
    pushInfos(socket)
  }, 5000)

  socket.on('disconnect', function () {
    console.log('Client: ' + ClientIP + ' Disconnected to Node Info')
    clearInterval(pushInfoLoop)
  })
}

function pushInfos (socket) {
  socket.emit('SystemTime', { SystemTime: NodeData.SysTime() })

  NodeData.SysSystem(data => {
    socket.emit('SystemInfo', { SystemInfo: data })
  })

  NodeData.SysCPU(data => {
    socket.emit('SystemCPU', { SystemCPU: data })
  })

  NodeData.SysMem(data => {
    socket.emit('SystemMem', { SystemMem: data })
  })

  NodeData.SysOSInfo(data => {
    socket.emit('SystemOSInfo', { SystemOSInfo: data })
  })

  NodeData.SysCurrentLoad(data => {
    socket.emit('SystemCurrentLoad', { SystemCurrentLoad: data })
  })

  socket.emit('ProcessUpTime', { ProcessUpTime: NodeData.PUptime() })

  socket.emit('ProcessVersions', { ProcessVersions: NodeData.Pverions() })

  socket.emit('ProcessCPUUsage', { ProcessCPUUsage: NodeData.PCPUUsage() })

  NodeData.PublicIPV4(data => {
    socket.emit('PublicIPV4', { PublicIPV4: data })
  })

  NodeData.Location(data => {
    socket.emit('GEOLocation', { GEOLocation: data })
  })
}
