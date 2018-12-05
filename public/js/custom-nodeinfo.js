/* global $, io */
$(document).ready((e) => {
  const socket = io.connect(window.location.protocol + '//' + window.location.host + '/nodeinfo')

  socket.on('SystemTime', (SystemTime) => {
    $('#SystemTime').html('')
    let drawingData = '<table class="table"><tbody>'
    $.each(SystemTime.SystemTime, function (key, value) {
      drawingData += `<tr><td>${key}</td><td>${value}</td></tr>`
    })
    $('#SystemTime').append(drawingData + '</tbody></table>')
  })

  socket.on('SystemInfo', (SystemInfo) => {
    $('#SystemInfo').html('')
    let drawingData = '<table class="table"><tbody>'
    $.each(SystemInfo.SystemInfo, function (key, value) {
      drawingData += `<tr><td>${key}</td><td>${value}</td></tr>`
    })
    $('#SystemInfo').append(drawingData + '</tbody></table>')
  })

  socket.on('SystemCPU', (SystemCPU) => {
    $('#SystemCPU').html('')
    let drawingData = '<table class="table"><tbody>'
    $.each(SystemCPU.SystemCPU, function (key, value) {
      drawingData += `<tr><td>${key}</td><td>${value}</td></tr>`
    })
    $('#SystemCPU').append(drawingData + '</tbody></table>')
  })

  socket.on('SystemMem', (SystemMem) => {
    $('#SystemMem').html('')
    let drawingData = '<table class="table"><tbody>'
    $.each(SystemMem.SystemMem, function (key, value) {
      drawingData += `<tr><td>${key}</td><td>${value}</td></tr>`
    })
    $('#SystemMem').append(drawingData + '</tbody></table>')
  })

  socket.on('SystemOSInfo', (SystemOSInfo) => {
    $('#SystemOSInfo').html('')
    let drawingData = '<table class="table"><tbody>'
    $.each(SystemOSInfo.SystemOSInfo, function (key, value) {
      drawingData += `<tr><td>${key}</td><td>${value}</td></tr>`
    })
    $('#SystemOSInfo').append(drawingData + '</tbody></table>')
  })

  socket.on('SystemCurrentLoad', (SystemCurrentLoad) => {
    $('#SystemCurrentLoad').html('')
    let drawingData = '<table class="table"><tbody>'
    $.each(SystemCurrentLoad.SystemCurrentLoad, function (key, value) {
      if (key !== 'cpus') {
        drawingData += `<tr><td>${key}</td><td>${value}</td></tr>`
      }
    })
    $('#SystemCurrentLoad').append(drawingData + '</tbody></table>')
  })

  socket.on('ProcessUpTime', (ProcessUpTime) => {
    $('#ProcessUpTime').html('')
    let drawingData = '<table class="table"><tbody>'
    drawingData += `<tr><td>Process Up Time</td><td>${ProcessUpTime.ProcessUpTime}</td></tr>`
    $('#ProcessUpTime').append(drawingData + '</tbody></table>')
  })

  socket.on('ProcessVersions', (ProcessVersions) => {
    $('#ProcessVersions').html('')
    let drawingData = '<table class="table"><tbody>'
    $.each(ProcessVersions.ProcessVersions, function (key, value) {
      drawingData += `<tr><td>${key}</td><td>${value}</td></tr>`
    })
    $('#ProcessVersions').append(drawingData + '</tbody></table>')
  })

  socket.on('ProcessCPUUsage', (ProcessCPUUsage) => {
    $('#ProcessCPUUsage').html('')
    let drawingData = '<table class="table"><tbody>'
    $.each(ProcessCPUUsage.ProcessCPUUsage, function (key, value) {
      drawingData += `<tr><td>${key}</td><td>${value}</td></tr>`
    })
    $('#ProcessCPUUsage').append(drawingData + '</tbody></table>')
  })

  socket.on('PublicIPV4', (PublicIPV4) => {
    $('#PublicIPv4').html('')
    let drawingData = '<table class="table"><tbody>'
    drawingData += `<tr><td>Public IP v4</td><td>${PublicIPV4.PublicIPV4}</td></tr>`
    $('#PublicIPv4').append(drawingData + '</tbody></table>')
  })

  socket.on('GEOLocation', (GEOLocation) => {
    $('#GEOLocation').html('')
    let drawingData = '<table class="table"><tbody>'
    $.each(GEOLocation.GEOLocation, function (key, value) {
      drawingData += `<tr><td>${key}</td><td>${value}</td></tr>`
    })
    $('#GEOLocation').append(drawingData + '</tbody></table>')
  })
})
